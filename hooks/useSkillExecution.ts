'use client'

import { useState, useCallback, useRef } from 'react'

// Progress event types (mirrored from server)
export interface ProgressEvent {
  type: 'start' | 'step' | 'action' | 'log' | 'complete' | 'error'
  timestamp: string
  totalSteps?: number
  skillName?: string
  executionId?: string
  stepNumber?: number
  stepName?: string
  actionId?: string
  actionType?: string
  actionName?: string
  status?: 'pending' | 'running' | 'completed' | 'failed' | 'skipped'
  level?: 'debug' | 'info' | 'warn' | 'error'
  message?: string
  result?: any
  error?: string
  duration?: number
  data?: any
}

export interface SkillExecutionResult {
  success: boolean
  data?: any
  error?: string
  duration: number
}

export type ExecutionStatus = 'idle' | 'running' | 'completed' | 'error'

interface UseSkillExecutionOptions {
  onProgress?: (event: ProgressEvent) => void
  onComplete?: (result: SkillExecutionResult) => void
  onError?: (error: string) => void
}

interface UseSkillExecutionReturn {
  execute: (input?: Record<string, any>) => Promise<void>
  abort: () => void
  status: ExecutionStatus
  progress: ProgressEvent[]
  result: SkillExecutionResult | null
  currentStep: number
  totalSteps: number
  isRunning: boolean
  error: string | null
}

/**
 * Hook for executing skills with real-time progress updates
 */
export function useSkillExecution(
  installationId: string,
  options: UseSkillExecutionOptions = {}
): UseSkillExecutionReturn {
  const [status, setStatus] = useState<ExecutionStatus>('idle')
  const [progress, setProgress] = useState<ProgressEvent[]>([])
  const [result, setResult] = useState<SkillExecutionResult | null>(null)
  const [currentStep, setCurrentStep] = useState(0)
  const [totalSteps, setTotalSteps] = useState(0)
  const [error, setError] = useState<string | null>(null)

  const eventSourceRef = useRef<EventSource | null>(null)
  const abortedRef = useRef(false)

  const abort = useCallback(() => {
    abortedRef.current = true
    if (eventSourceRef.current) {
      eventSourceRef.current.close()
      eventSourceRef.current = null
    }
    setStatus('idle')
  }, [])

  const execute = useCallback(
    async (input?: Record<string, any>) => {
      // Reset state
      abortedRef.current = false
      setStatus('running')
      setProgress([])
      setResult(null)
      setCurrentStep(0)
      setTotalSteps(0)
      setError(null)

      // Build URL with input
      const url = `/api/skills/${installationId}/execute/stream${
        input ? `?input=${encodeURIComponent(JSON.stringify(input))}` : ''
      }`

      // Create EventSource for SSE
      const eventSource = new EventSource(url)
      eventSourceRef.current = eventSource

      eventSource.onmessage = (event) => {
        if (abortedRef.current) {
          eventSource.close()
          return
        }

        try {
          const data: ProgressEvent = JSON.parse(event.data)

          // Add to progress array
          setProgress((prev) => [...prev, data])

          // Call progress callback
          options.onProgress?.(data)

          // Handle specific event types
          switch (data.type) {
            case 'start':
              if (data.totalSteps) setTotalSteps(data.totalSteps)
              break

            case 'step':
              if (data.stepNumber) setCurrentStep(data.stepNumber)
              break

            case 'complete':
              setStatus('completed')
              const successResult: SkillExecutionResult = {
                success: true,
                data: data.result,
                duration: data.duration || 0,
              }
              setResult(successResult)
              options.onComplete?.(successResult)
              eventSource.close()
              break

            case 'error':
              setStatus('error')
              setError(data.error || 'Unknown error')
              const errorResult: SkillExecutionResult = {
                success: false,
                error: data.error,
                duration: data.duration || 0,
              }
              setResult(errorResult)
              options.onError?.(data.error || 'Unknown error')
              eventSource.close()
              break
          }
        } catch (err) {
          console.error('Error parsing SSE event:', err)
        }
      }

      eventSource.onerror = (err) => {
        console.error('SSE connection error:', err)

        if (!abortedRef.current && status === 'running') {
          setStatus('error')
          setError('Connection lost')
          options.onError?.('Connection lost')
        }

        eventSource.close()
        eventSourceRef.current = null
      }

      // Clean up on unmount handled by the effect in the component
    },
    [installationId, options, status]
  )

  return {
    execute,
    abort,
    status,
    progress,
    result,
    currentStep,
    totalSteps,
    isRunning: status === 'running',
    error,
  }
}

/**
 * Non-streaming execution (simpler, for quick operations)
 */
export async function executeSkill(
  installationId: string,
  input?: Record<string, any>
): Promise<SkillExecutionResult> {
  const response = await fetch(`/api/skills/${installationId}/execute`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ input }),
  })

  const data = await response.json()

  if (!response.ok) {
    return {
      success: false,
      error: data.error || 'Execution failed',
      duration: 0,
    }
  }

  return {
    success: data.success,
    data: data.data,
    error: data.error,
    duration: data.duration || 0,
  }
}
