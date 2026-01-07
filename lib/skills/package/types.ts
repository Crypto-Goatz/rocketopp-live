// Skill Package Types
// For creating, exporting, and importing standalone skill packages

import { SkillManifest, PermissionType, OnboardingField } from '../types'

// Skill package format (for export/import)
export interface SkillPackage {
  version: '1.0.0' // Package format version
  manifest: SkillManifest
  files: PackageFile[]
  assets?: PackageAsset[]
  readme?: string
  changelog?: string
  license?: string
  createdAt: string
  exportedFrom?: string
}

// File in the package
export interface PackageFile {
  path: string
  content: string
  type: 'api' | 'lib' | 'component' | 'hook' | 'config' | 'other'
  encoding?: 'utf-8' | 'base64'
}

// Asset (images, etc)
export interface PackageAsset {
  path: string
  content: string // base64 encoded
  mimeType: string
}

// Skill template for creating new skills
export interface SkillTemplate {
  id: string
  name: string
  description: string
  category: string
  icon: string
  manifest: Partial<SkillManifest>
  files: TemplateFile[]
  variables: TemplateVariable[]
}

// Template file with placeholders
export interface TemplateFile {
  path: string
  template: string
  type: PackageFile['type']
}

// Variable to be replaced in template
export interface TemplateVariable {
  name: string
  label: string
  description?: string
  type: 'text' | 'slug' | 'select' | 'boolean'
  required: boolean
  default?: string
  options?: { value: string; label: string }[]
  validation?: string // regex pattern
}

// Skill creation options
export interface CreateSkillOptions {
  templateId: string
  variables: Record<string, string>
  outputPath?: string
}

// Export options
export interface ExportOptions {
  format: 'json' | 'zip' | 'npm'
  includeAssets?: boolean
  includeReadme?: boolean
  minify?: boolean
}

// Import options
export interface ImportOptions {
  source: 'url' | 'file' | 'npm'
  url?: string
  fileContent?: string
  packageName?: string
  autoInstall?: boolean
}

// Import result
export interface ImportResult {
  success: boolean
  skill?: {
    id: string
    slug: string
    name: string
  }
  errors: string[]
  warnings: string[]
}

// Export result
export interface ExportResult {
  success: boolean
  package?: SkillPackage
  downloadUrl?: string
  errors: string[]
}

// Validation result
export interface ValidationResult {
  valid: boolean
  errors: string[]
  warnings: string[]
  manifest?: SkillManifest
}
