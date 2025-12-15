// Main/Controllers/TestController/testRenameController.js
// Controller for renaming tests

import { mainLogger } from '../../loggerHub.js';
import { renameTest } from '../../API/TestAPI/testRename.js';

// Logger for module
const logger = {
  info: (message) => mainLogger.info('Controllers:TestController:testRenameController', message),
  warn: (message) => mainLogger.warn('Controllers:TestController:testRenameController', message),
  error: (message, error) => mainLogger.error('Controllers:TestController:testRenameController', message, error),
  debug: (message) => mainLogger.debug('Controllers:TestController:testRenameController', message),
  success: (message) => mainLogger.success('Controllers:TestController:testRenameController', message)
};

/**
 * Test rename controller
 */
export const testRenameController = {
  /**
   * Renames test
   * @param {string} testPath - Current test path (e.g., "Tests/MyCategory/test.txt")
   * @param {string} newName - New test name (without .txt extension)
   * @returns {Promise<Object>} - Rename operation result
   */
  async rename(testPath, newName) {
    try {
      logger.debug(`Request to rename test: ${testPath} → ${newName}`);

      // Parameter validation
      if (!testPath) {
        logger.error('Test path for rename not specified');
        return { success: false, error: 'Test path for rename not specified' };
      }

      if (!newName) {
        logger.error('New test name not specified');
        return { success: false, error: 'New test name not specified' };
      }

      // Call API to rename test
      const renameResult = await renameTest(testPath, newName);

      // Return operation result
      if (renameResult.success) {
        logger.success(`Test renamed: ${renameResult.oldPath} → ${renameResult.newPath}`);
        return renameResult;
      } else {
        logger.error(`Test rename error: ${renameResult.error}`);
        return renameResult;
      }
    } catch (error) {
      logger.error('Error renaming test', error);
      return { success: false, error: error.message };
    }
  }
};
