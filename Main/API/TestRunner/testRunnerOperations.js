// Main/API/TestRunner/testRunnerOperations.js
// API for test runner

import { mainLogger } from '../../loggerHub.js';
import { createApiLogger, logApiStart, logApiSuccess, logApiError } from '../../Logger/apiLogger.js';
import * as testRunnerService from '../../BusinessLayer/TestRunner/testRunnerService.js';

// Create logger for module
const logger = createApiLogger('TestAPI:testRunnerOperations');

/**
 * Gets test questions for test runner
 * @param {string} testPath - Full path to test
 * @returns {Promise<{success: boolean, questions?: Array<Object>, error?: string}>} - Operation result
 */
export async function getTestQuestions(testPath) {
  try {
    logApiStart(logger, 'getTestQuestions', { testPath });
    
    const result = await testRunnerService.getTestQuestions(testPath);
    
    logApiSuccess(logger, 'getTestQuestions', { 
      success: result.success, 
      questionsCount: result.questions?.length || 0 
    });
    
    return result;
  } catch (error) {
    logApiError(logger, 'getTestQuestions', error);
    return {
      success: false,
      error: error.message,
      questions: []
    };
  }
}

/**
 * Gets background for test runner
 * @param {string} [folderPath] - Optional path to backgrounds folder
 * @returns {Promise<{success: boolean, path?: string, error?: string}>} - Operation result
 */
export async function getTestRunnerBackground(folderPath) {
  try {
    logApiStart(logger, 'getTestRunnerBackground', { folderPath });
    
    const result = await testRunnerService.getTestRunnerBackground(folderPath);
    
    logApiSuccess(logger, 'getTestRunnerBackground', { 
      success: result.success, 
      path: result.path 
    });
    
    return result;
  } catch (error) {
    logApiError(logger, 'getTestRunnerBackground', error);
    return {
      success: false,
      error: error.message,
      path: null
    };
  }
}

/**
 * Validates test for test runner execution
 * @param {string} testPath - Full path to test
 * @returns {Promise<{success: boolean, isValid: boolean, error?: string, questionsCount?: number}>} - Validation result
 */
export async function validateTestForRunner(testPath) {
  try {
    logApiStart(logger, 'validateTestForRunner', { testPath });
    
    const result = await testRunnerService.validateTestForRunner(testPath);
    
    logApiSuccess(logger, 'validateTestForRunner', { 
      success: result.success, 
      isValid: result.isValid,
      questionsCount: result.questionsCount || 0
    });
    
    return result;
  } catch (error) {
    logApiError(logger, 'validateTestForRunner', error);
    return {
      success: false,
      isValid: false,
      error: error.message,
      questionsCount: 0
    };
  }
}

// Export default object for backward compatibility
export default {
  getTestQuestions,
  getTestRunnerBackground,
  validateTestForRunner
}; 