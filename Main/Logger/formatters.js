/**
 * Main/Logger/formatters.js
 * Format and output logs to various sources
 */

import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import { safeStringify } from './utils.js';

/**
 * Get color for module
 */
export function getColorByModule(mod) {
  if (!mod) return chalk.cyan;
  if (mod.startsWith('Main/')) return chalk.greenBright;
  if (mod.startsWith('FileManager/')) {
    const segments = mod.split('/');
    if (segments.length === 2) return chalk.hex('#d291ff');
    return chalk.hex('#b266ff');
  }
  if (mod.startsWith('UI/')) return chalk.hex('#ffc400');
  if (mod.startsWith('Renderer/')) return chalk.white;
  if (mod.startsWith('testRunner/')) return chalk.whiteBright;
  return chalk.cyan;
}

/**
 * Write logs to command line
 */
export function formatForCMD(level, mod, msg, data) {
  const color = getColorByModule(mod);
  let tag = `[${level.toUpperCase()}]`;
  const module = mod ? `[${mod}]` : '';
  
  // Color formatting for level tag
  switch (level) {
    case 'error':
      tag = chalk.red.bold(tag);
      break;
    case 'warn':
      tag = chalk.yellow(tag);
      break;
    case 'info':
      tag = chalk.blue(tag);
      break;
    case 'debug':
      tag = chalk.gray(tag);
      break;
    case 'ready':
      tag = chalk.green.bold(tag);
      break;
    case 'success':
      tag = chalk.greenBright(tag);
      break;
    case 'trace':
      tag = chalk.magenta(tag);
      break;
    default:
      tag = chalk.blueBright(tag);
  }
  
  const timestamp = chalk.gray(new Date().toISOString());
  const formattedMsg = `${timestamp} ${tag} ${color(module)} ${msg}`;
  
  let result = formattedMsg;
  
  if (data) {
    const dataStr = typeof data === 'string' ? data : safeStringify(data);
    result += '\n' + chalk.gray(dataStr);
  }
  
  return result;
}

/**
 * Formatting for log file
 */
export function formatForFile(level, mod, msg, data, includeTimestamp) {
  const timestamp = new Date().toISOString();
  const module = mod ? `[${mod}]` : '';
  
  if (typeof data !== 'undefined') {
    const safeData = typeof data === 'string' ? data : safeStringify(data);
    const logEntry = {
      timestamp,
      level,
      module: mod,
      message: msg,
      data: safeData
    };
    return JSON.stringify(logEntry);
  } else {
    return `[${level.toUpperCase()}] ${timestamp} ${module} ${msg}`;
  }
}

/**
 * Formatting for old debug.log file
 */
export function formatForLegacyFile(level, mod, msg, data) {
  const timestamp = new Date().toISOString();
  const module = mod ? `[${mod}]` : '';
  
  if (typeof data !== 'undefined') {
    const safeData = typeof data === 'string' ? data : safeStringify(data);
    return `${timestamp} [${level.toUpperCase()}] ${module} ${msg} ${safeData}`;
  } else {
    return `${timestamp} [${level.toUpperCase()}] ${module} ${msg}`;
  }
}

/**
 * Generate AI-friendly JSON log
 */
export function formatForAILog(level, mod, msg, data, config, sequenceId) {
  const timestamp = new Date().toISOString();
  
  // Prepare data for AI log
  let aiLogEntry = {
    timestamp,
    level,
    module: mod || null,
    message: msg,
    process: 'main',
    app_version: config.appVersion,
    platform: config.platform,
    sequence_id: sequenceId
  };
  
  if (typeof data !== 'undefined') {
    aiLogEntry.data = typeof data === 'string' ? data : safeStringify(data);
  }
  
  // Determine event category
  const eventCategories = {
    'IPC:': 'ipc_communication',
    'UI/': 'ui_interaction',
    'System': 'system_event',
    'error': 'error',
    'trace': 'trace_operation'
  };
  
  // Determine category based on module or level
  aiLogEntry.category = 'other';
  for (const [key, category] of Object.entries(eventCategories)) {
    if ((mod && mod.includes(key)) || level === key) {
      aiLogEntry.category = category;
      break;
    }
  }
  
  return JSON.stringify(aiLogEntry);
}

/**
 * Formats log message in standard format
 * @param {string} level - Log level
 * @param {string} module - Module generating log
 * @param {string} message - Log message
 * @returns {string} - Formatted message
 */
export function formatLogMessage(level, module, message) {
  const timestamp = getFormattedTime();
  const moduleStr = module ? `[${module}]` : '';
  return `[${level}] ${timestamp} ${moduleStr} ${message}`;
}

/**
 * Formats current time for log
 * @returns {string} - Formatted time
 */
export function getFormattedTime() {
  const now = new Date();
  return now.toISOString();
} 