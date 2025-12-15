import { createLogger } from '../../Utils/loggerService.js';

// Create logger for module
const logger = createLogger('UI/Bridge/TestTable/testRenameBridge');

/**
 * Renames test
 * @param {string} testPath - Current test path
 * @param {string} newName - New test name (without .txt extension)
 * @returns {Promise<{success: boolean, oldPath?: string, newPath?: string, error?: string}>} - Operation result
 */
export async function renameTestBridge(testPath, newName) {
  try {
    // Input parameter validation
    if (!testPath || typeof testPath !== 'string' || testPath.trim() === '') {
      logger.error('Test path not specified');
      return { success: false, error: 'Test path not specified' };
    }

    if (!newName || typeof newName !== 'string' || newName.trim() === '') {
      logger.error('New name not specified');
      return { success: false, error: 'New name not specified' };
    }

    logger.debug(`Request to rename test: ${testPath} → ${newName}`);

    // Check API availability
    if (!window.electron || !window.electron.tests) {
      logger.error('Tests API not available');
      return { success: false, error: 'Tests API not available' };
    }

    // Call API method to rename test
    const result = await window.electron.tests.rename(testPath, newName);

    if (!result.success) {
      logger.warn(`Test rename error: ${result.error}`);
      return { success: false, error: result.error };
    }

    logger.success(`Test renamed: ${result.oldPath} → ${result.newPath}`);
    return result;
  } catch (error) {
    logger.error(`Error renaming test: ${error.message}`, error);
    return { success: false, error: error.message };
  }
}
