// UI/TestRunner/Bridge/testRunnerBridge.js
// UI Bridge for test runner

import { createLogger } from '@UI/Utils/loggerService.js';

// Create logger for module
const logger = createLogger('UI/TestRunner/Bridge/testRunnerBridge');

/**
 * Bridge between UI and business layer for test runner
 */
export const testRunnerBridge = {
  /**
   * Gets test questions for test runner
   * @param {string} testPath - Path to test
   * @returns {Promise<{success: boolean, questions?: Array<Object>, error?: string}>} - Operation result
   */
  async getQuestions(testPath) {
    try {
      logger.debug(`Requesting test questions via bridge: ${testPath}`);
      
      if (!testPath) {
        logger.warn('Test path not specified for getting questions');
        return {
          success: false,
          error: 'Test path not specified',
          questions: []
        };
      }
      
      const result = await window.electron.testRunner.getQuestions(testPath);
      
      if (!result.success) {
        logger.warn(`Error getting questions: ${result.error}`);
      } else {
        logger.debug(`Successfully got questions (${result.questions.length})`);
      }
      
      return result;
    } catch (error) {
      logger.error(`Bridge error getting test questions: ${error.message}`, error);
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
      logger.debug(`Requesting test runner background via bridge${folderPath ? ` from folder ${folderPath}` : ''}`);
      
      const result = await window.electron.testRunner.getBackground(folderPath);
      
      if (!result.success) {
        logger.warn(`Error getting background: ${result.error}`);
      } else {
        logger.debug(`Successfully got background: ${result.path}`);
      }
      
      return result;
    } catch (error) {
      logger.error(`Bridge error getting background: ${error.message}`, error);
      return {
        success: false,
        error: error.message,
        path: null
      };
    }
  },
  
  /**
   * Validates test before starting
   * @param {string} testPath - Path to test
   * @returns {Promise<{success: boolean, isValid: boolean, error?: string, questionsCount?: number}>} - Validation result
   */
  async validateTest(testPath) {
    try {
      logger.debug(`Requesting test validation via bridge: ${testPath}`);
      
      if (!testPath) {
        logger.warn('Test path not specified for validation');
        return {
          success: false,
          isValid: false,
          error: 'Test path not specified',
          questionsCount: 0
        };
      }
      
      const result = await window.electron.testRunner.validateTest(testPath);
      
      if (!result.success) {
        logger.warn(`Test validation error: ${result.error}`);
      } else if (!result.isValid) {
        logger.warn(`Test failed validation: ${result.error}`);
      } else {
        logger.debug(`Test successfully validated (${result.questionsCount} questions)`);
      }
      
      return result;
    } catch (error) {
      logger.error(`Bridge error validating test: ${error.message}`, error);
      return {
        success: false,
        isValid: false,
        error: error.message,
        questionsCount: 0
      };
    }
  },
  
  /**
   * Starts test in test runner
   * @param {string} testPath - Path to test
   * @returns {Promise<{success: boolean, error?: string}>} - Start result
   */
  async startTest(testPath) {
    try {
      logger.debug(`Requesting test start via bridge: ${testPath}`);
      
      if (!testPath) {
        logger.warn('Test path not specified for starting');
        return {
          success: false,
          error: 'Test path not specified'
        };
      }
      
      const result = await window.electron.testRunner.startTest(testPath);
      
      if (!result.success) {
        logger.warn(`Error starting test: ${result.error}`);
      } else {
        logger.debug('Test successfully started');
      }
      
      return result;
    } catch (error) {
      logger.error(`Bridge error starting test: ${error.message}`, error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}; 