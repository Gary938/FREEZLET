/**
 * Logging service for UI layer
 * Provides a unified logging interface for all UI components
 * with log forwarding to Main process via preload API
 * @module UI/Utils/loggerService
 */

/**
 * Creates a logger for UI component
 * @param {string} namespace - Module/component name for logging
 * @returns {Object} Object with logging methods
 */
export function createLogger(namespace) {
  return {
    debug: (message, data) => logToMain('debug', namespace, message, data),
    info: (message, data) => logToMain('info', namespace, message, data),
    warn: (message, data) => logToMain('warn', namespace, message, data, true),
    error: (message, data) => logToMain('error', namespace, message, data, true),
    success: (message, data) => logToMain('success', namespace, message, data)
  };
}

/**
 * Safe object serialization for IPC transfer
 * Removes functions, circular references and other non-serializable types
 * @param {any} data - Data to serialize
 * @returns {any} - Safely serializable data
 */
function makeSerializable(data) {
  if (data === null || data === undefined) {
    return data;
  }

  // If primitive type, return as is
  if (typeof data !== 'object' && typeof data !== 'function') {
    return data;
  }

  // If function, replace with string
  if (typeof data === 'function') {
    return '[Function]';
  }

  // If Date, convert to ISO string
  if (data instanceof Date) {
    return data.toISOString();
  }

  // If Error, extract main information
  if (data instanceof Error) {
    return {
      name: data.name,
      message: data.message,
      stack: data.stack
    };
  }

  // If DOM element, replace with its description
  if (data instanceof HTMLElement) {
    return `[HTMLElement: ${data.tagName}${data.id ? '#' + data.id : ''}${data.className ? '.' + data.className.replace(/\s+/g, '.') : ''}]`;
  }

  try {
    // Try to validate via JSON
    const str = JSON.stringify(data);
    return JSON.parse(str);
  } catch (e) {
    // If serialization failed, create new object
    if (Array.isArray(data)) {
      return data.map(item => {
        try {
          return makeSerializable(item);
        } catch {
          return '[Non-serializable object]';
        }
      });
    } else {
      const result = {};
      // Copy only serializable properties
      for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
          try {
            result[key] = makeSerializable(data[key]);
          } catch {
            result[key] = '[Non-serializable value]';
          }
        }
      }
      return result;
    }
  }
}

/**
 * Sends log to Main process
 * @param {string} level - Log level (debug, info, warn, error, success)
 * @param {string} namespace - Module/component name
 * @param {string} message - Log message
 * @param {any} data - Additional log data
 * @param {boolean} logToConsole - Flag whether to duplicate log to browser console
 */
function logToMain(level, namespace, message, data, logToConsole = false) {
  // Log to browser console only for errors and warnings
  if (logToConsole) {
    if (level === 'error') {
      console.error(`[${namespace}] ${message}`, data || '');
    } else if (level === 'warn') {
      console.warn(`[${namespace}] ${message}`, data || '');
    }
  }
  
  // Send log to Main process via preload API
  try {
    if (window.electron && window.electron.logger) {
      // Convert data to serializable format
      const safeData = data ? makeSerializable(data) : undefined;
      window.electron.logger.log(level, namespace, message, safeData);
    } else {
      // Fallback: if preload API unavailable, log to browser console
      const consoleMethod = level === 'error' ? 'error' : level === 'warn' ? 'warn' : 'log';
      console[consoleMethod](`[${level.toUpperCase()}] [${namespace}] ${message}`, data || '');
    }
  } catch (error) {
    // On error sending to Main process, log to console
    console.error(`Error sending log to Main process: ${error.message}`);
  }
}

/**
 * Formatted logger for displaying UI errors
 * @param {Error} error - Error object
 * @param {string} context - Context where error occurred
 * @param {string} namespace - Module/component name
 */
export function logUIError(error, context, namespace) {
  const logger = createLogger(namespace || 'UI/Error');
  const message = `Error in ${context}: ${error.message}`;
  logger.error(message, {
    stack: error.stack,
    context,
    timestamp: new Date().toISOString()
  });
}

export default {
  createLogger,
  logUIError
}; 