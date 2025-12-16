/**
 * Main/Logger/config.js
 * Logging system configuration
 */

import path from 'path';
import { app } from 'electron';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Get project root path (for dev mode only)
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = path.resolve(__dirname, '../../');

// Determine if running in production mode
// app.isPackaged is true when the app is built/packaged (not running via npm start)
const isProduction = process.env.NODE_ENV === 'production' || app.isPackaged;

// Get correct logs directory based on environment
const getLogsDirectory = () => {
  if (isProduction) {
    return path.join(app.getPath('userData'), 'logs');
  }
  return path.join(projectRoot, 'logs');
};

// Default configuration
export const DEFAULT_CONFIG = {
  // File paths - logs in userData for production, project root for dev
  logDirectory: getLogsDirectory(),
  mainLogFile: 'app.log',
  ipcLogFile: 'ipc.log',
  sessionLogFile: 'session.log',

  // Backward compatibility - only for development
  legacyLogFile: path.join(projectRoot, 'debug.log'),
  useLegacyLogFile: !isProduction,

  // Structured JSON log for AI analysis - only for development
  aiLogFile: path.join(projectRoot, 'ai_debug.jsonl'),
  useAiLogFile: !isProduction,

  // Rotation settings
  maxLogSize: 10 * 1024 * 1024, // 10 MB
  maxLogFiles: 5,

  // Logging settings
  logToConsole: !isProduction,
  logToFile: true,  // Always write to logs/app.log for error diagnostics
  logToCMD: !isProduction,
  logToDevTools: !isProduction,
  minLogLevel: isProduction ? 'error' : 'trace',

  // Formatting
  colorize: true,
  includeTimestamp: true,
  
  // Integration
  captureIPC: true,
  captureUncaughtExceptions: true,
  
  // Additional metadata
  appVersion: app.getVersion(),
  appName: app.getName(),
  platform: process.platform,
  
  // Debug mode
  debug: process.env.NODE_ENV === 'development'
};

// Export main logger configuration
export const loggerConfig = DEFAULT_CONFIG; 