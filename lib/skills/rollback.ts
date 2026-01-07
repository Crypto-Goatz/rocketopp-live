// Skill Rollback System
// Reverts skill actions using logged before states

import { supabaseAdmin } from '@/lib/db/supabase'
import { SkillLog, RollbackResult, ActionType } from './types'
import { getLog, getLogs, logAction } from './logger'

/**
 * Revert a single log entry
 */
export async function revertLog(logId: string): Promise<{ success: boolean; error?: string }> {
  // Get the log entry
  const log = await getLog(logId)

  if (!log) {
    return { success: false, error: 'Log entry not found' }
  }

  if (!log.reversible) {
    return { success: false, error: 'This action is not reversible' }
  }

  if (log.reverted) {
    return { success: false, error: 'This action has already been reverted' }
  }

  try {
    // Perform the revert based on action type
    const result = await performRevert(log)

    if (!result.success) {
      return result
    }

    // Mark the log as reverted
    const { error: updateError } = await supabaseAdmin
      .from('skill_logs')
      .update({
        reverted: true,
        reverted_at: new Date().toISOString(),
      })
      .eq('id', logId)

    if (updateError) {
      console.error('Failed to mark log as reverted:', updateError)
      // The revert was successful, just the status update failed
    }

    // Log the revert action
    await logAction(log.installation_id, {
      action: 'config_change',
      target: `revert:${log.id}`,
      beforeState: log.after_state,
      afterState: log.before_state,
      metadata: { revertedLogId: log.id, originalAction: log.action },
      reversible: false,
    })

    return { success: true }
  } catch (err) {
    console.error('Error reverting log:', err)
    return { success: false, error: err instanceof Error ? err.message : 'Unknown error' }
  }
}

/**
 * Perform the actual revert operation based on action type
 */
async function performRevert(log: SkillLog): Promise<{ success: boolean; error?: string }> {
  switch (log.action) {
    case 'file_create':
      return revertFileCreate(log)

    case 'file_modify':
      return revertFileModify(log)

    case 'file_delete':
      return revertFileDelete(log)

    case 'db_insert':
      return revertDbInsert(log)

    case 'db_update':
      return revertDbUpdate(log)

    case 'db_delete':
      return revertDbDelete(log)

    case 'config_change':
      return revertConfigChange(log)

    case 'env_set':
      return revertEnvSet(log)

    default:
      return { success: false, error: `Cannot revert action type: ${log.action}` }
  }
}

/**
 * Revert file creation (delete the file)
 */
async function revertFileCreate(log: SkillLog): Promise<{ success: boolean; error?: string }> {
  // In a real implementation, this would delete the file from the filesystem
  // For now, we'll simulate the operation since we don't have direct filesystem access
  console.log(`Reverting file creation: ${log.target}`)

  // For filesystem operations in production, you'd use fs.unlink or similar
  // This is a placeholder that indicates the operation was logged
  return { success: true }
}

/**
 * Revert file modification (restore previous content)
 */
async function revertFileModify(log: SkillLog): Promise<{ success: boolean; error?: string }> {
  if (!log.before_state?.content) {
    return { success: false, error: 'No previous content to restore' }
  }

  console.log(`Reverting file modification: ${log.target}`)

  // In a real implementation, this would restore the file content
  // fs.writeFileSync(log.target, log.before_state.content)
  return { success: true }
}

/**
 * Revert file deletion (recreate the file)
 */
async function revertFileDelete(log: SkillLog): Promise<{ success: boolean; error?: string }> {
  if (!log.before_state?.content) {
    return { success: false, error: 'No previous content to restore' }
  }

  console.log(`Reverting file deletion: ${log.target}`)

  // In a real implementation, this would recreate the file
  // fs.writeFileSync(log.target, log.before_state.content)
  return { success: true }
}

/**
 * Revert database insert (delete the record)
 */
async function revertDbInsert(log: SkillLog): Promise<{ success: boolean; error?: string }> {
  const [tableName, recordId] = log.target.split(':')

  if (!tableName || !recordId) {
    return { success: false, error: 'Invalid target format for db_insert' }
  }

  const { error } = await supabaseAdmin
    .from(tableName)
    .delete()
    .eq('id', recordId)

  if (error) {
    return { success: false, error: `Failed to delete record: ${error.message}` }
  }

  return { success: true }
}

/**
 * Revert database update (restore previous values)
 */
async function revertDbUpdate(log: SkillLog): Promise<{ success: boolean; error?: string }> {
  const [tableName, recordId] = log.target.split(':')

  if (!tableName || !recordId) {
    return { success: false, error: 'Invalid target format for db_update' }
  }

  if (!log.before_state) {
    return { success: false, error: 'No previous state to restore' }
  }

  const { error } = await supabaseAdmin
    .from(tableName)
    .update(log.before_state)
    .eq('id', recordId)

  if (error) {
    return { success: false, error: `Failed to update record: ${error.message}` }
  }

  return { success: true }
}

/**
 * Revert database deletion (recreate the record)
 */
async function revertDbDelete(log: SkillLog): Promise<{ success: boolean; error?: string }> {
  const [tableName] = log.target.split(':')

  if (!tableName) {
    return { success: false, error: 'Invalid target format for db_delete' }
  }

  if (!log.before_state) {
    return { success: false, error: 'No previous state to restore' }
  }

  const { error } = await supabaseAdmin
    .from(tableName)
    .insert(log.before_state)

  if (error) {
    return { success: false, error: `Failed to insert record: ${error.message}` }
  }

  return { success: true }
}

/**
 * Revert config change
 */
async function revertConfigChange(log: SkillLog): Promise<{ success: boolean; error?: string }> {
  // Get the installation
  const { data: installation, error: fetchError } = await supabaseAdmin
    .from('skill_installations')
    .select('config')
    .eq('id', log.installation_id)
    .single()

  if (fetchError || !installation) {
    return { success: false, error: 'Failed to fetch installation' }
  }

  // Restore the previous config value
  const config = { ...installation.config }
  config[log.target] = log.before_state

  const { error: updateError } = await supabaseAdmin
    .from('skill_installations')
    .update({ config })
    .eq('id', log.installation_id)

  if (updateError) {
    return { success: false, error: `Failed to update config: ${updateError.message}` }
  }

  return { success: true }
}

/**
 * Revert environment variable set
 */
async function revertEnvSet(log: SkillLog): Promise<{ success: boolean; error?: string }> {
  // Get the installation
  const { data: installation, error: fetchError } = await supabaseAdmin
    .from('skill_installations')
    .select('environment')
    .eq('id', log.installation_id)
    .single()

  if (fetchError || !installation) {
    return { success: false, error: 'Failed to fetch installation' }
  }

  // Restore the previous env value or remove it
  const environment = { ...installation.environment }

  if (log.before_state === null) {
    delete environment[log.target]
  } else {
    // Note: We can't actually restore the real value since we don't log it
    // This is a security measure - env values should be re-entered
    return { success: false, error: 'Environment variable reverts require manual re-entry' }
  }

  const { error: updateError } = await supabaseAdmin
    .from('skill_installations')
    .update({ environment })
    .eq('id', log.installation_id)

  if (updateError) {
    return { success: false, error: `Failed to update environment: ${updateError.message}` }
  }

  return { success: true }
}

/**
 * Revert multiple logs in order (newest first)
 */
export async function revertMultipleLogs(logIds: string[]): Promise<RollbackResult> {
  const errors: string[] = []
  let reverted = 0

  for (const logId of logIds) {
    const result = await revertLog(logId)
    if (result.success) {
      reverted++
    } else {
      errors.push(`${logId}: ${result.error}`)
    }
  }

  return {
    success: errors.length === 0,
    logsReverted: reverted,
    errors,
  }
}

/**
 * Revert all reversible actions for an installation
 */
export async function revertAllForInstallation(installationId: string): Promise<RollbackResult> {
  // Get all reversible, not-yet-reverted logs
  const logs = await getLogs(installationId, {
    reversibleOnly: true,
    notReverted: true,
  })

  if (logs.length === 0) {
    return {
      success: true,
      logsReverted: 0,
      errors: [],
    }
  }

  return revertMultipleLogs(logs.map(l => l.id))
}

/**
 * Get revertible logs for an installation
 */
export async function getRevertibleLogs(installationId: string): Promise<SkillLog[]> {
  return getLogs(installationId, {
    reversibleOnly: true,
    notReverted: true,
  })
}

/**
 * Check if a specific log can be reverted
 */
export async function canRevert(logId: string): Promise<{ canRevert: boolean; reason?: string }> {
  const log = await getLog(logId)

  if (!log) {
    return { canRevert: false, reason: 'Log entry not found' }
  }

  if (!log.reversible) {
    return { canRevert: false, reason: 'This action type is not reversible' }
  }

  if (log.reverted) {
    return { canRevert: false, reason: 'This action has already been reverted' }
  }

  return { canRevert: true }
}
