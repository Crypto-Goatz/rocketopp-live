// Skill Templates
// Pre-built templates for creating new skills

import { SkillTemplate } from './types'

export const SKILL_TEMPLATES: SkillTemplate[] = [
  {
    id: 'blank',
    name: 'Blank Skill',
    description: 'Start from scratch with a minimal skill structure',
    category: 'general',
    icon: 'file',
    manifest: {
      permissions: ['api:read'],
      onboarding: [],
    },
    files: [
      {
        path: 'lib/{{slug}}/index.ts',
        type: 'lib',
        template: `// {{name}} Skill
// {{description}}

export interface {{pascalCase}}Config {
  // Add your configuration options here
}

export async function execute(config: {{pascalCase}}Config) {
  // Implement your skill logic here
  console.log('{{name}} executed with config:', config)

  return {
    success: true,
    message: '{{name}} completed successfully',
  }
}

export default {
  execute,
}
`,
      },
      {
        path: 'app/api/skills/{{slug}}/route.ts',
        type: 'api',
        template: `import { NextRequest, NextResponse } from 'next/server'
import { execute } from '@/lib/{{slug}}'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const result = await execute(body)

    return NextResponse.json({
      success: true,
      data: result,
    })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    name: '{{name}}',
    version: '{{version}}',
    status: 'active',
  })
}
`,
      },
    ],
    variables: [
      {
        name: 'name',
        label: 'Skill Name',
        type: 'text',
        required: true,
        description: 'Human-readable name for your skill',
      },
      {
        name: 'slug',
        label: 'Skill Slug',
        type: 'slug',
        required: true,
        description: 'URL-safe identifier (lowercase, hyphens only)',
        validation: '^[a-z0-9-]+$',
      },
      {
        name: 'description',
        label: 'Description',
        type: 'text',
        required: true,
        description: 'Brief description of what the skill does',
      },
      {
        name: 'version',
        label: 'Version',
        type: 'text',
        required: true,
        default: '1.0.0',
      },
      {
        name: 'author',
        label: 'Author',
        type: 'text',
        required: false,
      },
    ],
  },

  {
    id: 'api-integration',
    name: 'API Integration',
    description: 'Connect to an external API and process data',
    category: 'integrations',
    icon: 'globe',
    manifest: {
      permissions: ['api:read', 'api:write', 'env:*'],
      onboarding: [
        {
          field: 'api_key',
          label: 'API Key',
          type: 'password',
          required: true,
          description: 'Your API key for authentication',
        },
        {
          field: 'api_url',
          label: 'API Base URL',
          type: 'url',
          required: true,
          description: 'Base URL for the API',
        },
      ],
    },
    files: [
      {
        path: 'lib/{{slug}}/client.ts',
        type: 'lib',
        template: `// {{name}} API Client

export interface {{pascalCase}}Config {
  apiKey: string
  baseUrl: string
}

export class {{pascalCase}}Client {
  private apiKey: string
  private baseUrl: string

  constructor(config: {{pascalCase}}Config) {
    this.apiKey = config.apiKey
    this.baseUrl = config.baseUrl.replace(/\\/$/, '')
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = \`\${this.baseUrl}\${endpoint}\`

    const response = await fetch(url, {
      ...options,
      headers: {
        'Authorization': \`Bearer \${this.apiKey}\`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    })

    if (!response.ok) {
      throw new Error(\`API error: \${response.status} \${response.statusText}\`)
    }

    return response.json()
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' })
  }

  async post<T>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  // Add more methods as needed
}

export function createClient(config: {{pascalCase}}Config) {
  return new {{pascalCase}}Client(config)
}
`,
      },
      {
        path: 'lib/{{slug}}/index.ts',
        type: 'lib',
        template: `// {{name}} Skill
import { createClient, {{pascalCase}}Config } from './client'

export async function execute(config: {{pascalCase}}Config & { action: string }) {
  const client = createClient(config)

  switch (config.action) {
    case 'fetch':
      return await client.get('/data')

    case 'sync':
      // Implement sync logic
      return { synced: true }

    default:
      throw new Error(\`Unknown action: \${config.action}\`)
  }
}

export { createClient, {{pascalCase}}Client } from './client'
`,
      },
      {
        path: 'app/api/skills/{{slug}}/route.ts',
        type: 'api',
        template: `import { NextRequest, NextResponse } from 'next/server'
import { execute } from '@/lib/{{slug}}'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Get config from environment or request
    const config = {
      apiKey: process.env.{{upperSnakeCase}}_API_KEY || body.apiKey,
      baseUrl: process.env.{{upperSnakeCase}}_BASE_URL || body.baseUrl,
      action: body.action,
    }

    if (!config.apiKey) {
      return NextResponse.json(
        { success: false, error: 'API key is required' },
        { status: 400 }
      )
    }

    const result = await execute(config)

    return NextResponse.json({
      success: true,
      data: result,
    })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
`,
      },
    ],
    variables: [
      {
        name: 'name',
        label: 'Skill Name',
        type: 'text',
        required: true,
      },
      {
        name: 'slug',
        label: 'Skill Slug',
        type: 'slug',
        required: true,
        validation: '^[a-z0-9-]+$',
      },
      {
        name: 'description',
        label: 'Description',
        type: 'text',
        required: true,
      },
      {
        name: 'version',
        label: 'Version',
        type: 'text',
        required: true,
        default: '1.0.0',
      },
    ],
  },

  {
    id: 'dashboard-widget',
    name: 'Dashboard Widget',
    description: 'Create a widget that displays on the dashboard',
    category: 'ui',
    icon: 'layout-dashboard',
    manifest: {
      permissions: ['api:read'],
      onboarding: [],
      dashboard: {
        route: '/dashboard/widgets/{{slug}}',
        sidebar: {
          label: '{{name}}',
          icon: 'layout-dashboard',
        },
      },
    },
    files: [
      {
        path: 'app/dashboard/widgets/{{slug}}/page.tsx',
        type: 'component',
        template: `"use client"

import { useState, useEffect } from "react"
import { {{iconComponent}} } from "lucide-react"

interface WidgetData {
  // Define your widget data structure
  value: number
  label: string
}

export default function {{pascalCase}}Widget() {
  const [data, setData] = useState<WidgetData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const res = await fetch('/api/skills/{{slug}}')
      const json = await res.json()
      if (json.success) {
        setData(json.data)
      }
    } catch (error) {
      console.error('Failed to fetch widget data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-red-500/20 flex items-center justify-center">
          <{{iconComponent}} className="w-5 h-5 text-primary" />
        </div>
        <h1 className="text-2xl font-bold text-white">{{name}}</h1>
      </div>

      <div className="grid gap-4">
        <div className="p-6 rounded-2xl bg-zinc-900/50 border border-white/10">
          <p className="text-4xl font-bold text-white">{data?.value || 0}</p>
          <p className="text-sm text-white/50 mt-1">{data?.label || 'No data'}</p>
        </div>

        {/* Add more widget content here */}
      </div>
    </div>
  )
}
`,
      },
      {
        path: 'app/api/skills/{{slug}}/route.ts',
        type: 'api',
        template: `import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  // Implement your data fetching logic
  const data = {
    value: 42,
    label: '{{name}} metric',
  }

  return NextResponse.json({
    success: true,
    data,
  })
}
`,
      },
    ],
    variables: [
      {
        name: 'name',
        label: 'Widget Name',
        type: 'text',
        required: true,
      },
      {
        name: 'slug',
        label: 'Widget Slug',
        type: 'slug',
        required: true,
        validation: '^[a-z0-9-]+$',
      },
      {
        name: 'description',
        label: 'Description',
        type: 'text',
        required: true,
      },
      {
        name: 'iconComponent',
        label: 'Icon',
        type: 'select',
        required: true,
        default: 'LayoutDashboard',
        options: [
          { value: 'LayoutDashboard', label: 'Dashboard' },
          { value: 'BarChart3', label: 'Chart' },
          { value: 'Users', label: 'Users' },
          { value: 'DollarSign', label: 'Money' },
          { value: 'Activity', label: 'Activity' },
          { value: 'Zap', label: 'Lightning' },
        ],
      },
    ],
  },

  {
    id: 'cron-job',
    name: 'Scheduled Task',
    description: 'Create a skill that runs on a schedule',
    category: 'automation',
    icon: 'clock',
    manifest: {
      permissions: ['api:read', 'api:write', 'cron:*'],
      onboarding: [
        {
          field: 'schedule',
          label: 'Schedule (cron)',
          type: 'text',
          required: true,
          description: 'Cron expression (e.g., 0 * * * * for hourly)',
        },
      ],
      schedules: [
        {
          name: 'main',
          cron: '{{schedule}}',
          handler: 'execute',
        },
      ],
    },
    files: [
      {
        path: 'lib/{{slug}}/index.ts',
        type: 'lib',
        template: `// {{name}} - Scheduled Task
// {{description}}

export interface TaskResult {
  success: boolean
  processed: number
  errors: string[]
  timestamp: string
}

export async function execute(): Promise<TaskResult> {
  const errors: string[] = []
  let processed = 0

  try {
    // Implement your scheduled task logic here
    console.log('Running scheduled task: {{name}}')

    // Example: Process items
    const items = await fetchItemsToProcess()

    for (const item of items) {
      try {
        await processItem(item)
        processed++
      } catch (err) {
        errors.push(\`Failed to process item \${item.id}: \${err}\`)
      }
    }

    return {
      success: errors.length === 0,
      processed,
      errors,
      timestamp: new Date().toISOString(),
    }
  } catch (error: any) {
    return {
      success: false,
      processed,
      errors: [...errors, error.message],
      timestamp: new Date().toISOString(),
    }
  }
}

async function fetchItemsToProcess() {
  // Implement fetching logic
  return []
}

async function processItem(item: any) {
  // Implement processing logic
}
`,
      },
      {
        path: 'app/api/skills/{{slug}}/route.ts',
        type: 'api',
        template: `import { NextRequest, NextResponse } from 'next/server'
import { execute } from '@/lib/{{slug}}'

// Manual trigger endpoint
export async function POST(request: NextRequest) {
  try {
    const result = await execute()

    return NextResponse.json({
      success: true,
      result,
    })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

// Status endpoint
export async function GET() {
  return NextResponse.json({
    name: '{{name}}',
    version: '{{version}}',
    type: 'scheduled-task',
    schedule: '{{schedule}}',
  })
}
`,
      },
      {
        path: 'app/api/cron/{{slug}}/route.ts',
        type: 'api',
        template: `import { NextRequest, NextResponse } from 'next/server'
import { execute } from '@/lib/{{slug}}'

// Vercel Cron endpoint
export async function GET(request: NextRequest) {
  // Verify cron secret if needed
  const authHeader = request.headers.get('authorization')

  if (process.env.CRON_SECRET && authHeader !== \`Bearer \${process.env.CRON_SECRET}\`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const result = await execute()

    return NextResponse.json({
      success: true,
      result,
    })
  } catch (error: any) {
    console.error('Cron job failed:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

export const dynamic = 'force-dynamic'
`,
      },
    ],
    variables: [
      {
        name: 'name',
        label: 'Task Name',
        type: 'text',
        required: true,
      },
      {
        name: 'slug',
        label: 'Task Slug',
        type: 'slug',
        required: true,
        validation: '^[a-z0-9-]+$',
      },
      {
        name: 'description',
        label: 'Description',
        type: 'text',
        required: true,
      },
      {
        name: 'schedule',
        label: 'Cron Schedule',
        type: 'text',
        required: true,
        default: '0 * * * *',
        description: 'Cron expression (default: hourly)',
      },
      {
        name: 'version',
        label: 'Version',
        type: 'text',
        required: true,
        default: '1.0.0',
      },
    ],
  },

  {
    id: 'database-sync',
    name: 'Database Sync',
    description: 'Sync data between external source and database',
    category: 'data',
    icon: 'database',
    manifest: {
      permissions: ['api:read', 'api:write', 'database:*', 'env:*'],
      onboarding: [
        {
          field: 'source_url',
          label: 'Data Source URL',
          type: 'url',
          required: true,
        },
        {
          field: 'table_name',
          label: 'Target Table',
          type: 'text',
          required: true,
        },
      ],
    },
    files: [
      {
        path: 'lib/{{slug}}/sync.ts',
        type: 'lib',
        template: `// {{name}} - Database Sync
import { supabaseAdmin } from '@/lib/db/supabase'

export interface SyncConfig {
  sourceUrl: string
  tableName: string
  batchSize?: number
}

export interface SyncResult {
  success: boolean
  inserted: number
  updated: number
  deleted: number
  errors: string[]
  duration: number
}

export async function sync(config: SyncConfig): Promise<SyncResult> {
  const startTime = Date.now()
  const errors: string[] = []
  let inserted = 0
  let updated = 0
  let deleted = 0

  try {
    // Fetch data from source
    const response = await fetch(config.sourceUrl)
    if (!response.ok) {
      throw new Error(\`Failed to fetch: \${response.status}\`)
    }

    const sourceData = await response.json()

    // Get existing data
    const { data: existingData, error: fetchError } = await supabaseAdmin
      .from(config.tableName)
      .select('*')

    if (fetchError) {
      throw new Error(\`Database fetch error: \${fetchError.message}\`)
    }

    // Create lookup map
    const existingMap = new Map(existingData?.map(item => [item.id, item]) || [])

    // Process in batches
    const batchSize = config.batchSize || 100

    for (let i = 0; i < sourceData.length; i += batchSize) {
      const batch = sourceData.slice(i, i + batchSize)

      for (const item of batch) {
        try {
          if (existingMap.has(item.id)) {
            // Update
            const { error } = await supabaseAdmin
              .from(config.tableName)
              .update(item)
              .eq('id', item.id)

            if (error) throw error
            updated++
          } else {
            // Insert
            const { error } = await supabaseAdmin
              .from(config.tableName)
              .insert(item)

            if (error) throw error
            inserted++
          }
        } catch (err: any) {
          errors.push(\`Item \${item.id}: \${err.message}\`)
        }
      }
    }

    return {
      success: errors.length === 0,
      inserted,
      updated,
      deleted,
      errors,
      duration: Date.now() - startTime,
    }
  } catch (error: any) {
    return {
      success: false,
      inserted,
      updated,
      deleted,
      errors: [...errors, error.message],
      duration: Date.now() - startTime,
    }
  }
}
`,
      },
      {
        path: 'app/api/skills/{{slug}}/route.ts',
        type: 'api',
        template: `import { NextRequest, NextResponse } from 'next/server'
import { sync } from '@/lib/{{slug}}/sync'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const config = {
      sourceUrl: body.sourceUrl || process.env.{{upperSnakeCase}}_SOURCE_URL,
      tableName: body.tableName || process.env.{{upperSnakeCase}}_TABLE_NAME,
      batchSize: body.batchSize || 100,
    }

    if (!config.sourceUrl || !config.tableName) {
      return NextResponse.json(
        { success: false, error: 'sourceUrl and tableName are required' },
        { status: 400 }
      )
    }

    const result = await sync(config)

    return NextResponse.json({
      success: result.success,
      result,
    })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
`,
      },
    ],
    variables: [
      {
        name: 'name',
        label: 'Sync Name',
        type: 'text',
        required: true,
      },
      {
        name: 'slug',
        label: 'Sync Slug',
        type: 'slug',
        required: true,
        validation: '^[a-z0-9-]+$',
      },
      {
        name: 'description',
        label: 'Description',
        type: 'text',
        required: true,
      },
      {
        name: 'version',
        label: 'Version',
        type: 'text',
        required: true,
        default: '1.0.0',
      },
    ],
  },
]

export function getTemplate(id: string): SkillTemplate | undefined {
  return SKILL_TEMPLATES.find(t => t.id === id)
}

export function getTemplatesByCategory(category?: string): SkillTemplate[] {
  if (!category) return SKILL_TEMPLATES
  return SKILL_TEMPLATES.filter(t => t.category === category)
}

export function getCategories(): string[] {
  return [...new Set(SKILL_TEMPLATES.map(t => t.category))]
}
