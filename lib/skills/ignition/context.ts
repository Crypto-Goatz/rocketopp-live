// Ignition Execution Context Builder

import { supabaseAdmin } from '@/lib/db/supabase'
import { parseManifest } from '../parser'
import { ExecutionContext } from './types'
import { SkillManifest, PermissionType } from '../types'

interface BuildContextOptions {
  installationId: string
  input?: Record<string, any>
}

interface BuildContextResult {
  success: boolean
  context?: ExecutionContext
  error?: string
}

/**
 * Build the execution context for a skill
 * Loads all necessary data from the database
 */
export async function buildExecutionContext(
  options: BuildContextOptions
): Promise<BuildContextResult> {
  const { installationId, input = {} } = options

  try {
    // Load installation with skill data
    const { data: installation, error: installError } = await supabaseAdmin
      .from('skill_installations')
      .select(`
        *,
        skill:skills(*)
      `)
      .eq('id', installationId)
      .single()

    if (installError || !installation) {
      return {
        success: false,
        error: installError?.message || 'Installation not found',
      }
    }

    // Check installation status
    if (installation.status !== 'installed') {
      return {
        success: false,
        error: `Skill is not in installed state (current: ${installation.status})`,
      }
    }

    const skill = installation.skill
    if (!skill) {
      return {
        success: false,
        error: 'Skill data not found',
      }
    }

    // Parse manifest
    const parseResult = parseManifest(skill.manifest)
    if (!parseResult.success || !parseResult.manifest) {
      return {
        success: false,
        error: `Invalid manifest: ${parseResult.errors?.join(', ')}`,
      }
    }

    const manifest: SkillManifest = parseResult.manifest

    // Load onboarding data
    const { data: onboardingRows } = await supabaseAdmin
      .from('skill_onboarding')
      .select('field_name, field_value')
      .eq('installation_id', installationId)

    const onboardingData: Record<string, string> = {}
    if (onboardingRows) {
      for (const row of onboardingRows) {
        onboardingData[row.field_name] = row.field_value
      }
    }

    // Build context
    const context: ExecutionContext = {
      installationId,
      userId: installation.user_id,
      skillId: skill.id,
      skillSlug: skill.slug,

      config: installation.config || {},
      environment: installation.environment || {},
      permissions: (installation.permissions_granted || []) as PermissionType[],

      manifest,

      variables: {},
      input,

      onboardingData,
    }

    return {
      success: true,
      context,
    }
  } catch (err) {
    console.error('Error building execution context:', err)
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Unknown error',
    }
  }
}

/**
 * Resolve a template string with context variables
 * Supports {{variable}} syntax
 */
export function resolveTemplate(
  template: string,
  context: ExecutionContext
): string {
  return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
    // Check in order: variables, input, onboardingData, config, environment
    if (key in context.variables) {
      const value = context.variables[key]
      return typeof value === 'object' ? JSON.stringify(value) : String(value)
    }
    if (key in context.input) {
      const value = context.input[key]
      return typeof value === 'object' ? JSON.stringify(value) : String(value)
    }
    if (key in context.onboardingData) {
      return context.onboardingData[key]
    }
    if (key in context.config) {
      const value = context.config[key]
      return typeof value === 'object' ? JSON.stringify(value) : String(value)
    }
    if (key in context.environment) {
      return context.environment[key]
    }
    // Return original if not found
    return match
  })
}

/**
 * Resolve all template strings in an object recursively
 */
export function resolveObjectTemplates(
  obj: any,
  context: ExecutionContext
): any {
  if (typeof obj === 'string') {
    return resolveTemplate(obj, context)
  }
  if (Array.isArray(obj)) {
    return obj.map((item) => resolveObjectTemplates(item, context))
  }
  if (obj && typeof obj === 'object') {
    const result: Record<string, any> = {}
    for (const [key, value] of Object.entries(obj)) {
      result[key] = resolveObjectTemplates(value, context)
    }
    return result
  }
  return obj
}

/**
 * Evaluate a condition expression against context
 * For security, only allows simple property access and comparisons
 */
export function evaluateCondition(
  condition: string,
  context: ExecutionContext
): boolean {
  try {
    // Create a safe evaluation context
    const evalContext = {
      config: context.config,
      input: context.input,
      variables: context.variables,
      onboarding: context.onboardingData,
      env: context.environment,
    }

    // Simple pattern matching for common conditions
    // e.g., "config.custom_domain && config.custom_domain.length > 0"

    // Replace variable references with actual values
    let safeCondition = condition
      .replace(/config\.(\w+)/g, (_, key) => JSON.stringify(context.config[key] ?? null))
      .replace(/input\.(\w+)/g, (_, key) => JSON.stringify(context.input[key] ?? null))
      .replace(/variables\.(\w+)/g, (_, key) => JSON.stringify(context.variables[key] ?? null))
      .replace(/onboarding\.(\w+)/g, (_, key) => JSON.stringify(context.onboardingData[key] ?? null))
      .replace(/env\.(\w+)/g, (_, key) => JSON.stringify(context.environment[key] ?? null))

    // Very basic safe eval for simple conditions
    // Only allows: true, false, null, numbers, strings, &&, ||, !, >, <, >=, <=, ===, !==, .length
    const safePattern = /^[\s\d\w\.\"\'\[\]&|!><=\(\)null\-]+$/
    if (!safePattern.test(safeCondition)) {
      console.warn('Unsafe condition pattern, defaulting to false:', condition)
      return false
    }

    // Use Function constructor for controlled evaluation
    const fn = new Function(`return (${safeCondition})`)
    return Boolean(fn())
  } catch (err) {
    console.warn('Error evaluating condition:', condition, err)
    return false
  }
}

/**
 * Store a variable in the execution context
 */
export function setContextVariable(
  context: ExecutionContext,
  key: string,
  value: any
): void {
  context.variables[key] = value
}

/**
 * Get a variable from execution context
 * Searches in order: variables, input, onboardingData, config, environment
 */
export function getContextVariable(
  context: ExecutionContext,
  key: string
): any {
  if (key in context.variables) return context.variables[key]
  if (key in context.input) return context.input[key]
  if (key in context.onboardingData) return context.onboardingData[key]
  if (key in context.config) return context.config[key]
  if (key in context.environment) return context.environment[key]
  return undefined
}
