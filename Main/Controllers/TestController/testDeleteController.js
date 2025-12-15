// Main/Controllers/TestController/testDeleteController.js
// Test deletion controller

import { mainLogger } from '../../loggerHub.js';
import { deleteMultipleTests } from '../../API/TestAPI/testDelete.js';
import { formatPathForQuery } from '../../Utils/pathUtils.js';

// Logger for module
const logger = {
  info: (message) => mainLogger.info('Controllers:TestController:testDeleteController', message),
  warn: (message) => mainLogger.warn('Controllers:TestController:testDeleteController', message),
  error: (message, error) => mainLogger.error('Controllers:TestController:testDeleteController', message, error),
  debug: (message) => mainLogger.debug('Controllers:TestController:testDeleteController', message),
  success: (message) => mainLogger.success('Controllers:TestController:testDeleteController', message)
};

/**
 * Test deletion controller
 */
export const testDeleteController = {
  /**
   * Deletes multiple tests by specified paths
   * @param {Array<string>} testPaths - Array of test paths to delete
   * @returns {Promise<Object>} - Operation result
   */
  async deleteMultiple(testPaths) {
    try {
      logger.info(`Request to delete ${testPaths?.length || 0} tests`);
      
      if (!testPaths || !Array.isArray(testPaths) || testPaths.length === 0) {
        logger.warn('No test paths specified for deletion');
        return { 
          success: false, 
          error: 'No test paths specified for deletion',
          deleted: [],
          failed: []
        };
      }
      
      // Format paths for request
      const formattedPaths = testPaths.map(path => formatPathForQuery(path));
      logger.debug(`Formatted paths for deletion: ${formattedPaths.join(', ')}`);
      
      // Call API to delete tests
      const result = await deleteMultipleTests(formattedPaths);
      
      if (result.success) {
        logger.success(`Successfully deleted ${result.deleted.length} tests`);
        if (result.failed.length > 0) {
          logger.warn(`Failed to delete ${result.failed.length} tests`);
        }
      } else {
        logger.warn(`Error deleting tests: ${result.error}`);
      }
      
      return result;
    } catch (error) {
      logger.error('Error in test deletion controller', error);
      return { 
        success: false, 
        error: error.message,
        deleted: [],
        failed: testPaths.map(path => ({ path, error: error.message }))
      };
    }
  }
}; 