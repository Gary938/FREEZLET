/**
 * Main/Logger/apiLogger.js
 * Helper functions for API logging
 */

import { mainLogger } from './mainLogger.js';

/**
 * Creates logger with prefix for API
 * @param {string} apiName - API module name
 * @returns {Object} - Logger object
 */
export function createApiLogger(apiName) {
  return {
    info: (message) => mainLogger.info(`API:${apiName}`, message),
    warn: (message) => mainLogger.warn(`API:${apiName}`, message),
    error: (message, error) => mainLogger.error(`API:${apiName}`, `${message}: ${error?.message || 'Unknown error'}`),
    debug: (message) => mainLogger.debug(`API:${apiName}`, message),
    success: (message) => mainLogger.info(`API:${apiName}`, `✓ ${message}`)
  };
}

/**
 * Logs API operation start
 * @param {Object} logger - API logger
 * @param {string} operation - Operation name
 * @param {Object} params - Operation parameters
 */
export function logApiStart(logger, operation, params) {
  logger.info(`Starting operation ${operation} with params: ${JSON.stringify(params)}`);
}

/**
 * Logs successful API operation completion
 * @param {Object} logger - API logger
 * @param {string} operation - Operation name
 */
export function logApiSuccess(logger, operation) {
  logger.success(`Operation ${operation} completed successfully`);
}

/**
 * Logs API operation error
 * @param {Object} logger - API logger
 * @param {string} operation - Operation name
 * @param {Error} error - Error object
 */
export function logApiError(logger, operation, error) {
  logger.error(`Operation ${operation} error`, error);
} 