// Ignition Action Registry
// Maps action types to their handlers

import {
  ActionType,
  ActionConfig,
  ActionResult,
  ActionHandler,
  ExecutionContext,
} from '../types'
import { hasPermission } from '../../permissions'
import { PermissionType } from '../../types'

/**
 * Action Registry - Central hub for action handlers
 */
class ActionRegistry {
  private handlers: Map<ActionType, ActionHandler> = new Map()
  private initialized: boolean = false

  /**
   * Register an action handler
   */
  register(actionType: ActionType, handler: ActionHandler): void {
    this.handlers.set(actionType, handler)
  }

  /**
   * Get a registered handler
   */
  get(actionType: ActionType): ActionHandler | undefined {
    return this.handlers.get(actionType)
  }

  /**
   * Check if a handler is registered
   */
  has(actionType: ActionType): boolean {
    return this.handlers.has(actionType)
  }

  /**
   * Execute an action with permission checking
   */
  async execute(
    actionType: ActionType,
    context: ExecutionContext,
    config: ActionConfig,
    requiredPermissions: PermissionType[] = []
  ): Promise<ActionResult> {
    // Check permissions first
    for (const permission of requiredPermissions) {
      const permResult = hasPermission(
        { permissions: context.permissions } as any,
        permission
      )
      if (!permResult.granted) {
        return {
          success: false,
          error: `Permission denied: ${permission} - ${permResult.reason}`,
          reversible: false,
        }
      }
    }

    // Get handler
    const handler = this.handlers.get(actionType)
    if (!handler) {
      return {
        success: false,
        error: `No handler registered for action type: ${actionType}`,
        reversible: false,
      }
    }

    // Execute handler
    try {
      const result = await handler(context, config)
      return result
    } catch (err) {
      console.error(`Error executing action ${actionType}:`, err)
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Unknown error',
        reversible: false,
      }
    }
  }

  /**
   * Get all registered action types
   */
  getRegisteredTypes(): ActionType[] {
    return Array.from(this.handlers.keys())
  }

  /**
   * Check if registry has been initialized
   */
  isInitialized(): boolean {
    return this.initialized
  }

  /**
   * Mark registry as initialized
   */
  markInitialized(): void {
    this.initialized = true
  }
}

// Singleton instance
export const actionRegistry = new ActionRegistry()

/**
 * Initialize the registry with default handlers
 * Called once when the engine starts
 */
export async function initializeRegistry(): Promise<void> {
  if (actionRegistry.isInitialized()) {
    return
  }

  // Import and register handlers
  const { fileHandler } = await import('./file')
  const { databaseHandler } = await import('./database')
  const { deploymentHandler } = await import('./deployment')
  const { aiHandler } = await import('./ai')

  // Register file handlers
  actionRegistry.register('file:create', fileHandler)
  actionRegistry.register('file:modify', fileHandler)
  actionRegistry.register('file:delete', fileHandler)
  actionRegistry.register('file:template', fileHandler)

  // Register database handlers
  actionRegistry.register('db:query', databaseHandler)
  actionRegistry.register('db:insert', databaseHandler)
  actionRegistry.register('db:update', databaseHandler)
  actionRegistry.register('db:delete', databaseHandler)
  actionRegistry.register('db:upsert', databaseHandler)

  // Register deployment handlers
  actionRegistry.register('deploy:vercel', deploymentHandler)

  // Register AI handlers
  actionRegistry.register('ai:generate', aiHandler)
  actionRegistry.register('ai:analyze', aiHandler)
  actionRegistry.register('ai:transform', aiHandler)

  actionRegistry.markInitialized()
  console.log('[Ignition] Action registry initialized with handlers:', actionRegistry.getRegisteredTypes())
}

/**
 * Helper to create a consistent error result
 */
export function createErrorResult(error: string, reversible = false): ActionResult {
  return {
    success: false,
    error,
    reversible,
  }
}

/**
 * Helper to create a consistent success result
 */
export function createSuccessResult(
  data: any,
  options: {
    beforeState?: any
    afterState?: any
    reversible?: boolean
    metadata?: Record<string, any>
  } = {}
): ActionResult {
  return {
    success: true,
    data,
    beforeState: options.beforeState,
    afterState: options.afterState,
    reversible: options.reversible ?? true,
    metadata: options.metadata,
  }
}
