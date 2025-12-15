/**
 * Business logic controller for test table
 * @module Main/Controllers/TestController/testTableController
 */

import { getAllTests, getTestsByCategory } from '../../API/TestAPI/index.js';
import { mainLogger } from '../../loggerHub.js';

// Create logger for module
const logger = {
  debug: (message) => mainLogger.debug('Controllers:TestController:testTableController', message),
  info: (message) => mainLogger.info('Controllers:TestController:testTableController', message),
  warn: (message) => mainLogger.warn('Controllers:TestController:testTableController', message),
  error: (message, error) => mainLogger.error('Controllers:TestController:testTableController', message, error),
  success: (message) => mainLogger.success('Controllers:TestController:testTableController', message)
};

/**
 * Controller for test table
 */
export const testTableController = {
  /**
   * Gets test list for specified category or all tests if category not specified
   * @param {string|null} categoryPath - Path to category (if null, returns all tests)
   * @returns {Promise<{success: boolean, tests?: Array, error?: string}>} - Operation result
   */
  async getTests(categoryPath = null) {
    try {
      logger.debug(`Getting tests for category: ${categoryPath || 'all categories'}`);
      
      let result;
      
      if (categoryPath) {
        // Get tests for specific category
        result = await getTestsByCategory(categoryPath);
      } else {
        // Get all tests
        result = await getAllTests();
      }
      
      if (!result.success) {
        logger.warn(`Error getting tests: ${result.error}`);
        return { success: false, error: result.error, tests: [] };
      }
      
      logger.info(`Got ${result.data ? result.data.length : 0} tests`);
      return { success: true, tests: result.data || [] };
    } catch (error) {
      logger.error('Error getting tests', error);
      return { success: false, error: error.message, tests: [] };
    }
  }
}; 