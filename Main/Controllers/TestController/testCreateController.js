// Main/Controllers/TestController/testCreateController.js
// Controller for creating tests from content

import { mainLogger } from '../../loggerHub.js';
import { createTestFromContent } from '../../API/TestAPI/testCreate.js';

// Logger for module
const logger = {
  info: (message) => mainLogger.info('Controllers:TestController:testCreateController', message),
  warn: (message) => mainLogger.warn('Controllers:TestController:testCreateController', message),
  error: (message, error) => mainLogger.error('Controllers:TestController:testCreateController', message, error),
  debug: (message) => mainLogger.debug('Controllers:TestController:testCreateController', message),
  success: (message) => mainLogger.success('Controllers:TestController:testCreateController', message)
};

/**
 * Test create controller
 */
export const testCreateController = {
  /**
   * Creates test from content string
   * @param {string} categoryPath - Path to category (e.g., "Tests/MyCategory")
   * @param {string} testName - Test name (without .txt extension)
   * @param {string} content - Test content in TXT format
   * @returns {Promise<Object>} - Create operation result
   */
  async create(categoryPath, testName, content) {
    try {
      logger.debug(`Request to create test in category: ${categoryPath}, name: ${testName}`);

      // Parameter validation
      if (!categoryPath) {
        logger.error('Category path for test creation not specified');
        return { success: false, error: 'Category path for test creation not specified' };
      }

      if (!testName) {
        logger.error('Test name not specified');
        return { success: false, error: 'Test name not specified' };
      }

      if (!content || content.trim() === '') {
        logger.error('Test content not specified or empty');
        return { success: false, error: 'Test content not specified or empty' };
      }

      // Call API to create test
      const createResult = await createTestFromContent(categoryPath, testName, content);

      // Return operation result
      if (createResult.success) {
        logger.success(`Test created: ${createResult.path} (${createResult.questions} questions)`);
        return createResult;
      } else {
        logger.error(`Test creation error: ${createResult.error}`);
        return createResult;
      }
    } catch (error) {
      logger.error('Error creating test', error);
      return { success: false, error: error.message };
    }
  }
};
