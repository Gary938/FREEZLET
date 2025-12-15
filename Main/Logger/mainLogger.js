/**
 * Main/Logger/mainLogger.js
 * Main logging class
 */

import { getFormattedTime, formatLogMessage, formatForCMD } from './formatters.js';
import { writeToLogFile, writeToLogFiles } from './fileLogger.js';
import { safeStringify } from './utils.js';
import { loggerConfig } from './config.js';
import { BrowserWindow } from 'electron';

// Sequence counter for logs
let sequenceId = 0;

/**
 * Sends log message to DevTools console
 * @param {string} level - Message level (info, warn, error)
 * @param {string} module - Module name
 * @param {string} message - Message to log
 * @param {any} data - Additional data
 */
function sendToDevTools(level, module, message, data) {
  try {
    // Send only errors and warnings to DevTools
    if (level !== 'error' && level !== 'warn') {
      return;
    }
    
    // Get all open windows
    const allWindows = BrowserWindow.getAllWindows();
    
    if (allWindows.length === 0) {
      console.warn(`[sendToDevTools] No windows found to send logs to DevTools: ${level} ${module} ${message}`);
      return;
    }
    
    // Take first window or active window
    const win = BrowserWindow.getFocusedWindow() || allWindows[0];
    
    // Check that window exists and has webContents
    if (!win || !win.webContents) {
      console.warn(`[sendToDevTools] Window or webContents unavailable`);
      return;
    }
    
    // Check that webContents is ready
    if (win.webContents.isDestroyed() || !win.webContents.isLoadingMainFrame()) {
      console.warn(`[sendToDevTools] webContents not ready or destroyed`);
      // But still try to send
    }
    
    const content = {
      level,
      module,
      message,
      data: data || null,
      timestamp: new Date().toISOString()
    };
    
    // Console method depending on level
    let consoleMethod = 'log';
    if (level === 'warn') consoleMethod = 'warn';
    if (level === 'error') consoleMethod = 'error';
    if (level === 'success') consoleMethod = 'log'; // Success will use regular log
    
    // Prepare safe string for JS
    const safeMessage = (message || '').toString().replace(/'/g, "\\'").replace(/\n/g, "\\n");
    
    // Create level indicator
    let prefix = '🔵';
    if (level === 'warn') prefix = '⚠️';
    if (level === 'error') prefix = '❌';
    if (level === 'success') prefix = '✅'; // Green checkmark for successful operations
    if (level === 'debug') prefix = '🔍'; // Magnifying glass for debug messages
    
    // Create unique log ID
    const logId = Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
    
    // JS to execute in renderer context
    const js = `
      try {
        console.${consoleMethod}(
          '${prefix} [${level.toUpperCase()}] [${module}] (${logId})', 
          '${safeMessage}', 
          ${safeStringify(content)}
        );
        true; // signal successful execution for promise
      } catch (err) {
        console.error('DevTools logging error:', err);
        false; // signal error for promise
      }
    `;
    
    // Run JS in window context
    win.webContents.executeJavaScript(js)
      .then(success => {
        if (!success) {
          console.warn(`[sendToDevTools] Failed to execute JS in webContents`);
        }
      })
      .catch(err => {
        console.error(`[sendToDevTools] executeJavaScript error:`, err);
      });
  } catch (err) {
    console.error('[sendToDevTools] Error:', err);
  }
}

/**
 * Main logger
 */
export const mainLogger = {
  config: loggerConfig,
  
  /**
   * Initialize logger with custom settings
   */
  init: (customConfig) => {
    if (customConfig) {
      // Merge custom settings with default settings
      Object.assign(mainLogger.config, customConfig);
      console.log('Logger initialized with custom settings');
    }
    return mainLogger;
  },
  
  /**
   * Information message
   */
  info: (module, message, data) => {
    const formattedMessage = formatLogMessage('INFO', module, message);
    
    // Use colored output for CMD if enabled
    if (loggerConfig.logToCMD && loggerConfig.colorize) {
      console.log(formatForCMD('info', module, message, data));
    } else {
      console.log(formattedMessage);
    }
    
    // Write to standard file for backward compatibility
    writeToLogFile(formattedMessage);
    
    // Write to all log files (including ai_debug.jsonl)
    writeToLogFiles('info', module, message, data, loggerConfig, sequenceId++);
    
    // Don't send info messages to DevTools
    // Send logic moved to sendToDevTools function
  },
  
  /**
   * Warning
   */
  warn: (module, message, data) => {
    const formattedMessage = formatLogMessage('WARN', module, message);
    
    // Use colored output for CMD if enabled
    if (loggerConfig.logToCMD && loggerConfig.colorize) {
      console.warn(formatForCMD('warn', module, message, data));
    } else {
      console.warn(formattedMessage);
    }
    
    // Write to standard file for backward compatibility
    writeToLogFile(formattedMessage);
    
    // Write to all log files (including ai_debug.jsonl)
    writeToLogFiles('warn', module, message, data, loggerConfig, sequenceId++);
    
    // Send warning to DevTools
    if (loggerConfig.logToDevTools) {
      sendToDevTools('warn', module, message, data);
    }
  },
  
  /**
   * Error message
   */
  error: (module, message, data) => {
    const formattedMessage = formatLogMessage('ERROR', module, message);
    
    // Use colored output for CMD if enabled
    if (loggerConfig.logToCMD && loggerConfig.colorize) {
      console.error(formatForCMD('error', module, message, data));
    } else {
      console.error(formattedMessage);
    }
    
    // Write to standard file for backward compatibility
    writeToLogFile(formattedMessage);
    
    // Write to all log files (including ai_debug.jsonl)
    writeToLogFiles('error', module, message, data, loggerConfig, sequenceId++);
    
    // Send error to DevTools
    if (loggerConfig.logToDevTools) {
      sendToDevTools('error', module, message, data);
    }
  },
  
  /**
   * Debug message
   */
  debug: (module, message, data) => {
    // Remove logger.debug check so logs are always displayed
    const formattedMessage = formatLogMessage('DEBUG', module, message);
    
    // Use colored output for CMD if enabled
    if (loggerConfig.logToCMD && loggerConfig.colorize) {
      console.debug(formatForCMD('debug', module, message, data));
    } else {
      console.debug(formattedMessage);
    }
    
    // Write to standard file for backward compatibility
    writeToLogFile(formattedMessage);
    
    // Write to all log files (including ai_debug.jsonl)
    writeToLogFiles('debug', module, message, data, loggerConfig, sequenceId++);
    
    // Don't send debug messages to DevTools
    // Send logic moved to sendToDevTools function
  },
  
  /**
   * Log successful operations
   */
  success: (module, message, data) => {
    const formattedMessage = formatLogMessage('SUCCESS', module, `✓ ${message}`);
    
    // Use colored output for CMD if enabled
    if (loggerConfig.logToCMD && loggerConfig.colorize) {
      console.log(formatForCMD('success', module, `✓ ${message}`, data));
    } else {
      console.log(formattedMessage);
    }
    
    // Write to standard file for backward compatibility
    writeToLogFile(formattedMessage);
    
    // Write to all log files (including ai_debug.jsonl)
    writeToLogFiles('success', module, message, data, loggerConfig, sequenceId++);
    
    // Remove sending success messages to DevTools
    // Send logic moved to sendToDevTools function
  },
  
  /**
   * Operation tracing (for Core architecture)
   */
  trace: (module, message, data) => {
    const formattedMessage = formatLogMessage('TRACE', module, message);
    
    // Use colored output for CMD if enabled
    if (loggerConfig.logToCMD && loggerConfig.colorize) {
      console.debug(formatForCMD('trace', module, message, data));
    } else {
      console.debug(formattedMessage);
    }
    
    // Write to standard file for backward compatibility
    writeToLogFile(formattedMessage);
    
    // Write to all log files (including ai_debug.jsonl)
    writeToLogFiles('trace', module, message, data, loggerConfig, sequenceId++);
    
    // Don't send trace messages to DevTools (too frequent)
  },
  
  /**
   * Smart logging with auto type detection
   */
  smart: (moduleOrMessage, messageOrNull = null, data = null) => {
    if (messageOrNull === null) {
      mainLogger.info('System', moduleOrMessage, data);
    } else {
      mainLogger.info(moduleOrMessage, messageOrNull, data);
    }
  },
  
  /**
   * Method for logging component readiness/initialization
   * Added for backward compatibility with old code
   */
  ready: (message, data) => {
    const formattedMessage = formatLogMessage('READY', 'System', message);
    
    // Use colored output for CMD if enabled
    if (loggerConfig.logToCMD && loggerConfig.colorize) {
      console.log(formatForCMD('ready', 'System', message, data));
    } else {
      console.log(formattedMessage);
    }
    
    // Write to standard file for backward compatibility
    writeToLogFile(formattedMessage);
    
    // Write to all log files (including ai_debug.jsonl)
    writeToLogFiles('ready', 'System', message, data, loggerConfig, sequenceId++);
  },
  
  /**
   * Directory logging
   * Added for compatibility
   */
  directory: (dirName) => {
    const message = `Modules loaded from directory ${dirName}`;
    const formattedMessage = formatLogMessage('INFO', 'System', message);

    // Use colored output for CMD if enabled
    if (loggerConfig.logToCMD && loggerConfig.colorize) {
      console.log(formatForCMD('info', 'System', message));
    } else {
      console.log(formattedMessage);
    }

    // Write to standard file for backward compatibility
    writeToLogFile(formattedMessage);

    // Write to all log files (including ai_debug.jsonl)
    writeToLogFiles('info', 'System', message, null, loggerConfig, sequenceId++);
  }
};

// Compatibility with old calls
export const logger = mainLogger;
export const logSmart = mainLogger.smart;

// ipcLogger is now exported only from ipcLogger.js (removed duplication) 