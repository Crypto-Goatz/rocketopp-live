// Skill Exporter
// Exports skills as downloadable packages

import { supabaseAdmin } from '@/lib/db/supabase'
import { Skill, SkillManifest } from '../types'
import {
  SkillPackage,
  PackageFile,
  ExportOptions,
  ExportResult,
} from './types'

/**
 * Export a skill as a package
 */
export async function exportSkill(
  skillId: string,
  options: ExportOptions = { format: 'json' }
): Promise<ExportResult> {
  try {
    // Get skill from database
    const { data: skill, error } = await supabaseAdmin
      .from('skills')
      .select('*')
      .eq('id', skillId)
      .single()

    if (error || !skill) {
      return {
        success: false,
        errors: ['Skill not found'],
      }
    }

    // Build the package
    const skillPackage = await buildPackage(skill as Skill, options)

    if (options.format === 'json') {
      return {
        success: true,
        package: skillPackage,
        errors: [],
      }
    }

    // For zip format, return the package data
    // (actual zip creation would be done client-side or via a separate endpoint)
    return {
      success: true,
      package: skillPackage,
      errors: [],
    }
  } catch (err: any) {
    return {
      success: false,
      errors: [err.message],
    }
  }
}

/**
 * Build a skill package from database record
 */
async function buildPackage(
  skill: Skill,
  options: ExportOptions
): Promise<SkillPackage> {
  const manifest = skill.manifest as SkillManifest

  // Build package files based on skill type
  const files: PackageFile[] = generateSkillFiles(skill, manifest)

  // Generate README if requested
  let readme: string | undefined
  if (options.includeReadme) {
    readme = generateReadme(skill, manifest)
  }

  const skillPackage: SkillPackage = {
    version: '1.0.0',
    manifest,
    files,
    readme,
    createdAt: new Date().toISOString(),
    exportedFrom: 'RocketOpp',
  }

  return skillPackage
}

/**
 * Generate skill files based on manifest
 */
function generateSkillFiles(skill: Skill, manifest: SkillManifest): PackageFile[] {
  const files: PackageFile[] = []
  const slug = skill.slug

  // Main library file
  files.push({
    path: `lib/${slug}/index.ts`,
    type: 'lib',
    content: `// ${skill.name}
// ${skill.description || 'No description'}
// Version: ${manifest.version}

export interface ${toPascalCase(slug)}Config {
${manifest.onboarding.map(f => `  ${f.field}${f.required ? '' : '?'}: string`).join('\n') || '  // No configuration required'}
}

export async function execute(config: ${toPascalCase(slug)}Config) {
  // Implement your skill logic here
  return {
    success: true,
    message: '${skill.name} executed successfully',
  }
}

export default { execute }
`,
  })

  // API route
  files.push({
    path: `app/api/skills/${slug}/route.ts`,
    type: 'api',
    content: `import { NextRequest, NextResponse } from 'next/server'
import { execute } from '@/lib/${slug}'

export async function POST(request: NextRequest) {
  try {
    const config = await request.json()
    const result = await execute(config)
    return NextResponse.json({ success: true, data: result })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    name: '${skill.name}',
    version: '${manifest.version}',
    status: 'active',
  })
}
`,
  })

  // Dashboard page if configured
  if (manifest.dashboard) {
    files.push({
      path: `app${manifest.dashboard.route}/page.tsx`,
      type: 'component',
      content: `"use client"

import { useState, useEffect } from "react"

export default function ${toPascalCase(slug)}Page() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Initialize skill
    setLoading(false)
  }, [])

  if (loading) {
    return <div className="p-8">Loading...</div>
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-white">${skill.name}</h1>
      <p className="text-white/60 mt-2">${skill.description || ''}</p>
    </div>
  )
}
`,
    })
  }

  return files
}

/**
 * Generate README for the skill
 */
function generateReadme(skill: Skill, manifest: SkillManifest): string {
  const permissions = manifest.permissions
    .map(p => `- \`${p}\``)
    .join('\n')

  const onboarding = manifest.onboarding.length > 0
    ? manifest.onboarding
        .map(f => `- **${f.label}** (${f.type})${f.required ? ' *required*' : ''}: ${f.description || ''}`)
        .join('\n')
    : 'No configuration required'

  return `# ${skill.name}

${skill.description || 'No description provided.'}

## Version

${manifest.version}

## Author

${skill.author || 'Unknown'}

## Category

${skill.category}

## Permissions Required

${permissions}

## Configuration

${onboarding}

## Installation

1. Go to your RocketOpp dashboard
2. Navigate to Skills > Install
3. Upload this package or paste the manifest URL
4. Complete the onboarding process
5. The skill will be ready to use

## Usage

Once installed, you can:
- Access the skill from your dashboard
- Configure it via the Skills settings
- Run it manually or on a schedule (if supported)

## Files Included

This package includes:
- Library code (\`lib/${skill.slug}/\`)
- API routes (\`app/api/skills/${skill.slug}/\`)
${manifest.dashboard ? `- Dashboard page (\`app${manifest.dashboard.route}/\`)` : ''}

## License

MIT

---

*Exported from RocketOpp Skill System*
`
}

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
 * Export skill as JSON string
 */
export async function exportSkillAsJson(
  skillId: string,
  pretty: boolean = true
): Promise<string | null> {
  const result = await exportSkill(skillId, { format: 'json', includeReadme: true })

  if (!result.success || !result.package) {
    return null
  }

  return JSON.stringify(result.package, null, pretty ? 2 : 0)
}

/**
 * Export multiple skills
 */
export async function exportMultipleSkills(
  skillIds: string[],
  options: ExportOptions = { format: 'json' }
): Promise<{ skillId: string; result: ExportResult }[]> {
  const results = await Promise.all(
    skillIds.map(async skillId => ({
      skillId,
      result: await exportSkill(skillId, options),
    }))
  )

  return results
}

/**
 * Create a shareable manifest URL
 */
export function createManifestUrl(skillPackage: SkillPackage): string {
  // Encode manifest as base64 for URL
  const manifestJson = JSON.stringify(skillPackage.manifest)
  const encoded = Buffer.from(manifestJson).toString('base64')

  // This would be a hosted endpoint that decodes and returns the manifest
  return `https://rocketopp.com/api/skills/manifest/${encoded}`
}
