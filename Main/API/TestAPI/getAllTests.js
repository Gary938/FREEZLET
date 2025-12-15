import { createApiLogger, logApiStart, logApiSuccess, logApiError } from '../../Logger/apiLogger.js';
import { testRepository } from '../../BusinessLayer/DB/testRepository.js';

// Create logger for module
const logger = createApiLogger('TestAPI:getAllTests');

/**
 * Gets all tests from database
 * @param {Object} options - Request parameters
 * @param {boolean} options.excludePlaceholders - Whether to exclude placeholders from results (default false)
 * @param {string} options.orderBy - Sort field (default 'name')
 * @returns {Promise<Object>} - Operation result
 */
export async function getAllTests(options = {}) {
  try {
    // Log operation start
    logApiStart(logger, 'getAllTests', options);
    
    // Get all tests from repository
    const tests = testRepository.getAllTests(options);
    
    // Log successful completion
    logger.info(`Got ${tests.length} tests from database`);
    logApiSuccess(logger, 'getAllTests');
    
    return { success: true, data: tests };
  } catch (error) {
    // Log error
    logApiError(logger, 'getAllTests', error);
    return { success: false, error: error.message };
  }
} 