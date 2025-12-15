/**
 * Main/Logger/fileLogger.js
 * Writing logs to files and log file management
 */

import fs from 'fs';
import path from 'path';
import { rotateLogFile } from './utils.js';
import { 
  formatForFile, 
  formatForLegacyFile, 
  formatForAILog
} from './formatters.js';

/**
 * Write log to main file, session file and legacy file
 */
export function writeToLogFiles(level, mod, msg, data, config, sequenceId) {
  try {
    // Create logs folder if it doesn't exist
    if (!fs.existsSync(config.logDirectory)) {
      fs.mkdirSync(config.logDirectory, { recursive: true });
    }
    
    const mainLogPath = path.join(config.logDirectory, config.mainLogFile);
    const sessionLogPath = path.join(config.logDirectory, config.sessionLogFile);
    
    // Main log file rotation
    rotateLogFile(mainLogPath, config.maxLogSize, config.maxLogFiles);
    
    // Format entry for different files
    const mainLogEntry = formatForFile(level, mod, msg, data);
    const legacyLogEntry = formatForLegacyFile(level, mod, msg, data);
    
    // Write to files
    fs.appendFileSync(mainLogPath, mainLogEntry + '\n', 'utf8');
    fs.appendFileSync(sessionLogPath, mainLogEntry + '\n', 'utf8');
    
    // Write to old debug.log file for backward compatibility
    if (config.useLegacyLogFile) {
      const legacyLogPath = config.legacyLogFile; // Already absolute path
      fs.appendFileSync(legacyLogPath, legacyLogEntry + '\n', 'utf8');
    }
    
    // Write to AI-friendly JSON format
    if (config.useAiLogFile) {
      const aiLogPath = config.aiLogFile; // Already absolute path
      const aiLogEntry = formatForAILog(level, mod, msg, data, config, sequenceId);
      fs.appendFileSync(aiLogPath, aiLogEntry + '\n', 'utf8');
    }
    
    return true;
  } catch (error) {
    console.error('Error writing to log file:', error);
    return false;
  }
}

/**
 * Simple message write to log file
 * Used in mainLogger.js for compatibility
 */
export function writeToLogFile(message) {
  try {
    // Write log to debug.log
    const logPath = path.resolve('debug.log');
    fs.appendFileSync(logPath, message + '\n', 'utf8');
    return true;
  } catch (error) {
    console.error('Error writing to log file:', error);
    return false;
  }
}

/**
 * Get logs from file for UI
 */
export async function getLogsFromFile(options, config, parseLine) {
  const { limit = 1000, filter, level, since } = options || {};
  const logPath = path.join(config.logDirectory, config.sessionLogFile);
  
  if (!fs.existsSync(logPath)) {
    return [];
  }
  
  // Read log file
  const content = fs.readFileSync(logPath, 'utf8');
  const lines = content.split('\n').filter(line => line.trim());
  
  // Parse and filter logs
  const logs = lines.map(line => parseLine(line))
    .filter(entry => {
      if (!entry) return false;
      if (level && entry.level !== level) return false;
      if (since && new Date(entry.timestamp) < new Date(since)) return false;
      if (filter && !entry.message.includes(filter) && !entry.module?.includes(filter)) {
        return false;
      }
      return true;
    })
    .slice(-limit);
  
  return logs;
} 