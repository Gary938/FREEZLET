import { mainLogger } from '../../loggerHub.js';
import { 
  createApiLogger, 
  logApiStart, 
  logApiSuccess, 
  logApiError 
} from '../../Logger/apiLogger.js';
import categoryListOperations from '../../BusinessLayer/DB/categoryListOperations.js';

// Create logger for module
const logger = createApiLogger('CategoryAPI:categoryList');

/**
 * Gets list of all categories
 * @returns {Promise<Object>} - Object with operation result and categories array
 */
export async function getCategoryList() {
  try {
    // Log operation start
    logApiStart(logger, 'getCategoryList');
    
    // Get data from business layer
    const result = categoryListOperations.getCategoryList();
    
    if (!result.success) {
      logApiError(logger, 'getCategoryList', new Error(result.error));
      return result;
    }
    
    // Log successful operation completion
    logApiSuccess(logger, 'getCategoryList');
    return result;
  } catch (error) {
    logApiError(logger, 'getCategoryList', error);
    return { success: false, categories: [], error: error.message };
  }
}

export default {
  getCategoryList
}; 
