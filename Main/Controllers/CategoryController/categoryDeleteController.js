import { mainLogger } from '../../loggerHub.js';
import { deleteCategory as deleteCategoryAPI } from '../../API/CategoryAPI/categoryDelete.js';

// Create logger for module
const logger = {
  info: (message) => mainLogger.info('Controllers:CategoryController:categoryDeleteController', message),
  warn: (message) => mainLogger.warn('Controllers:CategoryController:categoryDeleteController', message),
  error: (message, error) => mainLogger.error('Controllers:CategoryController:categoryDeleteController', message, error),
  debug: (message) => mainLogger.debug('Controllers:CategoryController:categoryDeleteController', message)
};

/**
 * Checks if category is root
 * @param {string} categoryPath - Path to category
 * @returns {boolean} - true if category is root
 */
function isRootCategory(categoryPath) {
  // Only Tests/ category is considered root
  // All other categories can be deleted
  return !categoryPath || !categoryPath.includes('/') || categoryPath === 'Tests/' || categoryPath === 'Tests';
}

/**
 * Deletes category
 * @param {string} categoryPath - Path to category
 * @returns {Promise<Object>} - Operation result
 */
export async function deleteCategory(categoryPath) {
  try {
    logger.info(`Category deletion request: ${categoryPath}`);
    
    // Input validation
    if (!categoryPath || typeof categoryPath !== 'string') {
      logger.warn(`Invalid category path passed: ${categoryPath}`);
      return { success: false, error: 'Invalid category path' };
    }
    
    // Check if category is root
    if (isRootCategory(categoryPath)) {
      logger.warn(`Attempt to delete root category: ${categoryPath}`);
      return { success: false, error: 'Cannot delete root category' };
    }
    
    // Call API to delete category
    logger.debug(`Calling API to delete category: ${categoryPath}`);
    const result = await deleteCategoryAPI(categoryPath);
    
    if (result.success) {
      logger.info(`Category successfully deleted: ${categoryPath}`);
    } else {
      logger.error(`Category deletion error: ${result.error}`);
    }
    
    return result;
  } catch (error) {
    logger.error(`Exception deleting category: ${error.message}`, error);
    return { success: false, error: error.message };
  }
}

// Export controller
export const categoryDeleteController = {
  delete: deleteCategory
};

export default categoryDeleteController; 