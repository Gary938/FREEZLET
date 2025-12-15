/**
 * Logging module for business layer
 * @module Logger/businessLogger
 */

import { mainLogger } from '../loggerHub.js';

/**
 * Creates and returns logger for business layer
 * @param {string} moduleName - Module name for logging
 * @returns {Object} - Logger object
 */
export function getBusinessLogger(moduleName) {
  return {
    debug: (message, data) => mainLogger.debug(`[${moduleName}] ${message}`, data),
    info: (message, data) => mainLogger.info(`[${moduleName}] ${message}`, data),
    warn: (message, data) => mainLogger.warn(`[${moduleName}] ${message}`, data),
    error: (message, data, error) => {
      if (error) {
        mainLogger.error(`[${moduleName}] ${message}`, { ...data, error: error.message, stack: error.stack });
      } else {
        mainLogger.error(`[${moduleName}] ${message}`, data);
      }
    },
    success: (message, data) => mainLogger.success(`[${moduleName}] ${message}`, data)
  };
}

export default {
  getBusinessLogger
}; 