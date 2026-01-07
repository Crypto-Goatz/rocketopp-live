// Skill/Plugin System Type Definitions

// Permission types that can be granted to skills
export type PermissionType =
  | 'api:read'
  | 'api:write'
  | 'database:*'
  | `database:${string}`
  | 'files:read'
  | 'files:write'
  | 'env:*'
  | `env:${string}`
  | 'exec:server'
  | 'exec:client'
  | 'cron:*'
  | `cron:${string}`

// Action types for logging
export type ActionType =
  | 'file_create'
  | 'file_modify'
  | 'file_delete'
  | 'db_insert'
  | 'db_update'
  | 'db_delete'
  | 'api_call'
  | 'env_set'
  | 'config_change'
  | 'install'
  | 'uninstall'
  | 'execute'

// Installation status
export type InstallationStatus =
  | 'installing'
  | 'installed'
  | 'paused'
  | 'error'
  | 'uninstalling'

// Onboarding field types
export type OnboardingFieldType =
  | 'text'
  | 'password'
  | 'number'
  | 'url'
  | 'email'
  | 'select'
  | 'checkbox'
  | 'textarea'

// Onboarding field definition
export interface OnboardingField {
  field: string
  label: string
  type: OnboardingFieldType
  required: boolean
  description?: string
  placeholder?: string
  options?: { value: string; label: string }[] // for select type
  default?: string | number | boolean
}

// File mapping for skill installation
export interface FileMapping {
  source: string
  destination: string
  transform?: 'copy' | 'merge' | 'template'
}

// Dashboard integration
export interface DashboardConfig {
  route: string
  sidebar?: {
    label: string
    icon: string
    order?: number
  }
  widgets?: {
    type: 'chart' | 'stat' | 'table' | 'custom'
    title: string
    component: string
  }[]
}

// Hook scripts
export interface SkillHooks {
  install?: string
  uninstall?: string
  configure?: string
  execute?: string
  beforeRun?: string
  afterRun?: string
}

// Complete skill manifest
export interface SkillManifest {
  name: string
  slug: string
  version: string
  author?: string
  description?: string
  icon?: string
  iconUrl?: string
  category?: string
  homepage?: string
  repository?: string

  // Requirements
  permissions: PermissionType[]
  dependencies?: string[] // other skill slugs
  minVersion?: string // minimum app version

  // Installation
  onboarding: OnboardingField[]
  files?: FileMapping[]
  hooks?: SkillHooks

  // Runtime
  entryPoint?: string
  schedules?: {
    name: string
    cron: string
    handler: string
  }[]

  // Dashboard
  dashboard?: DashboardConfig

  // Metadata
  tags?: string[]
  screenshots?: string[]
  changelog?: string
}

// Database skill record
export interface Skill {
  id: string
  slug: string
  name: string
  description: string | null
  version: string
  author: string | null
  icon_url: string | null
  icon: string | null
  category: string
  manifest: SkillManifest
  source_url: string | null
  is_marketplace: boolean
  is_active: boolean
  downloads: number
  created_at: string
  updated_at: string
}

// Database skill installation record
export interface SkillInstallation {
  id: string
  user_id: string
  skill_id: string
  status: InstallationStatus
  config: Record<string, any>
  permissions_granted: PermissionType[]
  environment: Record<string, string>
  installed_at: string
  last_run: string | null
  error_message: string | null
  // Joined data
  skill?: Skill
}

// Database skill log record
export interface SkillLog {
  id: string
  installation_id: string
  action: ActionType
  target: string
  before_state: any
  after_state: any
  metadata: Record<string, any>
  reversible: boolean
  reverted: boolean
  reverted_at: string | null
  created_at: string
}

// Database onboarding record
export interface SkillOnboarding {
  id: string
  installation_id: string
  field_name: string
  field_value: string | null
  field_type: string
  encrypted: boolean
  collected_at: string
}

// Skill execution context
export interface SkillContext {
  installation: SkillInstallation
  skill: Skill
  manifest: SkillManifest
  permissions: PermissionType[]
  environment: Record<string, string>
  config: Record<string, any>
  userId: string
}

// Skill execution result
export interface SkillExecutionResult {
  success: boolean
  data?: any
  error?: string
  logs: SkillLog[]
  duration: number
}

// Permission check result
export interface PermissionCheckResult {
  allowed: boolean
  permission: PermissionType
  reason?: string
}

// Rollback result
export interface RollbackResult {
  success: boolean
  logsReverted: number
  errors: string[]
}

// Installation options
export interface InstallOptions {
  sourceUrl?: string
  fileContent?: string
  skipOnboarding?: boolean
  autoActivate?: boolean
  config?: Record<string, any>
}

// Marketplace filter options
export interface MarketplaceFilters {
  category?: string
  search?: string
  sortBy?: 'name' | 'downloads' | 'newest' | 'updated'
  sortOrder?: 'asc' | 'desc'
  limit?: number
  offset?: number
}

// Export helper type for creating new skills
export type CreateSkillInput = Pick<Skill, 'slug' | 'name' | 'description' | 'version' | 'author' | 'icon' | 'category'> & {
  manifest: SkillManifest
  source_url?: string
  is_marketplace?: boolean
}
