// Main/API/TestAPI/progressManager.js
// API for test progress management

import { mainLogger } from '../../loggerHub.js';
import { testRepository } from '../../BusinessLayer/DB/testRepository.js';
import { createApiLogger, logApiStart, logApiSuccess, logApiError } from '../../Logger/apiLogger.js';

// Create logger for module
const logger = createApiLogger('TestAPI:progress');

/**
 * Gets progress for specified test
 * @param {string} path - Test path
 * @returns {Promise<Object>} - Object with progress data
 */
export async function getProgress(path) {
  try {
    logApiStart(logger, 'getProgress', { path });
    
    // Get progress data from business layer
    const progress = testRepository.getProgress(path);
    
    logApiSuccess(logger, 'getProgress');
    return progress;
  } catch (error) {
    logApiError(logger, 'getProgress', error);
    return { stage: 0, stars: 0, percentage: 0 };
  }
}

/**
 * Resets progress for specified test
 * @param {string} path - Test path
 * @returns {Promise<Object>} - Operation result
 */
export async function resetProgress(path) {
  try {
    logApiStart(logger, 'resetProgress', { path });
    
    // Reset progress via business layer
    testRepository.resetProgress(path);
    
    logApiSuccess(logger, 'resetProgress');
    return { success: true };
  } catch (error) {
    logApiError(logger, 'resetProgress', error);
    return { success: false, error: error.message };
  }
}

/**
 * Updates progress for specified test
 * @param {string} path - Test path
 * @param {Object} data - Data for progress update
 * @param {number} [data.stage] - Test stage
 * @param {number} [data.stars] - Number of stars
 * @param {number} [data.percentage] - Completion percentage
 * @returns {Promise<Object>} - Operation result
 */
export async function updateProgress(path, data) {
  try {
    logApiStart(logger, 'updateProgress', { path, data });
    
    // Update progress via business layer
    testRepository.updateProgress(path, data);
    
    logApiSuccess(logger, 'updateProgress');
    return { success: true };
  } catch (error) {
    logApiError(logger, 'updateProgress', error);
    return { success: false, error: error.message };
  }
}

/**
 * Increments attempt counter for specified test
 * @param {string} path - Test path
 * @returns {Promise<Object>} - Operation result
 */
export async function incrementAttempts(path) {
  try {
    logApiStart(logger, 'incrementAttempts', { path });
    
    // Increment attempt counter via business layer
    testRepository.incrementAttempts(path);
    
    logApiSuccess(logger, 'incrementAttempts');
    return { success: true };
  } catch (error) {
    logApiError(logger, 'incrementAttempts', error);
    return { success: false, error: error.message };
  }
} 