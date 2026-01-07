// Skill Creator
// Creates new skills from templates

import { SkillManifest } from '../types'
import {
  SkillPackage,
  PackageFile,
  SkillTemplate,
  CreateSkillOptions,
  ValidationResult,
} from './types'
import { getTemplate, SKILL_TEMPLATES } from './templates'

/**
 * Convert string to PascalCase
 */
function toPascalCase(str: string): string {
  return str
    .split(/[-_\s]+/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('')
}

/**
 * Convert string to camelCase
 */
function toCamelCase(str: string): string {
  const pascal = toPascalCase(str)
  return pascal.charAt(0).toLowerCase() + pascal.slice(1)
}

/**
 * Convert string to UPPER_SNAKE_CASE
 */
function toUpperSnakeCase(str: string): string {
  return str
    .replace(/[-\s]+/g, '_')
    .replace(/([a-z])([A-Z])/g, '$1_$2')
    .toUpperCase()
}

/**
 * Convert string to slug (lowercase with hyphens)
 */
function toSlug(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

/**
 * Replace template variables in content
 */
function replaceVariables(
  content: string,
  variables: Record<string, string>
): string {
  let result = content

  // Replace all variable patterns
  for (const [key, value] of Object.entries(variables)) {
    // Direct replacement: {{key}}
    result = result.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), value)

    // PascalCase: {{pascalCase}}
    if (key === 'name' || key === 'slug') {
      result = result.replace(
        new RegExp(`\\{\\{pascalCase\\}\\}`, 'g'),
        toPascalCase(variables.name || variables.slug || '')
      )
    }

    // camelCase: {{camelCase}}
    if (key === 'name' || key === 'slug') {
      result = result.replace(
        new RegExp(`\\{\\{camelCase\\}\\}`, 'g'),
        toCamelCase(variables.name || variables.slug || '')
      )
    }

    // UPPER_SNAKE_CASE: {{upperSnakeCase}}
    if (key === 'name' || key === 'slug') {
      result = result.replace(
        new RegExp(`\\{\\{upperSnakeCase\\}\\}`, 'g'),
        toUpperSnakeCase(variables.name || variables.slug || '')
      )
    }
  }

  return result
}

/**
 * Validate template variables
 */
function validateVariables(
  template: SkillTemplate,
  variables: Record<string, string>
): ValidationResult {
  const errors: string[] = []
  const warnings: string[] = []

  for (const varDef of template.variables) {
    const value = variables[varDef.name]

    if (varDef.required && !value) {
      errors.push(`Missing required variable: ${varDef.label}`)
      continue
    }

    if (value && varDef.validation) {
      const regex = new RegExp(varDef.validation)
      if (!regex.test(value)) {
        errors.push(`Invalid ${varDef.label}: does not match pattern ${varDef.validation}`)
      }
    }

    if (varDef.type === 'slug' && value) {
      const slugified = toSlug(value)
      if (slugified !== value) {
        warnings.push(`${varDef.label} was converted to slug format: ${slugified}`)
        variables[varDef.name] = slugified
      }
    }
  }

  return { valid: errors.length === 0, errors, warnings }
}

/**
 * Create a skill package from a template
 */
export function createSkillFromTemplate(
  options: CreateSkillOptions
): { success: boolean; package?: SkillPackage; errors: string[]; warnings: string[] } {
  const template = getTemplate(options.templateId)

  if (!template) {
    return {
      success: false,
      errors: [`Template not found: ${options.templateId}`],
      warnings: [],
    }
  }

  // Apply default values
  const variables = { ...options.variables }
  for (const varDef of template.variables) {
    if (!variables[varDef.name] && varDef.default) {
      variables[varDef.name] = varDef.default
    }
  }

  // Validate variables
  const validation = validateVariables(template, variables)
  if (!validation.valid) {
    return {
      success: false,
      errors: validation.errors,
      warnings: validation.warnings,
    }
  }

  // Create manifest
  const manifest: SkillManifest = {
    name: variables.name,
    slug: variables.slug,
    version: variables.version || '1.0.0',
    author: variables.author,
    description: variables.description,
    icon: template.icon,
    category: template.category,
    permissions: template.manifest.permissions || [],
    onboarding: (template.manifest.onboarding || []).map(field => ({
      ...field,
      label: replaceVariables(field.label, variables),
      description: field.description ? replaceVariables(field.description, variables) : undefined,
    })),
    dashboard: template.manifest.dashboard
      ? {
          ...template.manifest.dashboard,
          route: replaceVariables(template.manifest.dashboard.route, variables),
          sidebar: template.manifest.dashboard.sidebar
            ? {
                ...template.manifest.dashboard.sidebar,
                label: replaceVariables(template.manifest.dashboard.sidebar.label, variables),
              }
            : undefined,
        }
      : undefined,
    schedules: template.manifest.schedules?.map(s => ({
      ...s,
      cron: replaceVariables(s.cron, variables),
    })),
    tags: [],
  }

  // Create files
  const files: PackageFile[] = template.files.map(templateFile => ({
    path: replaceVariables(templateFile.path, variables),
    content: replaceVariables(templateFile.template, variables),
    type: templateFile.type,
  }))

  // Create package
  const skillPackage: SkillPackage = {
    version: '1.0.0',
    manifest,
    files,
    createdAt: new Date().toISOString(),
    exportedFrom: 'RocketOpp Skill Creator',
  }

  return {
    success: true,
    package: skillPackage,
    errors: [],
    warnings: validation.warnings,
  }
}

/**
 * Get all available templates
 */
export function getAvailableTemplates(): SkillTemplate[] {
  return SKILL_TEMPLATES
}

/**
 * Preview a skill creation (returns file structure without creating)
 */
export function previewSkillCreation(options: CreateSkillOptions): {
  files: { path: string; type: string }[]
  manifest: Partial<SkillManifest>
  errors: string[]
} {
  const template = getTemplate(options.templateId)

  if (!template) {
    return {
      files: [],
      manifest: {},
      errors: [`Template not found: ${options.templateId}`],
    }
  }

  const variables = { ...options.variables }
  for (const varDef of template.variables) {
    if (!variables[varDef.name] && varDef.default) {
      variables[varDef.name] = varDef.default
    }
  }

  const validation = validateVariables(template, variables)

  const files = template.files.map(f => ({
    path: replaceVariables(f.path, variables),
    type: f.type,
  }))

  return {
    files,
    manifest: {
      name: variables.name,
      slug: variables.slug,
      version: variables.version || '1.0.0',
      category: template.category,
      permissions: template.manifest.permissions,
    },
    errors: validation.errors,
  }
}

/**
 * Create a blank skill manifest
 */
export function createBlankManifest(
  name: string,
  options?: Partial<SkillManifest>
): SkillManifest {
  return {
    name,
    slug: toSlug(name),
    version: '1.0.0',
    permissions: ['api:read'],
    onboarding: [],
    tags: [],
    ...options,
  }
}
