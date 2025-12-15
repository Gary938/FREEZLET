import { createApiLogger, logApiStart, logApiSuccess, logApiError } from '../../Logger/apiLogger.js';
import { normalizeFolderPath } from '../../Utils/PathUtils/pathFormatUtils.js';

// Import business layer modules
import categoryRepository from '../../BusinessLayer/DB/categoryRepository.js';

// Create logger for module
const logger = createApiLogger('CategoryAPI:lastCategory');

/**
 * Sets last opened category
 * @param {string|Object} categoryPath - Category path or object with path
 * @returns {Promise<Object>} - Operation result
 */
export async function setLastCategory(categoryPath) {
  try {
    logApiStart(logger, 'setLastCategory', { categoryPath });
    
    // 1. Extract path string if object passed
    let pathToUse = categoryPath;
    
    // Check if input parameter is object with path field
    if (categoryPath && typeof categoryPath === 'object' && categoryPath.path) {
      pathToUse = categoryPath.path;
      logger.info(`Received object instead of string, extracting path: ${pathToUse}`);
    }
    
    // 2. Check that path is specified
    if (!pathToUse) {
      logger.warn('Category path not specified');
      return { success: false, error: 'Category path not specified' };
    }
    
    // 3. Normalize path
    const normalizedPath = normalizeFolderPath(pathToUse);
    
    if (!normalizedPath) {
      logger.warn(`Invalid category path: ${pathToUse}`);
      return { success: false, error: 'Invalid category path' };
    }
    
    // 4. Save last category via business layer
    const result = categoryRepository.setLastCategory(normalizedPath);
    
    if (!result.success) {
      logger.error(`Error saving last category: ${result.error}`);
      return { success: false, error: result.error };
    }
    
    logger.info(`Last category set: ${normalizedPath}`);
    logApiSuccess(logger, 'setLastCategory');
    
    return { success: true };
  } catch (error) {
    logApiError(logger, 'setLastCategory', error);
    return { success: false, error: error.message };
  }
}

/**
 * Gets last opened category
 * @returns {Promise<Object>} - Operation result with last category path
 */
export async function getLastCategory() {
  try {
    logApiStart(logger, 'getLastCategory');

    // Get last category via business layer
    const result = categoryRepository.getLastCategory();

    if (!result.success || !result.categoryPath) {
      // Category not found or was deleted - look for adjacent
      logger.info('Last category does not exist, looking for adjacent');

      const adjacentResult = categoryRepository.getAdjacentCategory(result.categoryPath || '');

      if (adjacentResult.success && adjacentResult.categoryPath) {
        logger.info(`Adjacent category found: ${adjacentResult.categoryPath}`);
        logApiSuccess(logger, 'getLastCategory');
        return { success: true, path: adjacentResult.categoryPath };
      }

      // No adjacent category - return null
      logger.warn('Adjacent category not found, no categories');
      logApiSuccess(logger, 'getLastCategory');
      return { success: true, path: null };
    }

    logger.info(`Got last category: ${result.categoryPath}`);
    logApiSuccess(logger, 'getLastCategory');

    return { success: true, path: result.categoryPath };
  } catch (error) {
    // Handle error
    logApiError(logger, 'getLastCategory', error);
    logger.warn('Error getting last category');
    return { success: false, error: error.message, path: null };
  }
}

export default {
  setLastCategory,
  getLastCategory
}; 