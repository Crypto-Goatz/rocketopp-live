// Ignition Skill Execution Engine - Main Exports

// Core engine
export { IgnitionEngine, createIgnitionEngine } from './engine'

// Context utilities
export {
  buildExecutionContext,
  resolveTemplate,
  resolveObjectTemplates,
  evaluateCondition,
  setContextVariable,
  getContextVariable,
} from './context'

// Action system
export {
  actionRegistry,
  initializeRegistry,
  createErrorResult,
  createSuccessResult,
  fileHandler,
  databaseHandler,
  clearFileStore,
  getFilesFromStore,
  getAvailableTemplates,
} from './actions'

// Types
export type {
  ExecutionOptions,
  ProgressEvent,
  ProgressEventType,
  ActionResult,
  ActionType,
  ActionConfig,
  ActionHandler,
  FileActionConfig,
  DbActionConfig,
  ApiActionConfig,
  DeployActionConfig,
  AIActionConfig,
  SkillAction,
  ExecutionContext,
  ExecutionStatus,
  SkillExecution,
  SkillDeployment,
} from './types'
