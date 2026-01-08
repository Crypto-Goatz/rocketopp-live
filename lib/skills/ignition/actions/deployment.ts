// Ignition Deployment Action Handler
// Handles deploy:vercel operations

import {
  ActionConfig,
  ActionResult,
  ExecutionContext,
  DeployActionConfig,
} from '../types'
import { resolveTemplate } from '../context'
import { createErrorResult, createSuccessResult } from './registry'
import { createVercelProviderFromContext, VercelProvider } from '../providers/vercel'
import { getFilesFromStore } from './file'

/**
 * Main deployment action handler
 */
export async function deploymentHandler(
  context: ExecutionContext,
  config: ActionConfig
): Promise<ActionResult> {
  const deployConfig = config as DeployActionConfig

  if (deployConfig.type !== 'deploy:vercel') {
    return createErrorResult(`Unsupported deployment type: ${deployConfig.type}`)
  }

  // Get or create Vercel provider
  let provider: VercelProvider
  try {
    provider = createVercelProviderFromContext(context.environment)
  } catch (err) {
    return createErrorResult(
      `Failed to create Vercel provider: ${err instanceof Error ? err.message : 'Unknown error'}`
    )
  }

  const { operation } = deployConfig

  switch (operation) {
    case 'create-project':
      return handleCreateProject(provider, deployConfig, context)
    case 'deploy':
      return handleDeploy(provider, deployConfig, context)
    case 'set-env':
      return handleSetEnv(provider, deployConfig, context)
    case 'add-domain':
      return handleAddDomain(provider, deployConfig, context)
    case 'delete-project':
      return handleDeleteProject(provider, deployConfig, context)
    default:
      return createErrorResult(`Unknown Vercel operation: ${operation}`)
  }
}

/**
 * Create a new Vercel project
 */
async function handleCreateProject(
  provider: VercelProvider,
  config: DeployActionConfig,
  context: ExecutionContext
): Promise<ActionResult> {
  const projectName = config.projectName
    ? resolveTemplate(config.projectName, context)
    : null

  if (!projectName) {
    return createErrorResult('Project name is required for create-project')
  }

  // Sanitize project name (Vercel requirements)
  const sanitizedName = projectName
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 52) // Max 52 chars

  try {
    // Check if project already exists
    const existing = await provider.getProject(sanitizedName)
    if (existing) {
      // Project exists, return it
      return createSuccessResult(
        {
          projectId: existing.id,
          projectName: existing.name,
          existed: true,
        },
        {
          reversible: false,
          metadata: { operation: 'create-project', existed: true },
        }
      )
    }

    // Create new project
    const project = await provider.createProject({
      name: sanitizedName,
      framework: config.framework || 'nextjs',
    })

    return createSuccessResult(
      {
        projectId: project.id,
        projectName: project.name,
        existed: false,
      },
      {
        beforeState: null,
        afterState: project,
        reversible: true, // Can delete the project
        metadata: { operation: 'create-project' },
      }
    )
  } catch (err) {
    return createErrorResult(
      `Failed to create project: ${err instanceof Error ? err.message : 'Unknown error'}`
    )
  }
}

/**
 * Deploy files to Vercel
 */
async function handleDeploy(
  provider: VercelProvider,
  config: DeployActionConfig,
  context: ExecutionContext
): Promise<ActionResult> {
  const projectId = config.projectId
    ? resolveTemplate(config.projectId, context)
    : null

  // Also check context variables for projectId
  const resolvedProjectId = projectId || context.variables.projectId

  if (!resolvedProjectId) {
    return createErrorResult('Project ID is required for deploy')
  }

  // Get files from config or file store
  let files: Array<{ path: string; content: string; encoding?: string }> = []

  if (config.files && Array.isArray(config.files)) {
    // Files provided in config
    files = config.files.map((f) => ({
      path: resolveTemplate(f.path, context),
      content: resolveTemplate(f.content, context),
    }))
  } else {
    // Get files from the file store (created by file:create actions)
    files = getFilesFromStore(context.installationId)
  }

  if (files.length === 0) {
    return createErrorResult('No files to deploy')
  }

  try {
    // Create deployment
    const deployment = await provider.deploy({
      projectId: resolvedProjectId,
      files,
      target: config.target || 'production',
    })

    // Store deployment info in context
    context.variables.deploymentId = deployment.id
    context.variables.deploymentUrl = deployment.url

    // Wait for deployment to complete
    const completed = await provider.waitForDeployment(deployment.id)

    return createSuccessResult(
      {
        deploymentId: completed.id,
        deploymentUrl: `https://${completed.url}`,
        state: completed.state,
      },
      {
        beforeState: null,
        afterState: { deploymentId: completed.id, url: completed.url },
        reversible: false, // Deployments can't really be "undone"
        metadata: {
          operation: 'deploy',
          fileCount: files.length,
          target: config.target || 'production',
        },
      }
    )
  } catch (err) {
    return createErrorResult(
      `Deployment failed: ${err instanceof Error ? err.message : 'Unknown error'}`
    )
  }
}

/**
 * Set environment variables
 */
async function handleSetEnv(
  provider: VercelProvider,
  config: DeployActionConfig,
  context: ExecutionContext
): Promise<ActionResult> {
  const projectId = config.projectId
    ? resolveTemplate(config.projectId, context)
    : context.variables.projectId

  if (!projectId) {
    return createErrorResult('Project ID is required for set-env')
  }

  if (!config.envVars || Object.keys(config.envVars).length === 0) {
    return createErrorResult('Environment variables are required for set-env')
  }

  // Resolve templates in env values
  const resolvedEnvVars: Record<string, string> = {}
  for (const [key, value] of Object.entries(config.envVars)) {
    resolvedEnvVars[key] = resolveTemplate(value, context)
  }

  try {
    await provider.setEnvVars(projectId, resolvedEnvVars)

    return createSuccessResult(
      {
        projectId,
        envVarsSet: Object.keys(resolvedEnvVars),
      },
      {
        reversible: false, // Env vars can be changed but we don't track old values
        metadata: { operation: 'set-env', count: Object.keys(resolvedEnvVars).length },
      }
    )
  } catch (err) {
    return createErrorResult(
      `Failed to set env vars: ${err instanceof Error ? err.message : 'Unknown error'}`
    )
  }
}

/**
 * Add a custom domain
 */
async function handleAddDomain(
  provider: VercelProvider,
  config: DeployActionConfig,
  context: ExecutionContext
): Promise<ActionResult> {
  const projectId = config.projectId
    ? resolveTemplate(config.projectId, context)
    : context.variables.projectId

  if (!projectId) {
    return createErrorResult('Project ID is required for add-domain')
  }

  const domain = config.domain
    ? resolveTemplate(config.domain, context)
    : null

  if (!domain) {
    return createErrorResult('Domain is required for add-domain')
  }

  try {
    const result = await provider.addDomain(projectId, domain)

    return createSuccessResult(
      {
        projectId,
        domain: result.name,
        verified: result.verified,
      },
      {
        beforeState: null,
        afterState: result,
        reversible: true, // Can remove domain
        metadata: { operation: 'add-domain', domain },
      }
    )
  } catch (err) {
    return createErrorResult(
      `Failed to add domain: ${err instanceof Error ? err.message : 'Unknown error'}`
    )
  }
}

/**
 * Delete a project
 */
async function handleDeleteProject(
  provider: VercelProvider,
  config: DeployActionConfig,
  context: ExecutionContext
): Promise<ActionResult> {
  const projectId = config.projectId
    ? resolveTemplate(config.projectId, context)
    : context.variables.projectId

  if (!projectId) {
    return createErrorResult('Project ID is required for delete-project')
  }

  try {
    // Get project info before deleting for rollback
    const project = await provider.getProject(projectId)

    await provider.deleteProject(projectId)

    return createSuccessResult(
      {
        projectId,
        deleted: true,
      },
      {
        beforeState: project,
        afterState: null,
        reversible: false, // Deletion is permanent
        metadata: { operation: 'delete-project' },
      }
    )
  } catch (err) {
    return createErrorResult(
      `Failed to delete project: ${err instanceof Error ? err.message : 'Unknown error'}`
    )
  }
}
