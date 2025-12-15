/**
 * Main/Logger/utils.js
 * Helper functions for logging system
 */

import fs from 'fs';
import path from 'path';

/**
 * Safe object to JSON string conversion
 */
export function safeStringify(data) {
  // Create new WeakSet for each call
  const seen = new WeakSet();
  
  try {
    return JSON.stringify(data, (key, value) => {
      // Handle circular references
      if (typeof value === 'object' && value !== null) {
        if (seen.has(value)) {
          return '[Circular reference]';
        }
        seen.add(value);
      }
      return value;
    }, 2);
  } catch (error) {
    return `[Cannot serialize: ${error.message}]`;
  }
}

/**
 * Log file rotation
 */
export function rotateLogFile(logFilePath, maxLogSize, maxLogFiles) {
  if (fs.existsSync(logFilePath)) {
    const { size } = fs.statSync(logFilePath);
    if (size > maxLogSize) {
      for (let i = maxLogFiles - 1; i > 0; i--) {
        const oldPath = `${logFilePath}.${i-1}`;
        const newPath = `${logFilePath}.${i}`;
        
        if (fs.existsSync(oldPath)) {
          if (fs.existsSync(newPath)) {
            fs.unlinkSync(newPath);
          }
          fs.renameSync(oldPath, newPath);
        }
      }
      
      const backupPath = `${logFilePath}.1`;
      fs.renameSync(logFilePath, backupPath);
      fs.writeFileSync(logFilePath, '', 'utf8');
    }
  }
}

/**
 * Clear log files
 */
export function clearLogFiles(legacyLogPath, aiLogPath) {
  try {
    // Clear regular text log
    fs.writeFileSync(legacyLogPath, '', 'utf8');
    
    // Clear JSON log for AI
    if (aiLogPath) {
      fs.writeFileSync(aiLogPath, '', 'utf8');
    }
    
    return true;
  } catch (error) {
    console.error('Error clearing log files:', error);
    return false;
  }
}

/**
 * Parse log string
 */
export function parseLine(line) {
  // Check if JSON or text format
  if (line.startsWith('{') && line.endsWith('}')) {
    try {
      return JSON.parse(line);
    } catch (e) {
      // On parse error, return as text
    }
  }
  
  // Parse text format
  const regex = /\[([A-Z]+)\] ([^[]+) \[([^\]]+)\] (.*)/;
  const match = line.match(regex);
  
  if (match) {
    return {
      level: match[1].toLowerCase(),
      timestamp: match[2].trim(),
      module: match[3],
      message: match[4]
    };
  }
  
  return null;
} 