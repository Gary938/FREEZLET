/**
 * Main/Logger/index.js
 * Central module exporting all logging functions
 */

// Export main logger and its configuration
export { mainLogger } from './mainLogger.js';
export { loggerConfig } from './config.js';

// Export IPC logger
export { ipcLogger, hijackIPCLogging } from './ipcLogger.js';

// Export learn mode logger
export { initLearnModeLogging, resetLearnModeLogging } from './learnModeLogger.js';

// Export logging API
export {
  createApiLogger,
  logApiStart,
  logApiSuccess,
  logApiError
} from './apiLogger.js';

// Export exception handlers
export { setupExceptionHandling } from './exceptionHandler.js';

// Export formatters and utilities
export * from './formatters.js';
export * from './utils.js';
export * from './fileLogger.js'; 