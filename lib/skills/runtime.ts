// Skill Runtime Engine
// Executes skills with permission enforcement and logging

import { supabaseAdmin } from '@/lib/db/supabase'
import {
  Skill,
  SkillInstallation,
  SkillContext,
  SkillExecutionResult,
  SkillManifest,
  PermissionType,
  InstallOptions,
} from './types'
import { hasPermission, hasAllPermissions, canAccessTable, canAccessEnv } from './permissions'
import { createSkillLogger, logInstall, logUninstall, logExecute } from './logger'
import { parseManifest, parseManifestFromUrl } from './parser'

/**
 * Install a skill for a user
 */
export async function installSkill(
  userId: string,
  skillId: string,
  options?: InstallOptions
): Promise<{ success: boolean; installation?: SkillInstallation; error?: string }> {
  try {
    // Get the skill
    const { data: skill, error: skillError } = await supabaseAdmin
      .from('skills')
      .select('*')
      .eq('id', skillId)
      .single()

    if (skillError || !skill) {
      return { success: false, error: 'Skill not found' }
    }

    // Check if already installed
    const { data: existing } = await supabaseAdmin
      .from('skill_installations')
      .select('id')
      .eq('user_id', userId)
      .eq('skill_id', skillId)
      .single()

    if (existing) {
      return { success: false, error: 'Skill is already installed' }
    }

    // Parse manifest
    const manifest = skill.manifest as SkillManifest

    // Create installation
    const { data: installation, error: installError } = await supabaseAdmin
      .from('skill_installations')
      .insert({
        user_id: userId,
        skill_id: skillId,
        status: 'installing',
        permissions_granted: manifest.permissions,
        config: options?.config || {},
        environment: {},
      })
      .select()
      .single()

    if (installError || !installation) {
      return { success: false, error: `Failed to create installation: ${installError?.message}` }
    }

    // Log the installation
    await logInstall(installation.id, skill.slug, options?.config || {})

    // Update status to installed
    await supabaseAdmin
      .from('skill_installations')
      .update({ status: 'installed' })
      .eq('id', installation.id)

    // Increment download count
    await supabaseAdmin
      .from('skills')
      .update({ downloads: (skill.downloads || 0) + 1 })
      .eq('id', skillId)

    return { success: true, installation: installation as SkillInstallation }
  } catch (err) {
    console.error('Error installing skill:', err)
    return { success: false, error: err instanceof Error ? err.message : 'Unknown error' }
  }
}

/**
 * Install a skill from a URL
 */
export async function installSkillFromUrl(
  userId: string,
  url: string,
  options?: InstallOptions
): Promise<{ success: boolean; installation?: SkillInstallation; error?: string }> {
  try {
    // Fetch and parse manifest
    const parseResult = await parseManifestFromUrl(url)

    if (!parseResult.success || !parseResult.manifest) {
      return { success: false, error: parseResult.errors.join(', ') }
    }

    const manifest = parseResult.manifest

    // Check if skill with this slug already exists
    const { data: existingSkill } = await supabaseAdmin
      .from('skills')
      .select('id')
      .eq('slug', manifest.slug)
      .single()

    let skillId: string

    if (existingSkill) {
      skillId = existingSkill.id
    } else {
      // Create the skill
      const { data: newSkill, error: createError } = await supabaseAdmin
        .from('skills')
        .insert({
          slug: manifest.slug,
          name: manifest.name,
          description: manifest.description,
          version: manifest.version,
          author: manifest.author,
          icon: manifest.icon,
          icon_url: manifest.iconUrl,
          category: manifest.category || 'custom',
          manifest,
          source_url: url,
          is_marketplace: false,
        })
        .select('id')
        .single()

      if (createError || !newSkill) {
        return { success: false, error: `Failed to create skill: ${createError?.message}` }
      }

      skillId = newSkill.id
    }

    // Install the skill
    return installSkill(userId, skillId, options)
  } catch (err) {
    console.error('Error installing skill from URL:', err)
    return { success: false, error: err instanceof Error ? err.message : 'Unknown error' }
  }
}

/**
 * Uninstall a skill
 */
export async function uninstallSkill(
  installationId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // Get the installation with skill info
    const { data: installation, error: fetchError } = await supabaseAdmin
      .from('skill_installations')
      .select('*, skill:skills(*)')
      .eq('id', installationId)
      .single()

    if (fetchError || !installation) {
      return { success: false, error: 'Installation not found' }
    }

    // Update status to uninstalling
    await supabaseAdmin
      .from('skill_installations')
      .update({ status: 'uninstalling' })
      .eq('id', installationId)

    // Log the uninstallation
    await logUninstall(installationId, installation.skill.slug, installation.config)

    // Delete the installation (cascades to logs and onboarding)
    const { error: deleteError } = await supabaseAdmin
      .from('skill_installations')
      .delete()
      .eq('id', installationId)

    if (deleteError) {
      return { success: false, error: `Failed to uninstall: ${deleteError.message}` }
    }

    return { success: true }
  } catch (err) {
    console.error('Error uninstalling skill:', err)
    return { success: false, error: err instanceof Error ? err.message : 'Unknown error' }
  }
}

/**
 * Build execution context for a skill
 */
export async function buildContext(
  installationId: string
): Promise<SkillContext | null> {
  const { data: installation, error } = await supabaseAdmin
    .from('skill_installations')
    .select('*, skill:skills(*)')
    .eq('id', installationId)
    .single()

  if (error || !installation) {
    console.error('Failed to build context:', error)
    return null
  }

  const skill = installation.skill as Skill
  const manifest = skill.manifest as SkillManifest

  return {
    installation: installation as SkillInstallation,
    skill,
    manifest,
    permissions: installation.permissions_granted as PermissionType[],
    environment: installation.environment || {},
    config: installation.config || {},
    userId: installation.user_id,
  }
}

/**
 * Execute a skill using the Ignition engine
 */
export async function executeSkill(
  installationId: string,
  input?: any
): Promise<SkillExecutionResult> {
  // Use the Ignition engine for real execution
  const { createIgnitionEngine } = await import('./ignition')
  const engine = createIgnitionEngine()

  return engine.execute(installationId, { input })
}

/**
 * Execute a skill with streaming progress updates
 */
export async function* executeSkillWithStream(
  installationId: string,
  input?: any
): AsyncGenerator<import('./ignition').ProgressEvent, SkillExecutionResult> {
  const { createIgnitionEngine } = await import('./ignition')
  const engine = createIgnitionEngine()

  return yield* engine.executeWithStream(installationId, { input })
}

/**
 * Pause a skill
 */
export async function pauseSkill(
  installationId: string
): Promise<{ success: boolean; error?: string }> {
  const { error } = await supabaseAdmin
    .from('skill_installations')
    .update({ status: 'paused' })
    .eq('id', installationId)

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true }
}

/**
 * Resume a paused skill
 */
export async function resumeSkill(
  installationId: string
): Promise<{ success: boolean; error?: string }> {
  const { error } = await supabaseAdmin
    .from('skill_installations')
    .update({ status: 'installed', error_message: null })
    .eq('id', installationId)

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true }
}

/**
 * Update skill configuration
 */
export async function updateSkillConfig(
  installationId: string,
  config: Record<string, any>
): Promise<{ success: boolean; error?: string }> {
  // Get current config
  const { data: installation, error: fetchError } = await supabaseAdmin
    .from('skill_installations')
    .select('config')
    .eq('id', installationId)
    .single()

  if (fetchError || !installation) {
    return { success: false, error: 'Installation not found' }
  }

  // Merge configs
  const newConfig = { ...installation.config, ...config }

  // Update
  const { error } = await supabaseAdmin
    .from('skill_installations')
    .update({ config: newConfig })
    .eq('id', installationId)

  if (error) {
    return { success: false, error: error.message }
  }

  // Log config changes
  const logger = createSkillLogger(installationId)
  for (const [key, value] of Object.entries(config)) {
    if (installation.config[key] !== value) {
      await logger.logConfigChange(key, installation.config[key], value)
    }
  }

  return { success: true }
}

/**
 * Update skill environment variables
 */
export async function updateSkillEnvironment(
  installationId: string,
  environment: Record<string, string>
): Promise<{ success: boolean; error?: string }> {
  // Get current environment
  const { data: installation, error: fetchError } = await supabaseAdmin
    .from('skill_installations')
    .select('environment')
    .eq('id', installationId)
    .single()

  if (fetchError || !installation) {
    return { success: false, error: 'Installation not found' }
  }

  // Merge environments
  const newEnv = { ...installation.environment, ...environment }

  // Update
  const { error } = await supabaseAdmin
    .from('skill_installations')
    .update({ environment: newEnv })
    .eq('id', installationId)

  if (error) {
    return { success: false, error: error.message }
  }

  // Log env changes
  const logger = createSkillLogger(installationId)
  for (const [key, value] of Object.entries(environment)) {
    await logger.logEnvSet(key, installation.environment[key] || null, value)
  }

  return { success: true }
}

/**
 * Get all installed skills for a user
 */
export async function getUserSkills(userId: string): Promise<SkillInstallation[]> {
  const { data, error } = await supabaseAdmin
    .from('skill_installations')
    .select('*, skill:skills(*)')
    .eq('user_id', userId)
    .order('installed_at', { ascending: false })

  if (error) {
    console.error('Error getting user skills:', error)
    return []
  }

  return data as SkillInstallation[]
}

/**
 * Get marketplace skills
 */
export async function getMarketplaceSkills(options?: {
  category?: string
  search?: string
  limit?: number
  offset?: number
}): Promise<Skill[]> {
  let query = supabaseAdmin
    .from('skills')
    .select('*')
    .eq('is_marketplace', true)
    .eq('is_active', true)

  if (options?.category) {
    query = query.eq('category', options.category)
  }

  if (options?.search) {
    query = query.or(`name.ilike.%${options.search}%,description.ilike.%${options.search}%`)
  }

  query = query.order('downloads', { ascending: false })

  if (options?.limit) {
    query = query.limit(options.limit)
  }

  if (options?.offset) {
    query = query.range(options.offset, options.offset + (options.limit || 50) - 1)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error getting marketplace skills:', error)
    return []
  }

  return data as Skill[]
}

/**
 * Get a single skill by ID or slug
 */
export async function getSkill(idOrSlug: string): Promise<Skill | null> {
  // Try by ID first
  let { data, error } = await supabaseAdmin
    .from('skills')
    .select('*')
    .eq('id', idOrSlug)
    .single()

  // If not found, try by slug
  if (error || !data) {
    const result = await supabaseAdmin
      .from('skills')
      .select('*')
      .eq('slug', idOrSlug)
      .single()

    data = result.data
    error = result.error
  }

  if (error || !data) {
    return null
  }

  return data as Skill
}

/**
 * Get categories
 */
export async function getSkillCategories(): Promise<string[]> {
  const { data, error } = await supabaseAdmin
    .from('skills')
    .select('category')
    .eq('is_marketplace', true)
    .eq('is_active', true)

  if (error) {
    console.error('Error getting categories:', error)
    return []
  }

  const categories = [...new Set(data.map(d => d.category))]
  return categories.sort()
}

/**
 * Check if a skill requires onboarding
 */
export function skillRequiresOnboarding(manifest: SkillManifest): boolean {
  return manifest.onboarding.some(f => f.required)
}

/**
 * Get onboarding status for an installation
 */
export async function getOnboardingStatus(
  installationId: string
): Promise<{
  complete: boolean
  missing: string[]
  collected: Record<string, string>
}> {
  // Get installation with skill
  const { data: installation, error: fetchError } = await supabaseAdmin
    .from('skill_installations')
    .select('*, skill:skills(*)')
    .eq('id', installationId)
    .single()

  if (fetchError || !installation) {
    return { complete: false, missing: [], collected: {} }
  }

  const manifest = installation.skill.manifest as SkillManifest
  const required = manifest.onboarding.filter(f => f.required).map(f => f.field)

  // Get collected data
  const { data: onboarding } = await supabaseAdmin
    .from('skill_onboarding')
    .select('*')
    .eq('installation_id', installationId)

  const collected: Record<string, string> = {}
  for (const item of onboarding || []) {
    collected[item.field_name] = item.field_value
  }

  const missing = required.filter(f => !collected[f])

  return {
    complete: missing.length === 0,
    missing,
    collected,
  }
}

/**
 * Save onboarding data
 */
export async function saveOnboardingData(
  installationId: string,
  data: Record<string, string>
): Promise<{ success: boolean; error?: string }> {
  try {
    // Get the skill manifest to know which fields are sensitive
    const { data: installation, error: fetchError } = await supabaseAdmin
      .from('skill_installations')
      .select('skill:skills(manifest)')
      .eq('id', installationId)
      .single()

    if (fetchError || !installation) {
      return { success: false, error: 'Installation not found' }
    }

    const manifest = (installation.skill as any).manifest as SkillManifest
    const sensitiveTypes = ['password']

    // Upsert each field
    for (const [fieldName, fieldValue] of Object.entries(data)) {
      const fieldDef = manifest.onboarding.find(f => f.field === fieldName)
      const encrypted = fieldDef && sensitiveTypes.includes(fieldDef.type)

      await supabaseAdmin
        .from('skill_onboarding')
        .upsert({
          installation_id: installationId,
          field_name: fieldName,
          field_value: fieldValue,
          field_type: fieldDef?.type || 'text',
          encrypted,
        }, {
          onConflict: 'installation_id,field_name',
        })
    }

    return { success: true }
  } catch (err) {
    console.error('Error saving onboarding data:', err)
    return { success: false, error: err instanceof Error ? err.message : 'Unknown error' }
  }
}
