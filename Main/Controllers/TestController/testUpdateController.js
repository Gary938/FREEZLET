// Main/Controllers/TestController/testUpdateController.js
// Controller for updating test content

import { mainLogger } from '../../loggerHub.js';
import { getTestContent, updateTestContent } from '../../API/TestAPI/testUpdate.js';

// Logger for module
const logger = {
  info: (message) => mainLogger.info('Controllers:TestController:testUpdateController', message),
  warn: (message) => mainLogger.warn('Controllers:TestController:testUpdateController', message),
  error: (message, error) => mainLogger.error('Controllers:TestController:testUpdateController', message, error),
  debug: (message) => mainLogger.debug('Controllers:TestController:testUpdateController', message),
  success: (message) => mainLogger.success('Controllers:TestController:testUpdateController', message)
};

/**
 * Test update controller
 */
export const testUpdateController = {
  /**
   * Gets test content
   * @param {string} testPath - Test path (e.g., "Tests/MyCategory/test.txt")
   * @returns {Promise<Object>} - Operation result with content
   */
  async getContent(testPath) {
    try {
      logger.debug(`Request to get test content: ${testPath}`);

      // Parameter validation
      if (!testPath) {
        logger.error('Test path not specified');
        return { success: false, error: 'Test path not specified' };
      }

      // Call API to get content
      const result = await getTestContent(testPath);

      // Return operation result
      if (result.success) {
        logger.success(`Test content retrieved: ${testPath}`);
        return result;
      } else {
        logger.error(`Error getting test content: ${result.error}`);
        return result;
      }
    } catch (error) {
      logger.error('Error getting test content', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Updates test content
   * @param {string} testPath - Test path (e.g., "Tests/MyCategory/test.txt")
   * @param {string} content - New test content
   * @returns {Promise<Object>} - Update operation result
   */
  async updateContent(testPath, content) {
    try {
      logger.debug(`Request to update test content: ${testPath}`);

      // Parameter validation
      if (!testPath) {
        logger.error('Test path for update not specified');
        return { success: false, error: 'Test path for update not specified' };
      }

      if (content === undefined || content === null) {
        logger.error('Content for update not specified');
        return { success: false, error: 'Content for update not specified' };
      }

      // Call API to update content
      const updateResult = await updateTestContent(testPath, content);

      // Return operation result
      if (updateResult.success) {
        logger.success(`Test content updated: ${updateResult.path} (${updateResult.questions} questions)`);
        return updateResult;
      } else {
        logger.error(`Test content update error: ${updateResult.error}`);
        return updateResult;
      }
    } catch (error) {
      logger.error('Error updating test content', error);
      return { success: false, error: error.message };
    }
  }
};
