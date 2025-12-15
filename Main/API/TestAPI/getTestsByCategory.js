import { mainLogger } from '../../loggerHub.js';
import { testRepository } from '../../BusinessLayer/DB/testRepository.js';
import { createApiLogger, logApiStart, logApiSuccess, logApiError } from '../../Logger/apiLogger.js';

// Create logger for module
const logger = createApiLogger('TestAPI:getTestsByCategory');

/**
 * Gets tests from specified category
 * @param {string} categoryName - Category name
 * @returns {Promise<Object>} - Operation result
 */
export async function getTestsByCategory(categoryName) {
  try {
    logApiStart(logger, 'getTestsByCategory', { categoryName });
    
    if (!categoryName) {
      logger.warn(`Category name not specified`);
      logApiError(logger, 'getTestsByCategory', new Error('Category name not specified'));
      return { success: false, error: 'Category name not specified' };
    }
    
    // Get tests from business layer
    const tests = testRepository.getTestsByCategory(categoryName);
    
    logger.info(`Got ${tests.length} tests for category ${categoryName}`);
    logApiSuccess(logger, 'getTestsByCategory');
    
    return { success: true, data: tests };
  } catch (error) {
    logApiError(logger, 'getTestsByCategory', error);
    return { success: false, error: error.message };
  }
} 
