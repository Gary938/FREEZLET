import { createLogger } from '../../Utils/loggerService.js';

// Create logger for module
const logger = createLogger('UI/Bridge/TestTable/getTests');

/**
 * Gets list of tests for specified category or all tests
 * @param {string|null} categoryPath - Path to category (if null, returns all tests)
 * @returns {Promise<{success: boolean, tests?: Array, error?: string}>} - Operation result
 */
export async function getTestsBridge(categoryPath = null) {
  try {
    logger.debug(`Requesting tests for category: ${categoryPath || 'all categories'}`);

    // Check API availability
    if (!window.electron || !window.electron.tests) {
      logger.error('Tests API not available');
      return { success: false, error: 'Tests API not available', tests: [] };
    }

    // Call API method to get tests
    const result = await window.electron.tests.getTests(categoryPath);

    if (!result.success) {
      logger.warn(`Error getting tests: ${result.error}`);
      return { success: false, error: result.error, tests: [] };
    }

    const tests = result.tests || [];
    logger.info(`Received ${tests.length} tests`);
    return { success: true, tests };
  } catch (error) {
    logger.error(`Error getting tests: ${error.message}`, error);
    return { success: false, error: error.message, tests: [] };
  }
} 