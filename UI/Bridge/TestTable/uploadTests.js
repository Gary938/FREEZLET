import { createLogger } from '../../Utils/loggerService.js';

// Create logger for module
const logger = createLogger('UI/Bridge/TestTable/uploadTests');

/**
 * Uploads tests to specified category
 * @param {string} categoryPath - Path to category
 * @returns {Promise<{success: boolean, uploaded?: Array, canceled?: boolean, error?: string}>} - Operation result
 */
export async function uploadTestsBridge(categoryPath) {
  try {
    // Input parameter validation
    if (!categoryPath || typeof categoryPath !== 'string' || categoryPath.trim() === '') {
      logger.error('Category path not specified');
      return { success: false, error: 'Category path not specified' };
    }

    logger.debug(`Request to upload tests to category: ${categoryPath}`);

    // Check API availability
    if (!window.electron || !window.electron.tests) {
      logger.error('Tests API not available');
      return { success: false, error: 'Tests API not available' };
    }

    // Call API method to upload tests
    const result = await window.electron.tests.upload(categoryPath);

    if (!result.success) {
      logger.warn(`Test upload error: ${result.error}`);
      return { success: false, error: result.error };
    }

    logger.success(`Uploaded ${result.uploaded?.length || 0} tests`);
    return result;
  } catch (error) {
    logger.error(`Error uploading tests: ${error.message}`, error);
    return { success: false, error: error.message };
  }
} 