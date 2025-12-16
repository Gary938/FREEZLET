/**
 * Main/Logger/learnModeLogger.js
 * Learn mode logging system
 *
 * Tracks start and end markers of learn mode
 * and writes logs to separate learndebug.jsonl file
 */

import fs from 'fs';
import path from 'path';
import { mainLogger } from '../loggerHub.js';
import { getLogsPath } from '../Utils/appPaths.js';

// Path to learn mode log file
const LEARN_DEBUG_LOG_PATH = path.join(getLogsPath(), 'learndebug.jsonl');

// Variable to track learn mode state
let isLearnModeActive = false;

// Learn mode button click counter (for clearing file on repeated clicks)
let learnModeButtonClickCount = 0;

/**
 * Initializes learn mode log monitoring
 */
export function initLearnModeLogging() {
  // Intercept original logging methods
  interceptLogMethods();
  mainLogger.debug('LearnMode', 'Learn mode logging monitor initialized');
}

/**
 * Resets learn mode state
 * Called when learn mode window is closed
 */
export function resetLearnModeLogging() {
  isLearnModeActive = false;
  mainLogger.debug('LearnMode', 'Learn mode ended, logging stopped');
}

/**
 * Adds interception to logging methods
 */
function interceptLogMethods() {
  // Save original logging methods
  const originalMethods = {
    info: mainLogger.info,
    debug: mainLogger.debug,
    warn: mainLogger.warn,
    error: mainLogger.error,
    success: mainLogger.success,
    trace: mainLogger.trace || (() => {})
  };
  
  // Intercept each logging method
  for (const level in originalMethods) {
    mainLogger[level] = function(module, message, data) {
      // Call original logging method
      originalMethods[level](module, message, data);
      
      // Check learn mode start marker
      if (module === 'UI/Controller/TestTable' && 
          message === 'Learn mode button pressed') {
        
        // Increment button click counter
        learnModeButtonClickCount++;
        
        // Enable log recording mode
        isLearnModeActive = true;
        
        // Clear log file on each button click
        try {
          fs.writeFileSync(LEARN_DEBUG_LOG_PATH, '', 'utf8');
          originalMethods.info('LearnMode', `Learn mode log file cleared (click ${learnModeButtonClickCount})`);
        } catch (error) {
          originalMethods.error('LearnMode', `Error clearing learn mode log file: ${error.message}`);
        }
        
        // Write first entry to log file
        const initRecord = {
          timestamp: new Date().toISOString(),
          type: 'learn_mode_start',
          clickCount: learnModeButtonClickCount,
          message: 'Learn mode logging started'
        };
        
        try {
          fs.appendFileSync(LEARN_DEBUG_LOG_PATH, JSON.stringify(initRecord) + '\n', 'utf8');
        } catch (error) {
          originalMethods.error('LearnMode', `Error writing logging start marker: ${error.message}`);
        }
      }
      
      // If learn mode is active, write log to learndebug.jsonl file
      if (isLearnModeActive) {
        try {
          const logEntry = {
            timestamp: new Date().toISOString(),
            level,
            module,
            message,
            data,
            learnModeSession: learnModeButtonClickCount
          };
          
          fs.appendFileSync(LEARN_DEBUG_LOG_PATH, JSON.stringify(logEntry) + '\n', 'utf8');
        } catch (error) {
          // Log write errors to console, not to file (to avoid circular writing)
          console.error('Error writing to learn mode log file', error);
        }
      }
    };
  }
} 