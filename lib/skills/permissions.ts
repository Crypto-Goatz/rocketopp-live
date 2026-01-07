// Skill Permission System
// Enforces granular permissions for skill actions

import { PermissionType, SkillContext, PermissionCheckResult } from './types'

// Permission categories
export const PERMISSION_CATEGORIES = {
  api: ['api:read', 'api:write'],
  database: ['database:*'],
  files: ['files:read', 'files:write'],
  env: ['env:*'],
  exec: ['exec:server', 'exec:client'],
  cron: ['cron:*'],
} as const

// Human-readable permission descriptions
export const PERMISSION_DESCRIPTIONS: Record<string, string> = {
  'api:read': 'Read data from API endpoints',
  'api:write': 'Create and modify API endpoints',
  'database:*': 'Full database access',
  'files:read': 'Read project files',
  'files:write': 'Create and modify project files',
  'env:*': 'Access all environment variables',
  'exec:server': 'Execute server-side code',
  'exec:client': 'Execute client-side code',
  'cron:*': 'Schedule recurring tasks',
}

// Risk levels for permissions
export const PERMISSION_RISK_LEVELS: Record<string, 'low' | 'medium' | 'high'> = {
  'api:read': 'low',
  'api:write': 'medium',
  'database:*': 'high',
  'files:read': 'low',
  'files:write': 'high',
  'env:*': 'high',
  'exec:server': 'high',
  'exec:client': 'medium',
  'cron:*': 'medium',
}

/**
 * Check if a permission matches a pattern
 * Supports wildcards like database:* or env:SPECIFIC_VAR
 */
export function matchesPermission(
  granted: PermissionType,
  required: string
): boolean {
  // Exact match
  if (granted === required) return true

  // Wildcard match (e.g., database:* matches database:users)
  if (granted.endsWith(':*')) {
    const prefix = granted.replace(':*', ':')
    if (required.startsWith(prefix) || required === granted.replace(':*', '')) {
      return true
    }
  }

  // Check if granted is a specific permission that matches the requirement
  const [grantedCategory, grantedScope] = granted.split(':')
  const [requiredCategory, requiredScope] = required.split(':')

  if (grantedCategory === requiredCategory) {
    // Wildcard grants access to all in category
    if (grantedScope === '*') return true
    // Specific permission matches
    if (grantedScope === requiredScope) return true
  }

  return false
}

/**
 * Check if a context has a specific permission
 */
export function hasPermission(
  context: SkillContext,
  permission: string
): PermissionCheckResult {
  const { permissions } = context

  // Check if any granted permission matches the required one
  for (const granted of permissions) {
    if (matchesPermission(granted, permission)) {
      return { allowed: true, permission: granted }
    }
  }

  return {
    allowed: false,
    permission: permission as PermissionType,
    reason: `Permission "${permission}" not granted`,
  }
}

/**
 * Check multiple permissions at once
 */
export function hasAllPermissions(
  context: SkillContext,
  permissions: string[]
): { allowed: boolean; missing: string[] } {
  const missing: string[] = []

  for (const permission of permissions) {
    const result = hasPermission(context, permission)
    if (!result.allowed) {
      missing.push(permission)
    }
  }

  return {
    allowed: missing.length === 0,
    missing,
  }
}

/**
 * Check if a database table access is allowed
 */
export function canAccessTable(
  context: SkillContext,
  tableName: string,
  operation: 'read' | 'write'
): PermissionCheckResult {
  const requiredPermission = `database:${tableName}`

  // Check for specific table permission
  let result = hasPermission(context, requiredPermission)
  if (result.allowed) return result

  // Check for wildcard database permission
  result = hasPermission(context, 'database:*')
  if (result.allowed) return result

  return {
    allowed: false,
    permission: requiredPermission as PermissionType,
    reason: `Access to table "${tableName}" not granted`,
  }
}

/**
 * Check if an environment variable access is allowed
 */
export function canAccessEnv(
  context: SkillContext,
  envName: string
): PermissionCheckResult {
  const requiredPermission = `env:${envName}`

  // Check for specific env permission
  let result = hasPermission(context, requiredPermission)
  if (result.allowed) return result

  // Check for wildcard env permission
  result = hasPermission(context, 'env:*')
  if (result.allowed) return result

  return {
    allowed: false,
    permission: requiredPermission as PermissionType,
    reason: `Access to environment variable "${envName}" not granted`,
  }
}

/**
 * Check if file access is allowed
 */
export function canAccessFile(
  context: SkillContext,
  filePath: string,
  operation: 'read' | 'write'
): PermissionCheckResult {
  const requiredPermission = operation === 'read' ? 'files:read' : 'files:write'

  const result = hasPermission(context, requiredPermission)

  // Additional safety check for sensitive files
  const sensitivePatterns = [
    '.env',
    'credentials',
    'secret',
    'private',
    'key.pem',
    'id_rsa',
  ]

  if (result.allowed) {
    const isSensitive = sensitivePatterns.some(pattern =>
      filePath.toLowerCase().includes(pattern)
    )

    if (isSensitive && operation === 'write') {
      return {
        allowed: false,
        permission: requiredPermission as PermissionType,
        reason: `Writing to sensitive files is not allowed: ${filePath}`,
      }
    }
  }

  return result
}

/**
 * Get human-readable description for a permission
 */
export function getPermissionDescription(permission: PermissionType): string {
  // Check for exact match first
  if (PERMISSION_DESCRIPTIONS[permission]) {
    return PERMISSION_DESCRIPTIONS[permission]
  }

  // Handle specific permissions (e.g., database:users, env:API_KEY)
  const [category, scope] = permission.split(':')

  switch (category) {
    case 'database':
      return `Access to database table: ${scope}`
    case 'env':
      return `Access to environment variable: ${scope}`
    case 'cron':
      return `Schedule tasks: ${scope}`
    default:
      return permission
  }
}

/**
 * Get risk level for a permission
 */
export function getPermissionRiskLevel(
  permission: PermissionType
): 'low' | 'medium' | 'high' {
  // Check exact match
  if (PERMISSION_RISK_LEVELS[permission]) {
    return PERMISSION_RISK_LEVELS[permission]
  }

  // Derive from category
  const category = permission.split(':')[0]

  switch (category) {
    case 'database':
    case 'files':
    case 'env':
    case 'exec':
      return 'high'
    case 'api':
    case 'cron':
      return 'medium'
    default:
      return 'low'
  }
}

/**
 * Group permissions by category for display
 */
export function groupPermissionsByCategory(
  permissions: PermissionType[]
): Record<string, PermissionType[]> {
  const grouped: Record<string, PermissionType[]> = {}

  for (const permission of permissions) {
    const category = permission.split(':')[0]
    if (!grouped[category]) {
      grouped[category] = []
    }
    grouped[category].push(permission)
  }

  return grouped
}

/**
 * Calculate overall risk level for a set of permissions
 */
export function calculateOverallRisk(
  permissions: PermissionType[]
): 'low' | 'medium' | 'high' {
  let highestRisk: 'low' | 'medium' | 'high' = 'low'

  for (const permission of permissions) {
    const risk = getPermissionRiskLevel(permission)
    if (risk === 'high') return 'high'
    if (risk === 'medium') highestRisk = 'medium'
  }

  return highestRisk
}

/**
 * Validate that requested permissions are valid
 */
export function validatePermissions(
  permissions: string[]
): { valid: boolean; invalid: string[] } {
  const validCategories = ['api', 'database', 'files', 'env', 'exec', 'cron']
  const invalid: string[] = []

  for (const permission of permissions) {
    const category = permission.split(':')[0]
    if (!validCategories.includes(category)) {
      invalid.push(permission)
    }
  }

  return {
    valid: invalid.length === 0,
    invalid,
  }
}
