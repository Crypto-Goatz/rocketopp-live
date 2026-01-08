// Ignition Skill Execution Engine - Type Definitions

import { PermissionType, SkillManifest } from '../types'

// Execution options passed to the engine
export interface ExecutionOptions {
  input?: Record<string, any>
  stream?: boolean
  timeout?: number // default 5 minutes (300000ms)
}

// Progress event types for streaming
export type ProgressEventType =
  | 'start'
  | 'step'
  | 'action'
  | 'log'
  | 'complete'
  | 'error'

// Progress event sent during execution
export interface ProgressEvent {
  type: ProgressEventType
  timestamp: string

  // For 'start'
  totalSteps?: number
  skillName?: string
  executionId?: string

  // For 'step'
  stepNumber?: number
  stepName?: string

  // For 'action'
  actionId?: string
  actionType?: string
  actionName?: string
  status?: 'pending' | 'running' | 'completed' | 'failed' | 'skipped'

  // For 'log'
  level?: 'debug' | 'info' | 'warn' | 'error'
  message?: string

  // For 'complete' or 'error'
  result?: any
  error?: string
  duration?: number

  // Additional data
  data?: any
}

// Result of an action execution
export interface ActionResult {
  success: boolean
  data?: any
  error?: string
  beforeState?: any
  afterState?: any
  reversible: boolean
  metadata?: Record<string, any>
}

// Action configuration types
export type ActionType =
  | 'file:create'
  | 'file:modify'
  | 'file:delete'
  | 'file:template'
  | 'db:query'
  | 'db:insert'
  | 'db:update'
  | 'db:delete'
  | 'db:upsert'
  | 'api:call'
  | 'deploy:vercel'
  | 'ai:generate'
  | 'ai:analyze'
  | 'ai:transform'

// Base action config
export interface BaseActionConfig {
  type: ActionType
}

// File action configuration
export interface FileActionConfig extends BaseActionConfig {
  type: 'file:create' | 'file:modify' | 'file:delete' | 'file:template'
  path: string
  content?: string
  templateId?: string
  variables?: Record<string, string>
  encoding?: 'utf-8' | 'base64'
}

// Database action configuration
export interface DbActionConfig extends BaseActionConfig {
  type: 'db:query' | 'db:insert' | 'db:update' | 'db:delete' | 'db:upsert'
  table: string
  data?: Record<string, any>
  where?: Record<string, any>
  select?: string[]
  limit?: number
  orderBy?: { column: string; ascending?: boolean }
}

// API call configuration
export interface ApiActionConfig extends BaseActionConfig {
  type: 'api:call'
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  url: string
  headers?: Record<string, string>
  body?: any
  auth?: {
    type: 'bearer' | 'basic' | 'api-key'
    key: string // Reference to environment variable name
    headerName?: string // For api-key auth
  }
  timeout?: number
}

// Vercel deployment configuration
export interface DeployActionConfig extends BaseActionConfig {
  type: 'deploy:vercel'
  operation: 'create-project' | 'deploy' | 'set-env' | 'add-domain' | 'delete-project'
  projectName?: string
  projectId?: string
  framework?: 'nextjs' | 'react' | 'vue' | 'static'
  files?: Array<{ path: string; content: string }>
  envVars?: Record<string, string>
  domain?: string
  target?: 'production' | 'preview'
}

// AI action configuration
export interface AIActionConfig extends BaseActionConfig {
  type: 'ai:generate' | 'ai:analyze' | 'ai:transform'
  provider: 'anthropic' | 'openai'
  model?: string
  systemPrompt?: string
  userPrompt: string
  inputContent?: string // For analyze/transform
  outputFormat?: 'text' | 'json' | 'code'
  outputTo?: string // Context variable to store result
  maxTokens?: number
  temperature?: number
}

// Union type for all action configs
export type ActionConfig =
  | FileActionConfig
  | DbActionConfig
  | ApiActionConfig
  | DeployActionConfig
  | AIActionConfig

// Skill action definition (in manifest)
export interface SkillAction {
  id: string
  type: ActionType
  name: string
  description?: string
  requiredPermissions: PermissionType[]
  config: Omit<ActionConfig, 'type'>
  dependsOn?: string[] // Action IDs this depends on
  when?: {
    condition: string // JavaScript expression evaluated against context
  }
  retry?: {
    maxAttempts: number
    delayMs: number
    backoff?: 'linear' | 'exponential'
  }
}

// Execution context available to actions
export interface ExecutionContext {
  // Installation info
  installationId: string
  userId: string
  skillId: string
  skillSlug: string

  // Configuration
  config: Record<string, any>
  environment: Record<string, string>
  permissions: PermissionType[]

  // Manifest
  manifest: SkillManifest

  // Runtime state
  variables: Record<string, any> // Store action outputs
  input: Record<string, any>

  // Onboarding data
  onboardingData: Record<string, string>
}

// Action handler function signature
export type ActionHandler = (
  context: ExecutionContext,
  config: ActionConfig
) => Promise<ActionResult>

// Execution status for database
export type ExecutionStatus =
  | 'running'
  | 'completed'
  | 'failed'
  | 'cancelled'

// Skill execution record (for database)
export interface SkillExecution {
  id: string
  installation_id: string
  status: ExecutionStatus
  input: Record<string, any>
  output: Record<string, any>
  progress: ProgressEvent[]
  current_step: number
  total_steps: number
  error_message?: string
  started_at: string
  completed_at?: string
  duration_ms?: number
}

// Deployment record (for database)
export interface SkillDeployment {
  id: string
  execution_id: string
  user_id: string
  skill_id: string
  provider: 'vercel'
  provider_project_id?: string
  provider_deployment_id?: string
  deployment_url?: string
  custom_domain?: string
  status: 'building' | 'ready' | 'error' | 'deleted'
  name?: string
  config: Record<string, any>
  created_at: string
  updated_at: string
}
