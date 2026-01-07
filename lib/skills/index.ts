// Skill System - Main Export
// Re-exports all skill functionality

// Types
export * from './types'

// Permissions
export {
  PERMISSION_CATEGORIES,
  PERMISSION_DESCRIPTIONS,
  PERMISSION_RISK_LEVELS,
  matchesPermission,
  hasPermission,
  hasAllPermissions,
  canAccessTable,
  canAccessEnv,
  canAccessFile,
  getPermissionDescription,
  getPermissionRiskLevel,
  groupPermissionsByCategory,
  calculateOverallRisk,
  validatePermissions,
} from './permissions'

// Parser
export {
  parseManifest,
  parseManifestFromUrl,
  validateManifest,
  getRequiredPermissions,
  getRequiredOnboarding,
  hasHighRiskPermissions,
  generateDefaultManifest,
  serializeManifest,
} from './parser'

// Logger
export {
  logAction,
  logFileCreate,
  logFileModify,
  logFileDelete,
  logDbInsert,
  logDbUpdate,
  logDbDelete,
  logApiCall,
  logEnvSet,
  logConfigChange,
  logInstall,
  logUninstall,
  logExecute,
  getLogs,
  getLog,
  countLogs,
  createSkillLogger,
} from './logger'

// Rollback
export {
  revertLog,
  revertMultipleLogs,
  revertAllForInstallation,
  getRevertibleLogs,
  canRevert,
} from './rollback'

// Runtime
export {
  installSkill,
  installSkillFromUrl,
  uninstallSkill,
  buildContext,
  executeSkill,
  pauseSkill,
  resumeSkill,
  updateSkillConfig,
  updateSkillEnvironment,
  getUserSkills,
  getMarketplaceSkills,
  getSkill,
  getSkillCategories,
  skillRequiresOnboarding,
  getOnboardingStatus,
  saveOnboardingData,
} from './runtime'
