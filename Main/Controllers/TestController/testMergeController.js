// Main/Controllers/TestController/testMergeController.js
import { mergeTests } from '../../API/TestAPI/testMerge.js';
import { mainLogger } from '../../loggerHub.js';

const logger = {
  info: (message) => mainLogger.info('Controllers:TestController:testMergeController', message),
  warn: (message) => mainLogger.warn('Controllers:TestController:testMergeController', message),
  error: (message, error) => mainLogger.error('Controllers:TestController:testMergeController', message, error),
  debug: (message) => mainLogger.debug('Controllers:TestController:testMergeController', message),
  success: (message) => mainLogger.success('Controllers:TestController:testMergeController', message)
};

/**
 * Test merge controller
 */
export const testMergeController = {
  /**
   * Merges multiple tests into one
   * @param {Array<string>} testPaths - Array of test paths to merge
   * @returns {Promise<{success: boolean, fileName?: string, error?: string}>} - Operation result
   */
  async merge(testPaths) {
    try {
      logger.info(`Request to merge ${testPaths.length} tests`);
      
      // Validate input data
      if (!testPaths || !Array.isArray(testPaths) || testPaths.length < 2) {
        logger.warn('Not enough tests to merge (minimum 2)');
        return { 
          success: false, 
          error: 'Minimum 2 tests required for merge' 
        };
      }
      
      // Generate filename for merged test
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const outputFileName = `merged_${timestamp}.txt`;
      
      // Call API to merge tests
      const result = await mergeTests(testPaths, outputFileName);
      
      if (!result.success) {
        logger.error(`Error merging tests: ${result.error}`);
        return { 
          success: false, 
          error: result.error 
        };
      }
      
      logger.success(`Tests successfully merged into file: ${result.path}`);
      return {
        success: true,
        fileName: outputFileName,
        path: result.path,
        questionsCount: result.questionsCount
      };
    } catch (error) {
      logger.error('Error in test merge controller:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}; 