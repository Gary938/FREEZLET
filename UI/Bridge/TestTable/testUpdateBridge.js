import { createLogger } from '../../Utils/loggerService.js';

// Create logger for module
const logger = createLogger('UI/Bridge/TestTable/testUpdateBridge');

/**
 * Gets test content
 * @param {string} testPath - Test path
 * @returns {Promise<{success: boolean, content?: string, error?: string}>} - Operation result
 */
export async function getTestContentBridge(testPath) {
  try {
    // Input parameter validation
    if (!testPath || typeof testPath !== 'string' || testPath.trim() === '') {
      logger.error('Test path not specified');
      return { success: false, error: 'Test path not specified' };
    }

    logger.debug(`Request to get test content: ${testPath}`);

    // Check API availability
    if (!window.electron || !window.electron.tests) {
      logger.error('Tests API not available');
      return { success: false, error: 'Tests API not available' };
    }

    // Call API method to get content
    const result = await window.electron.tests.getContent(testPath);

    if (!result.success) {
      logger.warn(`Error getting test content: ${result.error}`);
      return { success: false, error: result.error };
    }

    logger.success(`Test content retrieved: ${testPath}`);
    return result;
  } catch (error) {
    logger.error(`Error getting test content: ${error.message}`, error);
    return { success: false, error: error.message };
  }
}

/**
 * Updates test content
 * @param {string} testPath - Test path
 * @param {string} content - New test content
 * @returns {Promise<{success: boolean, path?: string, questions?: number, error?: string}>} - Operation result
 */
export async function updateTestContentBridge(testPath, content) {
  try {
    // Input parameter validation
    if (!testPath || typeof testPath !== 'string' || testPath.trim() === '') {
      logger.error('Test path not specified');
      return { success: false, error: 'Test path not specified' };
    }

    if (content === undefined || content === null) {
      logger.error('Content not specified');
      return { success: false, error: 'Content not specified' };
    }

    logger.debug(`Request to update test content: ${testPath}`);

    // Check API availability
    if (!window.electron || !window.electron.tests) {
      logger.error('Tests API not available');
      return { success: false, error: 'Tests API not available' };
    }

    // Call API method to update content
    const result = await window.electron.tests.updateContent(testPath, content);

    if (!result.success) {
      logger.warn(`Error updating test content: ${result.error}`);
      return { success: false, error: result.error };
    }

    logger.success(`Test content updated: ${result.path} (${result.questions} questions)`);
    return result;
  } catch (error) {
    logger.error(`Error updating test content: ${error.message}`, error);
    return { success: false, error: error.message };
  }
}
