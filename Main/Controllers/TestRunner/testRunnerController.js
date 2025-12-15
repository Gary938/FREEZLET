// Main/Controllers/TestRunner/testRunnerController.js
// Test runner controller

import { mainLogger } from '../../loggerHub.js';
import * as testRunnerAPI from '../../API/TestRunner/testRunnerOperations.js';

// Create logger for module
const logger = {
  info: (message) => mainLogger.info('Controllers:TestRunner:testRunnerController', message),
  warn: (message) => mainLogger.warn('Controllers:TestRunner:testRunnerController', message),
  error: (message, error) => mainLogger.error('Controllers:TestRunner:testRunnerController', message, error),
  debug: (message) => mainLogger.debug('Controllers:TestRunner:testRunnerController', message),
  success: (message) => mainLogger.success('Controllers:TestRunner:testRunnerController', message)
};

/**
 * Test runner controller
 */
export const testRunnerController = {
  /**
   * Gets test questions
   * @param {string} testPath - Full path to test
   * @returns {Promise<{success: boolean, questions?: Array<Object>, error?: string}>} - Operation result
   */
  async getQuestions(testPath) {
    try {
      logger.debug(`Requesting test questions: ${testPath}`);
      
      if (!testPath) {
        logger.warn('Test path not specified');
        return {
          success: false,
          error: 'Test path not specified',
          questions: []
        };
      }
      
      const result = await testRunnerAPI.getTestQuestions(testPath);
      
      if (!result.success) {
        logger.warn(`Error getting questions: ${result.error}`);
      } else {
        logger.success(`Successfully got questions: ${result.questions.length}`);
      }
      
      return result;
    } catch (error) {
      logger.error(`Controller error getting questions: ${error.message}`, error);
      return {
        success: false,
        error: error.message,
        questions: []
      };
    }
  },

  /**
   * Gets background for test runner
   * @param {string} [folderPath] - Optional path to backgrounds folder
   * @returns {Promise<{success: boolean, path?: string, error?: string}>} - Operation result
   */
  async getBackground(folderPath) {
    try {
      logger.debug(`Requesting test runner background${folderPath ? ` from folder ${folderPath}` : ''}`);
      
      const result = await testRunnerAPI.getTestRunnerBackground(folderPath);
      
      if (!result.success) {
        logger.warn(`Error getting background: ${result.error}`);
      } else {
        logger.success(`Successfully got background: ${result.path}`);
      }
      
      return result;
    } catch (error) {
      logger.error(`Controller error getting background: ${error.message}`, error);
      return {
        success: false,
        error: error.message,
        path: null
      };
    }
  },

  /**
   * Checks if test can be run in test runner
   * @param {string} testPath - Full path to test
   * @returns {Promise<{success: boolean, isValid: boolean, error?: string, questionsCount?: number}>} - Check result
   */
  async validateTest(testPath) {
    try {
      logger.debug(`Checking if test can be run: ${testPath}`);
      
      if (!testPath) {
        logger.warn('Test path not specified');
        return {
          success: false,
          isValid: false,
          error: 'Test path not specified',
          questionsCount: 0
        };
      }
      
      const result = await testRunnerAPI.validateTestForRunner(testPath);
      
      if (!result.success) {
        logger.warn(`Test validation error: ${result.error}`);
      } else if (!result.isValid) {
        logger.warn(`Test failed validation: ${result.error}`);
      } else {
        logger.success(`Test valid for run, questions count: ${result.questionsCount}`);
      }
      
      return result;
    } catch (error) {
      logger.error(`Controller error validating test: ${error.message}`, error);
      return {
        success: false,
        isValid: false,
        error: error.message,
        questionsCount: 0
      };
    }
  },

  /**
   * Runs test in test runner
   * @param {string} testPath - Full path to test
   * @returns {Promise<{success: boolean, error?: string}>} - Run result
   */
  async startTest(testPath) {
    try {
      logger.debug(`Running test in test runner: ${testPath}`);
      
      // Validate test before running
      const validationResult = await this.validateTest(testPath);
      
      if (!validationResult.success) {
        logger.warn(`Error validating test before run: ${validationResult.error}`);
        return {
          success: false,
          error: validationResult.error
        };
      }
      
      if (!validationResult.isValid) {
        logger.warn(`Test failed validation before run: ${validationResult.error}`);
        return {
          success: false,
          error: validationResult.error || 'Test failed validation'
        };
      }
      
      logger.success(`Test successfully started: ${testPath}`);
      return {
        success: true
      };
    } catch (error) {
      logger.error(`Controller error starting test: ${error.message}`, error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}; 