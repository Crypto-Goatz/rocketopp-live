// Skill Action Logger
// Logs all skill actions for audit trail and rollback capability

import { supabaseAdmin } from '@/lib/db/supabase'
import { ActionType, SkillLog, SkillContext } from './types'

export interface LogEntry {
  action: ActionType
  target: string
  beforeState?: any
  afterState?: any
  metadata?: Record<string, any>
  reversible?: boolean
}

/**
 * Create a new log entry for a skill action
 */
export async function logAction(
  installationId: string,
  entry: LogEntry
): Promise<SkillLog | null> {
  try {
    const { data, error } = await supabaseAdmin
      .from('skill_logs')
      .insert({
        installation_id: installationId,
        action: entry.action,
        target: entry.target,
        before_state: entry.beforeState || null,
        after_state: entry.afterState || null,
        metadata: entry.metadata || {},
        reversible: entry.reversible ?? true,
      })
      .select()
      .single()

    if (error) {
      console.error('Failed to log skill action:', error)
      return null
    }

    return data as SkillLog
  } catch (err) {
    console.error('Error logging skill action:', err)
    return null
  }
}

/**
 * Log a file creation
 */
export async function logFileCreate(
  installationId: string,
  filePath: string,
  content: string,
  metadata?: Record<string, any>
): Promise<SkillLog | null> {
  return logAction(installationId, {
    action: 'file_create',
    target: filePath,
    beforeState: null,
    afterState: { content, size: content.length },
    metadata,
    reversible: true,
  })
}

/**
 * Log a file modification
 */
export async function logFileModify(
  installationId: string,
  filePath: string,
  beforeContent: string,
  afterContent: string,
  metadata?: Record<string, any>
): Promise<SkillLog | null> {
  return logAction(installationId, {
    action: 'file_modify',
    target: filePath,
    beforeState: { content: beforeContent, size: beforeContent.length },
    afterState: { content: afterContent, size: afterContent.length },
    metadata,
    reversible: true,
  })
}

/**
 * Log a file deletion
 */
export async function logFileDelete(
  installationId: string,
  filePath: string,
  content: string,
  metadata?: Record<string, any>
): Promise<SkillLog | null> {
  return logAction(installationId, {
    action: 'file_delete',
    target: filePath,
    beforeState: { content, size: content.length },
    afterState: null,
    metadata,
    reversible: true,
  })
}

/**
 * Log a database insert
 */
export async function logDbInsert(
  installationId: string,
  tableName: string,
  recordId: string,
  record: any,
  metadata?: Record<string, any>
): Promise<SkillLog | null> {
  return logAction(installationId, {
    action: 'db_insert',
    target: `${tableName}:${recordId}`,
    beforeState: null,
    afterState: record,
    metadata,
    reversible: true,
  })
}

/**
 * Log a database update
 */
export async function logDbUpdate(
  installationId: string,
  tableName: string,
  recordId: string,
  beforeRecord: any,
  afterRecord: any,
  metadata?: Record<string, any>
): Promise<SkillLog | null> {
  return logAction(installationId, {
    action: 'db_update',
    target: `${tableName}:${recordId}`,
    beforeState: beforeRecord,
    afterState: afterRecord,
    metadata,
    reversible: true,
  })
}

/**
 * Log a database deletion
 */
export async function logDbDelete(
  installationId: string,
  tableName: string,
  recordId: string,
  record: any,
  metadata?: Record<string, any>
): Promise<SkillLog | null> {
  return logAction(installationId, {
    action: 'db_delete',
    target: `${tableName}:${recordId}`,
    beforeState: record,
    afterState: null,
    metadata,
    reversible: true,
  })
}

/**
 * Log an API call
 */
export async function logApiCall(
  installationId: string,
  endpoint: string,
  method: string,
  request: any,
  response: any,
  metadata?: Record<string, any>
): Promise<SkillLog | null> {
  return logAction(installationId, {
    action: 'api_call',
    target: `${method} ${endpoint}`,
    beforeState: request,
    afterState: response,
    metadata,
    reversible: false, // API calls are generally not reversible
  })
}

/**
 * Log an environment variable change
 */
export async function logEnvSet(
  installationId: string,
  envName: string,
  oldValue: string | null,
  newValue: string,
  metadata?: Record<string, any>
): Promise<SkillLog | null> {
  return logAction(installationId, {
    action: 'env_set',
    target: envName,
    beforeState: oldValue ? { value: '[REDACTED]' } : null,
    afterState: { value: '[REDACTED]' }, // Don't log actual env values
    metadata,
    reversible: true,
  })
}

/**
 * Log a config change
 */
export async function logConfigChange(
  installationId: string,
  configKey: string,
  oldValue: any,
  newValue: any,
  metadata?: Record<string, any>
): Promise<SkillLog | null> {
  return logAction(installationId, {
    action: 'config_change',
    target: configKey,
    beforeState: oldValue,
    afterState: newValue,
    metadata,
    reversible: true,
  })
}

/**
 * Log a skill installation
 */
export async function logInstall(
  installationId: string,
  skillSlug: string,
  config: any,
  metadata?: Record<string, any>
): Promise<SkillLog | null> {
  return logAction(installationId, {
    action: 'install',
    target: skillSlug,
    beforeState: null,
    afterState: { config },
    metadata,
    reversible: false,
  })
}

/**
 * Log a skill uninstallation
 */
export async function logUninstall(
  installationId: string,
  skillSlug: string,
  config: any,
  metadata?: Record<string, any>
): Promise<SkillLog | null> {
  return logAction(installationId, {
    action: 'uninstall',
    target: skillSlug,
    beforeState: { config },
    afterState: null,
    metadata,
    reversible: false,
  })
}

/**
 * Log a skill execution
 */
export async function logExecute(
  installationId: string,
  skillSlug: string,
  input: any,
  output: any,
  duration: number,
  metadata?: Record<string, any>
): Promise<SkillLog | null> {
  return logAction(installationId, {
    action: 'execute',
    target: skillSlug,
    beforeState: input,
    afterState: { output, duration },
    metadata,
    reversible: false,
  })
}

/**
 * Get all logs for an installation
 */
export async function getLogs(
  installationId: string,
  options?: {
    limit?: number
    offset?: number
    action?: ActionType
    reversibleOnly?: boolean
    notReverted?: boolean
  }
): Promise<SkillLog[]> {
  let query = supabaseAdmin
    .from('skill_logs')
    .select('*')
    .eq('installation_id', installationId)
    .order('created_at', { ascending: false })

  if (options?.action) {
    query = query.eq('action', options.action)
  }

  if (options?.reversibleOnly) {
    query = query.eq('reversible', true)
  }

  if (options?.notReverted) {
    query = query.eq('reverted', false)
  }

  if (options?.limit) {
    query = query.limit(options.limit)
  }

  if (options?.offset) {
    query = query.range(options.offset, options.offset + (options.limit || 50) - 1)
  }

  const { data, error } = await query

  if (error) {
    console.error('Failed to get skill logs:', error)
    return []
  }

  return data as SkillLog[]
}

/**
 * Get a single log entry
 */
export async function getLog(logId: string): Promise<SkillLog | null> {
  const { data, error } = await supabaseAdmin
    .from('skill_logs')
    .select('*')
    .eq('id', logId)
    .single()

  if (error) {
    console.error('Failed to get skill log:', error)
    return null
  }

  return data as SkillLog
}

/**
 * Count logs for an installation
 */
export async function countLogs(
  installationId: string,
  options?: {
    action?: ActionType
    reversibleOnly?: boolean
    notReverted?: boolean
  }
): Promise<number> {
  let query = supabaseAdmin
    .from('skill_logs')
    .select('id', { count: 'exact', head: true })
    .eq('installation_id', installationId)

  if (options?.action) {
    query = query.eq('action', options.action)
  }

  if (options?.reversibleOnly) {
    query = query.eq('reversible', true)
  }

  if (options?.notReverted) {
    query = query.eq('reverted', false)
  }

  const { count, error } = await query

  if (error) {
    console.error('Failed to count skill logs:', error)
    return 0
  }

  return count || 0
}

/**
 * Create a logger instance bound to an installation
 */
export function createSkillLogger(installationId: string) {
  return {
    logAction: (entry: LogEntry) => logAction(installationId, entry),
    logFileCreate: (filePath: string, content: string, metadata?: Record<string, any>) =>
      logFileCreate(installationId, filePath, content, metadata),
    logFileModify: (filePath: string, before: string, after: string, metadata?: Record<string, any>) =>
      logFileModify(installationId, filePath, before, after, metadata),
    logFileDelete: (filePath: string, content: string, metadata?: Record<string, any>) =>
      logFileDelete(installationId, filePath, content, metadata),
    logDbInsert: (table: string, id: string, record: any, metadata?: Record<string, any>) =>
      logDbInsert(installationId, table, id, record, metadata),
    logDbUpdate: (table: string, id: string, before: any, after: any, metadata?: Record<string, any>) =>
      logDbUpdate(installationId, table, id, before, after, metadata),
    logDbDelete: (table: string, id: string, record: any, metadata?: Record<string, any>) =>
      logDbDelete(installationId, table, id, record, metadata),
    logApiCall: (endpoint: string, method: string, req: any, res: any, metadata?: Record<string, any>) =>
      logApiCall(installationId, endpoint, method, req, res, metadata),
    logEnvSet: (name: string, old: string | null, val: string, metadata?: Record<string, any>) =>
      logEnvSet(installationId, name, old, val, metadata),
    logConfigChange: (key: string, old: any, val: any, metadata?: Record<string, any>) =>
      logConfigChange(installationId, key, old, val, metadata),
    logExecute: (slug: string, input: any, output: any, duration: number, metadata?: Record<string, any>) =>
      logExecute(installationId, slug, input, output, duration, metadata),
    getLogs: (options?: Parameters<typeof getLogs>[1]) =>
      getLogs(installationId, options),
    countLogs: (options?: Parameters<typeof countLogs>[1]) =>
      countLogs(installationId, options),
  }
}
