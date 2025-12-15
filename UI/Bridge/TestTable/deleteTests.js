import { createLogger } from '../../Utils/loggerService.js';

// Create logger for module
const logger = createLogger('UI/Bridge/TestTable/deleteTests');

/**
 * Deletes tests by specified paths
 * @param {Array<string>} testPaths - Array of test paths to delete
 * @returns {Promise<{success: boolean, deleted?: Array, failed?: Array, error?: string}>} - Operation result
 */
export async function deleteTestsBridge(testPaths) {
  // Input parameter validation
  const paths = Array.isArray(testPaths) ? testPaths : [];

  try {
    if (paths.length === 0) {
      logger.warn('No paths specified for deletion');
      return { success: false, error: 'No paths specified for deletion', deleted: [], failed: [] };
    }

    logger.debug(`Request to delete ${paths.length} tests`);

    // Check API availability
    if (!window.electron || !window.electron.tests) {
      logger.error('Tests API not available');
      return {
        success: false,
        error: 'Tests API not available',
        deleted: [],
        failed: paths.map(path => ({ path, error: 'Tests API not available' }))
      };
    }

    // Call API method to delete tests
    const result = await window.electron.tests.deleteMultiple(paths);

    if (!result.success) {
      logger.warn(`Test deletion error: ${result.error}`);
    } else {
      const deletedCount = result.deleted?.length || 0;
      const failedCount = result.failed?.length || 0;

      logger.success(`Deleted ${deletedCount} tests`);
      if (failedCount > 0) {
        logger.warn(`Failed to delete ${failedCount} tests`);
      }
    }

    return result;
  } catch (error) {
    logger.error(`Error deleting tests: ${error.message}`, error);
    return {
      success: false,
      error: error.message,
      deleted: [],
      failed: paths.map(path => ({ path, error: error.message }))
    };
  }
} 