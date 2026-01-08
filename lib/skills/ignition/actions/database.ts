// Ignition Database Action Handler
// Handles db:query, db:insert, db:update, db:delete, db:upsert

import { supabaseAdmin } from '@/lib/db/supabase'
import {
  ActionConfig,
  ActionResult,
  ExecutionContext,
  DbActionConfig,
} from '../types'
import { resolveObjectTemplates } from '../context'
import { createErrorResult, createSuccessResult } from './registry'

/**
 * Main database action handler
 */
export async function databaseHandler(
  context: ExecutionContext,
  config: ActionConfig
): Promise<ActionResult> {
  const dbConfig = config as DbActionConfig
  const { type, table } = dbConfig

  // Verify table access permission
  const hasTablePermission = checkTablePermission(context, table)
  if (!hasTablePermission) {
    return createErrorResult(
      `No permission to access table: ${table}. Granted permissions: ${context.permissions.join(', ')}`
    )
  }

  // Resolve template variables in config
  const resolvedConfig = resolveObjectTemplates(dbConfig, context) as DbActionConfig

  switch (type) {
    case 'db:query':
      return handleQuery(resolvedConfig)
    case 'db:insert':
      return handleInsert(resolvedConfig, context)
    case 'db:update':
      return handleUpdate(resolvedConfig, context)
    case 'db:delete':
      return handleDelete(resolvedConfig, context)
    case 'db:upsert':
      return handleUpsert(resolvedConfig, context)
    default:
      return createErrorResult(`Unknown database action type: ${type}`)
  }
}

/**
 * Check if context has permission to access a table
 */
function checkTablePermission(context: ExecutionContext, table: string): boolean {
  for (const permission of context.permissions) {
    // database:* grants all access
    if (permission === 'database:*') return true
    // database:tablename grants specific access
    if (permission === `database:${table}`) return true
    // database:prefix_* grants wildcard access
    if (permission.startsWith('database:') && permission.endsWith('*')) {
      const prefix = permission.replace('database:', '').replace('*', '')
      if (table.startsWith(prefix)) return true
    }
  }
  return false
}

/**
 * Handle database query (SELECT)
 */
async function handleQuery(config: DbActionConfig): Promise<ActionResult> {
  const { table, where, select, limit, orderBy } = config

  try {
    let query = supabaseAdmin.from(table).select(select?.join(', ') || '*')

    // Apply where conditions
    if (where) {
      for (const [key, value] of Object.entries(where)) {
        if (value === null) {
          query = query.is(key, null)
        } else if (typeof value === 'object' && value !== null) {
          // Handle operators like { gt: 5 }, { in: [1,2,3] }
          const ops = value as Record<string, any>
          if ('gt' in ops) query = query.gt(key, ops.gt)
          if ('gte' in ops) query = query.gte(key, ops.gte)
          if ('lt' in ops) query = query.lt(key, ops.lt)
          if ('lte' in ops) query = query.lte(key, ops.lte)
          if ('in' in ops) query = query.in(key, ops.in)
          if ('like' in ops) query = query.like(key, ops.like)
          if ('ilike' in ops) query = query.ilike(key, ops.ilike)
          if ('neq' in ops) query = query.neq(key, ops.neq)
        } else {
          query = query.eq(key, value)
        }
      }
    }

    // Apply ordering
    if (orderBy) {
      query = query.order(orderBy.column, { ascending: orderBy.ascending ?? true })
    }

    // Apply limit
    if (limit) {
      query = query.limit(limit)
    }

    const { data, error } = await query

    if (error) {
      return createErrorResult(`Query failed: ${error.message}`)
    }

    return createSuccessResult(
      { rows: data, count: data?.length ?? 0 },
      {
        reversible: false, // Queries are not reversible
        metadata: { action: 'query', table, rowCount: data?.length ?? 0 },
      }
    )
  } catch (err) {
    return createErrorResult(
      `Query error: ${err instanceof Error ? err.message : 'Unknown error'}`
    )
  }
}

/**
 * Handle database insert
 */
async function handleInsert(
  config: DbActionConfig,
  context: ExecutionContext
): Promise<ActionResult> {
  const { table, data } = config

  if (!data) {
    return createErrorResult('Insert requires data')
  }

  try {
    // Add user_id if not present and available
    const insertData = { ...data }
    if (!insertData.user_id && context.userId) {
      insertData.user_id = context.userId
    }

    const { data: inserted, error } = await supabaseAdmin
      .from(table)
      .insert(insertData)
      .select()
      .single()

    if (error) {
      return createErrorResult(`Insert failed: ${error.message}`)
    }

    return createSuccessResult(
      { inserted, id: inserted?.id },
      {
        beforeState: null,
        afterState: inserted,
        reversible: true,
        metadata: { action: 'insert', table, id: inserted?.id },
      }
    )
  } catch (err) {
    return createErrorResult(
      `Insert error: ${err instanceof Error ? err.message : 'Unknown error'}`
    )
  }
}

/**
 * Handle database update
 */
async function handleUpdate(
  config: DbActionConfig,
  context: ExecutionContext
): Promise<ActionResult> {
  const { table, data, where } = config

  if (!data) {
    return createErrorResult('Update requires data')
  }
  if (!where) {
    return createErrorResult('Update requires where clause for safety')
  }

  try {
    // First, get current state for rollback
    let selectQuery = supabaseAdmin.from(table).select('*')
    for (const [key, value] of Object.entries(where)) {
      selectQuery = selectQuery.eq(key, value)
    }
    const { data: beforeData } = await selectQuery

    // Perform update
    let updateQuery = supabaseAdmin.from(table).update(data)
    for (const [key, value] of Object.entries(where)) {
      updateQuery = updateQuery.eq(key, value)
    }
    const { data: updated, error } = await updateQuery.select()

    if (error) {
      return createErrorResult(`Update failed: ${error.message}`)
    }

    return createSuccessResult(
      { updated, count: updated?.length ?? 0 },
      {
        beforeState: beforeData,
        afterState: updated,
        reversible: true,
        metadata: { action: 'update', table, count: updated?.length ?? 0 },
      }
    )
  } catch (err) {
    return createErrorResult(
      `Update error: ${err instanceof Error ? err.message : 'Unknown error'}`
    )
  }
}

/**
 * Handle database delete
 */
async function handleDelete(
  config: DbActionConfig,
  context: ExecutionContext
): Promise<ActionResult> {
  const { table, where } = config

  if (!where) {
    return createErrorResult('Delete requires where clause for safety')
  }

  try {
    // First, get current state for rollback
    let selectQuery = supabaseAdmin.from(table).select('*')
    for (const [key, value] of Object.entries(where)) {
      selectQuery = selectQuery.eq(key, value)
    }
    const { data: beforeData } = await selectQuery

    // Perform delete
    let deleteQuery = supabaseAdmin.from(table).delete()
    for (const [key, value] of Object.entries(where)) {
      deleteQuery = deleteQuery.eq(key, value)
    }
    const { error } = await deleteQuery

    if (error) {
      return createErrorResult(`Delete failed: ${error.message}`)
    }

    return createSuccessResult(
      { deleted: true, count: beforeData?.length ?? 0 },
      {
        beforeState: beforeData,
        afterState: null,
        reversible: true,
        metadata: { action: 'delete', table, count: beforeData?.length ?? 0 },
      }
    )
  } catch (err) {
    return createErrorResult(
      `Delete error: ${err instanceof Error ? err.message : 'Unknown error'}`
    )
  }
}

/**
 * Handle database upsert
 */
async function handleUpsert(
  config: DbActionConfig,
  context: ExecutionContext
): Promise<ActionResult> {
  const { table, data, where } = config

  if (!data) {
    return createErrorResult('Upsert requires data')
  }

  try {
    // Add user_id if not present and available
    const upsertData = { ...data }
    if (!upsertData.user_id && context.userId) {
      upsertData.user_id = context.userId
    }

    // Get before state if exists
    let beforeData = null
    if (where) {
      let selectQuery = supabaseAdmin.from(table).select('*')
      for (const [key, value] of Object.entries(where)) {
        selectQuery = selectQuery.eq(key, value)
      }
      const { data: existing } = await selectQuery.single()
      beforeData = existing
    }

    // Perform upsert
    const { data: upserted, error } = await supabaseAdmin
      .from(table)
      .upsert(upsertData)
      .select()
      .single()

    if (error) {
      return createErrorResult(`Upsert failed: ${error.message}`)
    }

    return createSuccessResult(
      { upserted, id: upserted?.id, wasUpdate: !!beforeData },
      {
        beforeState: beforeData,
        afterState: upserted,
        reversible: true,
        metadata: {
          action: 'upsert',
          table,
          id: upserted?.id,
          wasUpdate: !!beforeData,
        },
      }
    )
  } catch (err) {
    return createErrorResult(
      `Upsert error: ${err instanceof Error ? err.message : 'Unknown error'}`
    )
  }
}
