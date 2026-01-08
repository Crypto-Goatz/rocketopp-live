// Ignition Skill Execution Engine
// The core runtime that executes skills

import { supabaseAdmin } from '@/lib/db/supabase'
import { createSkillLogger, logExecute } from '../logger'
import { buildExecutionContext, evaluateCondition, setContextVariable } from './context'
import { actionRegistry, initializeRegistry, clearFileStore } from './actions'
import {
  ExecutionOptions,
  ExecutionContext,
  ProgressEvent,
  SkillAction,
  ActionResult,
  ActionConfig,
  ExecutionStatus,
} from './types'
import { SkillExecutionResult } from '../types'

/**
 * Ignition Engine - Executes skills with real actions
 */
export class IgnitionEngine {
  private progressListeners: Set<(event: ProgressEvent) => void> = new Set()
  private executionId: string | null = null
  private aborted: boolean = false

  /**
   * Subscribe to progress events
   */
  onProgress(listener: (event: ProgressEvent) => void): () => void {
    this.progressListeners.add(listener)
    return () => this.progressListeners.delete(listener)
  }

  /**
   * Emit a progress event to all listeners
   */
  private emit(event: Omit<ProgressEvent, 'timestamp'>): void {
    const fullEvent: ProgressEvent = {
      ...event,
      timestamp: new Date().toISOString(),
    }

    for (const listener of this.progressListeners) {
      try {
        listener(fullEvent)
      } catch (err) {
        console.error('Error in progress listener:', err)
      }
    }

    // Also store in database if we have an execution ID
    if (this.executionId) {
      this.storeProgressEvent(fullEvent).catch(console.error)
    }
  }

  /**
   * Store progress event in database
   */
  private async storeProgressEvent(event: ProgressEvent): Promise<void> {
    if (!this.executionId) return

    try {
      // Append to progress array
      const { data: execution } = await supabaseAdmin
        .from('skill_executions')
        .select('progress')
        .eq('id', this.executionId)
        .single()

      const progress = execution?.progress || []
      progress.push(event)

      await supabaseAdmin
        .from('skill_executions')
        .update({
          progress,
          current_step: event.stepNumber || 0,
        })
        .eq('id', this.executionId)
    } catch (err) {
      // Non-critical, just log
      console.error('Failed to store progress event:', err)
    }
  }

  /**
   * Abort the current execution
   */
  abort(): void {
    this.aborted = true
  }

  /**
   * Execute a skill
   */
  async execute(
    installationId: string,
    options: ExecutionOptions = {}
  ): Promise<SkillExecutionResult> {
    const startTime = Date.now()
    this.aborted = false

    try {
      // Initialize registry if needed
      await initializeRegistry()

      // Build execution context
      const contextResult = await buildExecutionContext({
        installationId,
        input: options.input,
      })

      if (!contextResult.success || !contextResult.context) {
        return {
          success: false,
          error: contextResult.error || 'Failed to build context',
          logs: [],
          duration: Date.now() - startTime,
        }
      }

      const context = contextResult.context

      // Create execution record
      const { data: executionRecord } = await supabaseAdmin
        .from('skill_executions')
        .insert({
          installation_id: installationId,
          status: 'running' as ExecutionStatus,
          input: options.input || {},
          progress: [],
          current_step: 0,
          total_steps: 0,
        })
        .select()
        .single()

      this.executionId = executionRecord?.id || null

      // Get actions from manifest
      const actions = this.parseActions(context)
      const totalSteps = actions.length

      // Update total steps
      if (this.executionId) {
        await supabaseAdmin
          .from('skill_executions')
          .update({ total_steps: totalSteps })
          .eq('id', this.executionId)
      }

      // Emit start event
      this.emit({
        type: 'start',
        totalSteps,
        skillName: context.manifest.name,
        executionId: this.executionId || undefined,
      })

      // Create logger
      const logger = createSkillLogger(installationId)

      // Execute actions in order (respecting dependencies)
      const results: Map<string, ActionResult> = new Map()
      const executed: Set<string> = new Set()

      for (let i = 0; i < actions.length; i++) {
        if (this.aborted) {
          this.emit({ type: 'error', error: 'Execution aborted' })
          throw new Error('Execution aborted')
        }

        const action = actions[i]

        // Check dependencies
        if (action.dependsOn) {
          const unmetDeps = action.dependsOn.filter((dep) => !executed.has(dep))
          if (unmetDeps.length > 0) {
            // Skip for now, will be picked up later
            continue
          }
        }

        // Check condition
        if (action.when?.condition) {
          const shouldRun = evaluateCondition(action.when.condition, context)
          if (!shouldRun) {
            this.emit({
              type: 'action',
              actionId: action.id,
              actionType: action.type,
              actionName: action.name,
              status: 'skipped',
              message: 'Condition not met',
            })
            executed.add(action.id)
            continue
          }
        }

        // Emit step event
        this.emit({
          type: 'step',
          stepNumber: i + 1,
          stepName: action.name,
        })

        // Emit action starting
        this.emit({
          type: 'action',
          actionId: action.id,
          actionType: action.type,
          actionName: action.name,
          status: 'running',
        })

        // Execute action
        const actionConfig: ActionConfig = {
          type: action.type,
          ...action.config,
        } as ActionConfig

        const result = await actionRegistry.execute(
          action.type,
          context,
          actionConfig,
          action.requiredPermissions
        )

        results.set(action.id, result)
        executed.add(action.id)

        // Store result in context variables if configured
        if (result.success && result.data) {
          setContextVariable(context, action.id, result.data)
          // Also store under action.config.outputTo if specified
          const outputTo = (action.config as any).outputTo
          if (outputTo) {
            setContextVariable(context, outputTo, result.data)
          }
        }

        // Log the action
        await logger.log({
          action: action.type.replace(':', '_') as any,
          target: action.id,
          beforeState: result.beforeState,
          afterState: result.afterState,
          metadata: { actionName: action.name, ...result.metadata },
          reversible: result.reversible,
        })

        // Emit action result
        this.emit({
          type: 'action',
          actionId: action.id,
          actionType: action.type,
          actionName: action.name,
          status: result.success ? 'completed' : 'failed',
          data: result.success ? result.data : undefined,
          error: result.error,
        })

        if (!result.success) {
          // Action failed - decide whether to continue or abort
          this.emit({
            type: 'log',
            level: 'error',
            message: `Action ${action.name} failed: ${result.error}`,
          })

          // For now, abort on first failure
          throw new Error(`Action ${action.name} failed: ${result.error}`)
        }
      }

      // Update last_run timestamp on installation
      await supabaseAdmin
        .from('skill_installations')
        .update({ last_run: new Date().toISOString() })
        .eq('id', installationId)

      const duration = Date.now() - startTime

      // Build output from results
      const output: Record<string, any> = {}
      for (const [actionId, result] of results.entries()) {
        if (result.success && result.data) {
          output[actionId] = result.data
        }
      }

      // Update execution record
      if (this.executionId) {
        await supabaseAdmin
          .from('skill_executions')
          .update({
            status: 'completed' as ExecutionStatus,
            output,
            completed_at: new Date().toISOString(),
            duration_ms: duration,
          })
          .eq('id', this.executionId)
      }

      // Log execution
      await logExecute(
        installationId,
        context.skillSlug,
        options.input,
        output,
        duration
      )

      // Emit complete event
      this.emit({
        type: 'complete',
        result: output,
        duration,
      })

      // Clean up file store
      clearFileStore(installationId)

      return {
        success: true,
        data: output,
        logs: [],
        duration,
      }
    } catch (err) {
      const duration = Date.now() - startTime
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'

      // Update execution record
      if (this.executionId) {
        await supabaseAdmin
          .from('skill_executions')
          .update({
            status: 'failed' as ExecutionStatus,
            error_message: errorMessage,
            completed_at: new Date().toISOString(),
            duration_ms: duration,
          })
          .eq('id', this.executionId)
      }

      // Update installation status
      await supabaseAdmin
        .from('skill_installations')
        .update({
          status: 'error',
          error_message: errorMessage,
        })
        .eq('id', installationId)

      this.emit({
        type: 'error',
        error: errorMessage,
        duration,
      })

      return {
        success: false,
        error: errorMessage,
        logs: [],
        duration,
      }
    }
  }

  /**
   * Execute with streaming (async generator)
   */
  async *executeWithStream(
    installationId: string,
    options: ExecutionOptions = {}
  ): AsyncGenerator<ProgressEvent, SkillExecutionResult> {
    const events: ProgressEvent[] = []
    let resolveNext: ((event: ProgressEvent) => void) | null = null
    let done = false
    let finalResult: SkillExecutionResult | null = null

    // Set up listener to capture events
    const unsubscribe = this.onProgress((event) => {
      if (resolveNext) {
        resolveNext(event)
        resolveNext = null
      } else {
        events.push(event)
      }

      if (event.type === 'complete' || event.type === 'error') {
        done = true
      }
    })

    // Start execution in background
    const executionPromise = this.execute(installationId, options).then(
      (result) => {
        finalResult = result
        done = true
      }
    )

    // Yield events as they come
    try {
      while (!done) {
        if (events.length > 0) {
          yield events.shift()!
        } else {
          // Wait for next event
          const event = await new Promise<ProgressEvent>((resolve) => {
            resolveNext = resolve
            // Timeout to check done status
            setTimeout(() => {
              if (done && resolveNext) {
                resolveNext = null
              }
            }, 100)
          })
          yield event
        }
      }

      // Yield any remaining events
      while (events.length > 0) {
        yield events.shift()!
      }
    } finally {
      unsubscribe()
    }

    // Wait for execution to complete
    await executionPromise

    return finalResult || {
      success: false,
      error: 'Execution did not complete',
      logs: [],
      duration: 0,
    }
  }

  /**
   * Parse actions from manifest
   */
  private parseActions(context: ExecutionContext): SkillAction[] {
    const manifest = context.manifest

    // Check if manifest has actions defined
    if ((manifest as any).actions && Array.isArray((manifest as any).actions)) {
      return (manifest as any).actions as SkillAction[]
    }

    // If no explicit actions, create a default "execute" action
    // This maintains compatibility with simpler skills
    return []
  }
}

/**
 * Create a new Ignition engine instance
 */
export function createIgnitionEngine(): IgnitionEngine {
  return new IgnitionEngine()
}
