// Skill Importer
// Imports skills from packages (JSON, URL, or file upload)

import { supabaseAdmin } from '@/lib/db/supabase'
import { SkillManifest } from '../types'
import { parseManifest } from '../parser'
import { installSkill } from '../runtime'
import {
  SkillPackage,
  ImportOptions,
  ImportResult,
  ValidationResult,
} from './types'

/**
 * Import a skill from a package
 */
export async function importSkill(
  options: ImportOptions,
  userId?: string
): Promise<ImportResult> {
  try {
    let skillPackage: SkillPackage

    switch (options.source) {
      case 'url':
        if (!options.url) {
          return { success: false, errors: ['URL is required'], warnings: [] }
        }
        skillPackage = await fetchPackageFromUrl(options.url)
        break

      case 'file':
        if (!options.fileContent) {
          return { success: false, errors: ['File content is required'], warnings: [] }
        }
        skillPackage = parsePackageContent(options.fileContent)
        break

      case 'npm':
        return { success: false, errors: ['NPM import not yet supported'], warnings: [] }

      default:
        return { success: false, errors: ['Invalid source type'], warnings: [] }
    }

    // Validate the package
    const validation = validatePackage(skillPackage)
    if (!validation.valid) {
      return {
        success: false,
        errors: validation.errors,
        warnings: validation.warnings,
      }
    }

    // Create or update skill in database
    const result = await saveSkillToDatabase(skillPackage)

    if (!result.success) {
      return {
        success: false,
        errors: result.errors,
        warnings: validation.warnings,
      }
    }

    // Auto-install if requested and userId provided
    if (options.autoInstall && userId && result.skillId) {
      const installResult = await installSkill(userId, result.skillId)
      if (!installResult.success) {
        return {
          success: true,
          skill: {
            id: result.skillId,
            slug: skillPackage.manifest.slug,
            name: skillPackage.manifest.name,
          },
          errors: [],
          warnings: [...validation.warnings, `Auto-install failed: ${installResult.error}`],
        }
      }
    }

    return {
      success: true,
      skill: result.skillId
        ? {
            id: result.skillId,
            slug: skillPackage.manifest.slug,
            name: skillPackage.manifest.name,
          }
        : undefined,
      errors: [],
      warnings: validation.warnings,
    }
  } catch (err: any) {
    return {
      success: false,
      errors: [err.message],
      warnings: [],
    }
  }
}

/**
 * Fetch package from URL
 */
async function fetchPackageFromUrl(url: string): Promise<SkillPackage> {
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`Failed to fetch package: ${response.status} ${response.statusText}`)
  }

  const content = await response.text()
  return parsePackageContent(content)
}

/**
 * Parse package content (JSON)
 */
function parsePackageContent(content: string): SkillPackage {
  try {
    const parsed = JSON.parse(content)

    // Check if it's a full package or just a manifest
    if (parsed.manifest && parsed.files) {
      return parsed as SkillPackage
    }

    // If it's just a manifest, wrap it in a package
    if (parsed.name && parsed.slug && parsed.version) {
      return {
        version: '1.0.0',
        manifest: parsed as SkillManifest,
        files: [],
        createdAt: new Date().toISOString(),
      }
    }

    throw new Error('Invalid package format')
  } catch (err) {
    if (err instanceof SyntaxError) {
      throw new Error('Invalid JSON format')
    }
    throw err
  }
}

/**
 * Validate a skill package
 */
export function validatePackage(pkg: SkillPackage): ValidationResult {
  const errors: string[] = []
  const warnings: string[] = []

  // Check package version
  if (!pkg.version) {
    errors.push('Package version is required')
  }

  // Validate manifest
  const manifestResult = parseManifest(pkg.manifest)
  if (!manifestResult.success) {
    errors.push(...manifestResult.errors)
  }
  warnings.push(...manifestResult.warnings)

  // Validate files
  if (pkg.files) {
    for (const file of pkg.files) {
      if (!file.path) {
        errors.push('File path is required for all files')
      }
      if (!file.content && file.content !== '') {
        errors.push(`File content is required: ${file.path}`)
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    manifest: manifestResult.manifest,
  }
}

/**
 * Save skill to database
 */
async function saveSkillToDatabase(
  pkg: SkillPackage
): Promise<{ success: boolean; skillId?: string; errors: string[] }> {
  const manifest = pkg.manifest

  try {
    // Check if skill with this slug already exists
    const { data: existing } = await supabaseAdmin
      .from('skills')
      .select('id')
      .eq('slug', manifest.slug)
      .single()

    if (existing) {
      // Update existing skill
      const { error: updateError } = await supabaseAdmin
        .from('skills')
        .update({
          name: manifest.name,
          description: manifest.description,
          version: manifest.version,
          author: manifest.author,
          icon: manifest.icon,
          icon_url: manifest.iconUrl,
          category: manifest.category || 'custom',
          manifest,
          source_url: pkg.exportedFrom,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existing.id)

      if (updateError) {
        return { success: false, errors: [updateError.message] }
      }

      return { success: true, skillId: existing.id, errors: [] }
    }

    // Insert new skill
    const { data: newSkill, error: insertError } = await supabaseAdmin
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
        source_url: pkg.exportedFrom,
        is_marketplace: false,
      })
      .select('id')
      .single()

    if (insertError || !newSkill) {
      return { success: false, errors: [insertError?.message || 'Failed to create skill'] }
    }

    return { success: true, skillId: newSkill.id, errors: [] }
  } catch (err: any) {
    return { success: false, errors: [err.message] }
  }
}

/**
 * Import from base64 encoded package
 */
export async function importFromBase64(
  base64: string,
  userId?: string,
  autoInstall: boolean = false
): Promise<ImportResult> {
  try {
    const content = Buffer.from(base64, 'base64').toString('utf-8')
    return importSkill(
      { source: 'file', fileContent: content, autoInstall },
      userId
    )
  } catch (err: any) {
    return {
      success: false,
      errors: [`Failed to decode base64: ${err.message}`],
      warnings: [],
    }
  }
}

/**
 * Preview import without actually importing
 */
export async function previewImport(
  options: ImportOptions
): Promise<{
  valid: boolean
  manifest?: SkillManifest
  files?: { path: string; type: string }[]
  errors: string[]
  warnings: string[]
}> {
  try {
    let skillPackage: SkillPackage

    switch (options.source) {
      case 'url':
        if (!options.url) {
          return { valid: false, errors: ['URL is required'], warnings: [] }
        }
        skillPackage = await fetchPackageFromUrl(options.url)
        break

      case 'file':
        if (!options.fileContent) {
          return { valid: false, errors: ['File content is required'], warnings: [] }
        }
        skillPackage = parsePackageContent(options.fileContent)
        break

      default:
        return { valid: false, errors: ['Invalid source type'], warnings: [] }
    }

    const validation = validatePackage(skillPackage)

    return {
      valid: validation.valid,
      manifest: skillPackage.manifest,
      files: skillPackage.files?.map(f => ({ path: f.path, type: f.type })),
      errors: validation.errors,
      warnings: validation.warnings,
    }
  } catch (err: any) {
    return {
      valid: false,
      errors: [err.message],
      warnings: [],
    }
  }
}

/**
 * Check if a skill can be imported (no conflicts)
 */
export async function checkImportCompatibility(
  manifest: SkillManifest
): Promise<{
  compatible: boolean
  existingSkill?: { id: string; version: string }
  warnings: string[]
}> {
  const warnings: string[] = []

  // Check for existing skill with same slug
  const { data: existing } = await supabaseAdmin
    .from('skills')
    .select('id, version')
    .eq('slug', manifest.slug)
    .single()

  if (existing) {
    warnings.push(`A skill with slug "${manifest.slug}" already exists (v${existing.version}). It will be updated.`)
    return {
      compatible: true,
      existingSkill: { id: existing.id, version: existing.version },
      warnings,
    }
  }

  return { compatible: true, warnings }
}
