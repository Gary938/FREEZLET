import { createLogger } from '../../Utils/loggerService.js';

// Create logger for module
const logger = createLogger('UI/Bridge/TestTable/testCreateBridge');

/**
 * Creates test from content in specified category
 * @param {string} categoryPath - Path to category
 * @param {string} testName - Test name (without .txt extension)
 * @param {string} content - Test content in TXT format
 * @returns {Promise<{success: boolean, path?: string, questions?: number, error?: string}>} - Operation result
 */
export async function createTestBridge(categoryPath, testName, content) {
  try {
    // Input parameter validation
    if (!categoryPath || typeof categoryPath !== 'string' || categoryPath.trim() === '') {
      logger.error('Category path not specified');
      return { success: false, error: 'Category path not specified' };
    }

    if (!testName || typeof testName !== 'string' || testName.trim() === '') {
      logger.error('Test name not specified');
      return { success: false, error: 'Test name not specified' };
    }

    if (!content || typeof content !== 'string' || content.trim() === '') {
      logger.error('Test content not specified');
      return { success: false, error: 'Test content not specified' };
    }

    logger.debug(`Request to create test in category: ${categoryPath}, name: ${testName}`);

    // Check API availability
    if (!window.electron || !window.electron.tests) {
      logger.error('Tests API not available');
      return { success: false, error: 'Tests API not available' };
    }

    // Call API method to create test
    const result = await window.electron.tests.create(categoryPath, testName, content);

    if (!result.success) {
      logger.warn(`Test creation error: ${result.error}`);
      return { success: false, error: result.error };
    }

    logger.success(`Test created: ${result.path} (${result.questions} questions)`);
    return result;
  } catch (error) {
    logger.error(`Error creating test: ${error.message}`, error);
    return { success: false, error: error.message };
  }
}
