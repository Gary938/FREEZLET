import { mainLogger } from '../../loggerHub.js';
import { createApiLogger, logApiStart, logApiSuccess, logApiError } from '../../Logger/apiLogger.js';
import { getCategoryPath } from '../../Utils/pathUtils.js';

// Import business layer modules
import categoryRepository from '../../BusinessLayer/DB/categoryRepository.js';
import categoryFsOperations from '../../BusinessLayer/FileSystem/categoryFsOperations.js';

// Create logger for module
const logger = createApiLogger('CategoryAPI:delete');

/**
 * Deletes category from DB and file system
 * @param {string} categoryName - Category name
 * @returns {Promise<Object>} - Operation result
 */
export async function deleteCategory(categoryName) {
  try {
    logApiStart(logger, 'deleteCategory', { categoryName });
    
    // Input validation
    if (!categoryName || typeof categoryName !== 'string') {
      logger.warn(`Invalid category name passed: ${categoryName}`);
      return { success: false, error: 'Invalid category name' };
    }
    
    // Form full path to category
    const categoryPath = getCategoryPath(categoryName);
    
    // Delete records from DB
    const dbResult = categoryRepository.cleanupCategoryPath(categoryPath);
    
    if (!dbResult.success) {
      logger.error(`Error deleting category from DB: ${dbResult.error}`);
      return { success: false, error: dbResult.error };
    }
    
    logger.info(`Category deleted from DB: ${categoryPath}`);
    
    // Delete category directory
    const fsResult = await categoryFsOperations.deleteDirectory(categoryPath);
    
    if (!fsResult.success) {
      logger.error(`Error deleting category directory: ${fsResult.error}`);
      return { success: false, error: fsResult.error };
    }
    
    logger.info(`Category directory deleted: ${categoryPath}`);
    
    logApiSuccess(logger, 'deleteCategory');
    return { success: true };
  } catch (error) {
    logApiError(logger, 'deleteCategory', error);
    return { success: false, error: error.message };
  }
} 
