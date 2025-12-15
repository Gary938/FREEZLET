/**
 * Main/Logger/ipcLogger.js
 * IPC message logging module
 */

import { mainLogger } from './mainLogger.js';

/**
 * Export ipcLogger for compatibility
 */
export const ipcLogger = {
  info: (mod, msg) => mainLogger.info(`IPC:${mod}`, msg),
  warn: (mod, msg) => mainLogger.warn(`IPC:${mod}`, msg),
  error: (mod, msg) => mainLogger.error(`IPC:${mod}`, msg),
  debug: (mod, msg) => mainLogger.debug(`IPC:${mod}`, msg),
  raw: (msg) => mainLogger.debug('IPC:Raw', msg)
};

/**
 * Function to enable IPC message logging
 */
export function hijackIPCLogging() {
  if (!mainLogger.config.captureIPC) {
    mainLogger.config.captureIPC = true;
    mainLogger.info('System', 'IPC message logging enabled');
  }
} 