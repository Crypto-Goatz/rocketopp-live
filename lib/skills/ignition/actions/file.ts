// Ignition File Action Handler
// Handles file:create, file:modify, file:delete, file:template

import {
  ActionConfig,
  ActionResult,
  ExecutionContext,
  FileActionConfig,
} from '../types'
import { resolveTemplate, resolveObjectTemplates } from '../context'
import { createErrorResult, createSuccessResult } from './registry'

// In-memory file storage for skill execution
// In a full implementation, this would use actual file system or cloud storage
interface FileStore {
  files: Map<string, { content: string; encoding: string; createdAt: string }>
}

// Per-execution file stores
const fileStores: Map<string, FileStore> = new Map()

/**
 * Get or create a file store for an execution
 */
function getFileStore(executionId: string): FileStore {
  if (!fileStores.has(executionId)) {
    fileStores.set(executionId, { files: new Map() })
  }
  return fileStores.get(executionId)!
}

/**
 * Clear file store after execution completes
 */
export function clearFileStore(executionId: string): void {
  fileStores.delete(executionId)
}

/**
 * Get all files from a store (for deployment)
 */
export function getFilesFromStore(
  executionId: string
): Array<{ path: string; content: string; encoding: string }> {
  const store = fileStores.get(executionId)
  if (!store) return []

  const files: Array<{ path: string; content: string; encoding: string }> = []
  for (const [path, data] of store.files.entries()) {
    files.push({ path, content: data.content, encoding: data.encoding })
  }
  return files
}

/**
 * Main file action handler
 */
export async function fileHandler(
  context: ExecutionContext,
  config: ActionConfig
): Promise<ActionResult> {
  const fileConfig = config as FileActionConfig
  const { type, path: rawPath } = fileConfig

  // Resolve path template
  const path = resolveTemplate(rawPath, context)

  // Get execution-specific file store
  // Using installationId as a proxy for execution context
  const store = getFileStore(context.installationId)

  switch (type) {
    case 'file:create':
      return handleCreate(store, path, fileConfig, context)
    case 'file:modify':
      return handleModify(store, path, fileConfig, context)
    case 'file:delete':
      return handleDelete(store, path)
    case 'file:template':
      return handleTemplate(store, path, fileConfig, context)
    default:
      return createErrorResult(`Unknown file action type: ${type}`)
  }
}

/**
 * Handle file creation
 */
async function handleCreate(
  store: FileStore,
  path: string,
  config: FileActionConfig,
  context: ExecutionContext
): Promise<ActionResult> {
  // Check if file already exists
  if (store.files.has(path)) {
    return createErrorResult(`File already exists: ${path}`)
  }

  // Resolve content template
  const content = config.content
    ? resolveTemplate(config.content, context)
    : ''

  const encoding = config.encoding || 'utf-8'

  // Store the file
  store.files.set(path, {
    content,
    encoding,
    createdAt: new Date().toISOString(),
  })

  return createSuccessResult(
    { path, size: content.length },
    {
      beforeState: null,
      afterState: { path, content, encoding },
      reversible: true,
      metadata: { action: 'create', path },
    }
  )
}

/**
 * Handle file modification
 */
async function handleModify(
  store: FileStore,
  path: string,
  config: FileActionConfig,
  context: ExecutionContext
): Promise<ActionResult> {
  // Get existing file
  const existing = store.files.get(path)

  // Resolve content template
  const content = config.content
    ? resolveTemplate(config.content, context)
    : ''

  const encoding = config.encoding || existing?.encoding || 'utf-8'

  // Store before state for rollback
  const beforeState = existing
    ? { path, content: existing.content, encoding: existing.encoding }
    : null

  // Update the file
  store.files.set(path, {
    content,
    encoding,
    createdAt: existing?.createdAt || new Date().toISOString(),
  })

  return createSuccessResult(
    { path, size: content.length, existed: !!existing },
    {
      beforeState,
      afterState: { path, content, encoding },
      reversible: true,
      metadata: { action: 'modify', path, existed: !!existing },
    }
  )
}

/**
 * Handle file deletion
 */
async function handleDelete(
  store: FileStore,
  path: string
): Promise<ActionResult> {
  // Get existing file
  const existing = store.files.get(path)

  if (!existing) {
    return createErrorResult(`File not found: ${path}`)
  }

  // Store before state for rollback
  const beforeState = {
    path,
    content: existing.content,
    encoding: existing.encoding,
  }

  // Delete the file
  store.files.delete(path)

  return createSuccessResult(
    { path, deleted: true },
    {
      beforeState,
      afterState: null,
      reversible: true,
      metadata: { action: 'delete', path },
    }
  )
}

/**
 * Handle file creation from template
 */
async function handleTemplate(
  store: FileStore,
  path: string,
  config: FileActionConfig,
  context: ExecutionContext
): Promise<ActionResult> {
  // Get template content
  let templateContent: string

  if (config.templateId) {
    // Load from predefined templates
    const template = getTemplate(config.templateId)
    if (!template) {
      return createErrorResult(`Template not found: ${config.templateId}`)
    }
    templateContent = template
  } else if (config.content) {
    templateContent = config.content
  } else {
    return createErrorResult('Template requires either templateId or content')
  }

  // Merge custom variables with context
  const variables = config.variables || {}
  const mergedContext: ExecutionContext = {
    ...context,
    variables: { ...context.variables, ...variables },
  }

  // Resolve all templates in content
  const content = resolveTemplate(templateContent, mergedContext)
  const encoding = config.encoding || 'utf-8'

  // Store the file
  store.files.set(path, {
    content,
    encoding,
    createdAt: new Date().toISOString(),
  })

  return createSuccessResult(
    { path, size: content.length, templateId: config.templateId },
    {
      beforeState: null,
      afterState: { path, content, encoding },
      reversible: true,
      metadata: { action: 'template', path, templateId: config.templateId },
    }
  )
}

/**
 * Get a predefined template by ID
 * Templates can be added here for common file types
 */
function getTemplate(templateId: string): string | null {
  const templates: Record<string, string> = {
    'nextjs-page': `'use client'

export default function {{PageName}}Page() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">{{title}}</h1>
      <p className="text-gray-600 mt-2">{{description}}</p>
    </div>
  )
}
`,
    'nextjs-layout': `export default function {{LayoutName}}Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen">
      {children}
    </div>
  )
}
`,
    'react-component': `interface {{ComponentName}}Props {
  className?: string
}

export function {{ComponentName}}({ className }: {{ComponentName}}Props) {
  return (
    <div className={className}>
      {{ComponentName}}
    </div>
  )
}
`,
    'api-route': `import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // TODO: Implement
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    // TODO: Implement
    return NextResponse.json({ success: true, data: body })
  } catch (error) {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
`,
    'package-json': `{
  "name": "{{name}}",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0",
    "tailwindcss": "^3.4.0",
    "typescript": "^5.0.0"
  }
}
`,
    'tailwind-config': `import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '{{primaryColor}}',
      },
    },
  },
  plugins: [],
}
export default config
`,
    'next-config': `/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
}

module.exports = nextConfig
`,
    'tsconfig': `{
  "compilerOptions": {
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
`,
  }

  return templates[templateId] || null
}

/**
 * Get available template IDs
 */
export function getAvailableTemplates(): string[] {
  return [
    'nextjs-page',
    'nextjs-layout',
    'react-component',
    'api-route',
    'package-json',
    'tailwind-config',
    'next-config',
    'tsconfig',
  ]
}
