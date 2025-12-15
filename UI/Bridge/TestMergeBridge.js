import { createLogger } from '../Utils/loggerService.js';

const logger = createLogger('UI/Bridge/TestMergeBridge');

/**
 * Bridge for test merge operations
 */
export class TestMergeBridge {
  /**
   * Calls test merge operation on Main process side
   * @param {Array<string>} testPaths - Array of test paths to merge
   * @returns {Promise<{success: boolean, fileName?: string, error?: string}>} - Operation result
   */
  async mergeTests(testPaths) {
    try {
      logger.debug(`Request to merge ${testPaths.length} tests`);

      if (!testPaths || !Array.isArray(testPaths) || testPaths.length < 2) {
        logger.warn('Not enough tests to merge (minimum 2)');
        return {
          success: false,
          error: 'Select at least 2 tests to merge'
        };
      }

      // Check test merge API availability
      if (!window.electron || !window.electron.tests || !window.electron.tests.merge) {
        logger.error('Test merge API not found in window.electron.tests.merge');
        return {
          success: false,
          error: 'Test merge API not available'
        };
      }

      // Call controller on Main side via IPC
      const result = await window.electron.tests.merge(testPaths);

      if (!result || !result.success) {
        logger.error(`Test merge error: ${result?.error || 'Unknown error'}`);
        return {
          success: false,
          error: result?.error || 'Unknown error during test merge'
        };
      }

      logger.success(`Tests successfully merged into file: ${result.fileName}`);
      return {
        success: true,
        fileName: result.fileName,
        path: result.path,
        questionsCount: result.questionsCount
      };
    } catch (error) {
      logger.error('Error in test merge bridge:', error);
      return {
        success: false,
        error: error.message || 'Unknown error'
      };
    }
  }
} 