// Skill Manifest Parser
// Parses and validates skill.json manifests

import { SkillManifest, OnboardingField, PermissionType, FileMapping, DashboardConfig } from './types'
import { validatePermissions } from './permissions'

export interface ParseResult {
  success: boolean
  manifest?: SkillManifest
  errors: string[]
  warnings: string[]
}

/**
 * Parse and validate a skill manifest from JSON
 */
export function parseManifest(json: string | object): ParseResult {
  const errors: string[] = []
  const warnings: string[] = []

  let data: any

  // Parse JSON if string
  if (typeof json === 'string') {
    try {
      data = JSON.parse(json)
    } catch (err) {
      return {
        success: false,
        errors: ['Invalid JSON format'],
        warnings: [],
      }
    }
  } else {
    data = json
  }

  // Validate required fields
  if (!data.name || typeof data.name !== 'string') {
    errors.push('Missing required field: name')
  }

  if (!data.slug || typeof data.slug !== 'string') {
    errors.push('Missing required field: slug')
  } else if (!/^[a-z0-9-]+$/.test(data.slug)) {
    errors.push('Slug must contain only lowercase letters, numbers, and hyphens')
  }

  if (!data.version || typeof data.version !== 'string') {
    errors.push('Missing required field: version')
  } else if (!/^\d+\.\d+\.\d+/.test(data.version)) {
    warnings.push('Version should follow semantic versioning (e.g., 1.0.0)')
  }

  // Validate permissions
  if (!data.permissions || !Array.isArray(data.permissions)) {
    errors.push('Missing required field: permissions (must be an array)')
  } else {
    const permissionCheck = validatePermissions(data.permissions)
    if (!permissionCheck.valid) {
      errors.push(`Invalid permissions: ${permissionCheck.invalid.join(', ')}`)
    }
  }

  // Validate onboarding
  if (data.onboarding && !Array.isArray(data.onboarding)) {
    errors.push('Onboarding must be an array')
  } else if (data.onboarding) {
    const onboardingErrors = validateOnboarding(data.onboarding)
    errors.push(...onboardingErrors)
  }

  // Validate files
  if (data.files && !Array.isArray(data.files)) {
    errors.push('Files must be an array')
  } else if (data.files) {
    const fileErrors = validateFiles(data.files)
    errors.push(...fileErrors)
  }

  // Validate dashboard
  if (data.dashboard) {
    const dashboardErrors = validateDashboard(data.dashboard)
    errors.push(...dashboardErrors)
  }

  // Validate hooks
  if (data.hooks) {
    const hookErrors = validateHooks(data.hooks)
    warnings.push(...hookErrors)
  }

  // Return result
  if (errors.length > 0) {
    return { success: false, errors, warnings }
  }

  // Build the manifest
  const manifest: SkillManifest = {
    name: data.name,
    slug: data.slug,
    version: data.version,
    author: data.author || undefined,
    description: data.description || undefined,
    icon: data.icon || undefined,
    iconUrl: data.iconUrl || data.icon_url || undefined,
    category: data.category || 'general',
    homepage: data.homepage || undefined,
    repository: data.repository || undefined,
    permissions: data.permissions as PermissionType[],
    dependencies: data.dependencies || [],
    minVersion: data.minVersion || undefined,
    onboarding: data.onboarding || [],
    files: data.files || [],
    hooks: data.hooks || {},
    entryPoint: data.entryPoint || undefined,
    schedules: data.schedules || [],
    dashboard: data.dashboard || undefined,
    tags: data.tags || [],
    screenshots: data.screenshots || [],
    changelog: data.changelog || undefined,
  }

  return { success: true, manifest, errors: [], warnings }
}

/**
 * Validate onboarding fields
 */
function validateOnboarding(onboarding: any[]): string[] {
  const errors: string[] = []
  const validTypes = ['text', 'password', 'number', 'url', 'email', 'select', 'checkbox', 'textarea']

  onboarding.forEach((field, index) => {
    if (!field.field || typeof field.field !== 'string') {
      errors.push(`Onboarding field ${index}: missing 'field' property`)
    }

    if (!field.label || typeof field.label !== 'string') {
      errors.push(`Onboarding field ${index}: missing 'label' property`)
    }

    if (field.type && !validTypes.includes(field.type)) {
      errors.push(`Onboarding field ${index}: invalid type '${field.type}'`)
    }

    if (field.type === 'select' && (!field.options || !Array.isArray(field.options))) {
      errors.push(`Onboarding field ${index}: select type requires 'options' array`)
    }
  })

  return errors
}

/**
 * Validate file mappings
 */
function validateFiles(files: any[]): string[] {
  const errors: string[] = []
  const validTransforms = ['copy', 'merge', 'template']

  files.forEach((file, index) => {
    if (!file.source || typeof file.source !== 'string') {
      errors.push(`File mapping ${index}: missing 'source' property`)
    }

    if (!file.destination || typeof file.destination !== 'string') {
      errors.push(`File mapping ${index}: missing 'destination' property`)
    }

    if (file.transform && !validTransforms.includes(file.transform)) {
      errors.push(`File mapping ${index}: invalid transform '${file.transform}'`)
    }
  })

  return errors
}

/**
 * Validate dashboard configuration
 */
function validateDashboard(dashboard: any): string[] {
  const errors: string[] = []

  if (!dashboard.route || typeof dashboard.route !== 'string') {
    errors.push('Dashboard: missing or invalid route')
  }

  if (dashboard.sidebar) {
    if (!dashboard.sidebar.label || typeof dashboard.sidebar.label !== 'string') {
      errors.push('Dashboard sidebar: missing label')
    }
  }

  if (dashboard.widgets && !Array.isArray(dashboard.widgets)) {
    errors.push('Dashboard widgets must be an array')
  }

  return errors
}

/**
 * Validate hooks
 */
function validateHooks(hooks: any): string[] {
  const warnings: string[] = []
  const validHooks = ['install', 'uninstall', 'configure', 'execute', 'beforeRun', 'afterRun']

  Object.keys(hooks).forEach(hook => {
    if (!validHooks.includes(hook)) {
      warnings.push(`Unknown hook: ${hook}`)
    }
  })

  return warnings
}

/**
 * Parse manifest from URL
 */
export async function parseManifestFromUrl(url: string): Promise<ParseResult> {
  try {
    const response = await fetch(url)

    if (!response.ok) {
      return {
        success: false,
        errors: [`Failed to fetch manifest: ${response.status} ${response.statusText}`],
        warnings: [],
      }
    }

    const text = await response.text()
    return parseManifest(text)
  } catch (err) {
    return {
      success: false,
      errors: [`Failed to fetch manifest: ${err instanceof Error ? err.message : 'Unknown error'}`],
      warnings: [],
    }
  }
}

/**
 * Validate a manifest without parsing
 */
export function validateManifest(manifest: SkillManifest): { valid: boolean; errors: string[] } {
  const result = parseManifest(manifest)
  return {
    valid: result.success,
    errors: result.errors,
  }
}

/**
 * Extract required permissions from manifest
 */
export function getRequiredPermissions(manifest: SkillManifest): PermissionType[] {
  return [...manifest.permissions]
}

/**
 * Extract required onboarding fields
 */
export function getRequiredOnboarding(manifest: SkillManifest): OnboardingField[] {
  return manifest.onboarding.filter(f => f.required)
}

/**
 * Check if a manifest has any high-risk permissions
 */
export function hasHighRiskPermissions(manifest: SkillManifest): boolean {
  const highRisk = ['database:*', 'files:write', 'env:*', 'exec:server']
  return manifest.permissions.some(p =>
    highRisk.some(hr => p === hr || p.startsWith(hr.replace('*', '')))
  )
}

/**
 * Generate a default manifest for a new skill
 */
export function generateDefaultManifest(name: string): SkillManifest {
  const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')

  return {
    name,
    slug,
    version: '1.0.0',
    description: '',
    permissions: ['api:read'],
    onboarding: [],
    tags: [],
  }
}

/**
 * Serialize manifest to JSON
 */
export function serializeManifest(manifest: SkillManifest): string {
  return JSON.stringify(manifest, null, 2)
}
