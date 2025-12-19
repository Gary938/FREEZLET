import { createApiLogger, logApiStart, logApiSuccess, logApiError } from '../../Logger/apiLogger.js';
import {
  getCategoryPath,
  categoryExistsInDB,
  isValidCategoryName
} from '../../Utils/pathUtils.js';

// Import business layer
import categoryRenameOperationsDB from '../../BusinessLayer/DB/categoryRenameOperations.js';
import categoryRenameOperationsFS from '../../BusinessLayer/FileSystem/categoryRenameOperations.js';

// Create logger for module
const logger = createApiLogger('CategoryAPI:rename');

/**
 * Renames category in database and file system
 * @param {string} oldName - Current category name
 * @param {string} newName - New category name
 * @returns {Promise<Object>} - Operation result
 */
export async function renameCategory(oldName, newName) {
  try {
    logApiStart(logger, 'renameCategory', { oldName, newName });
    
    // Check for path traversal in full path
    if (newName.includes('..') || oldName.includes('..')) {
      return { success: false, error: 'Invalid category name: contains ".."' };
    }

    // Extract only category name from full path for validation
    const newNameOnly = newName.includes('/') ?
      newName.split('/').pop() : // Take only last part of path
      newName;

    // 1. Validate new category name (name only, no path)
    if (!isValidCategoryName(newNameOnly)) {
      return { success: false, error: `Invalid category name: ${newNameOnly}` };
    }
    
    // 2. Form paths for old and new category (path handling at API level)
    const oldCategoryPath = getCategoryPath(oldName);
    const newCategoryPath = getCategoryPath(newName);
    
    // 3. Check old category existence in DB
    if (!categoryExistsInDB(oldName)) {
      logger.error(`Category ${oldName} does not exist in DB`);
      return { success: false, error: `Category ${oldName} does not exist` };
    }
    
    // 4. Check that new name differs from old
    if (oldName === newName) {
      return { success: false, error: 'Old and new category names are the same' };
    }
    
    // 5. Check that category with new name doesn't exist in DB
    if (categoryExistsInDB(newName)) {
      return { success: false, error: `Category ${newName} already exists` };
    }
    
    // 6. FIRST update records in DB
    const dbResult = await categoryRenameOperationsDB.updateCategoryPathsInDB(oldCategoryPath, newCategoryPath);
    
    if (!dbResult.success) {
      logger.error(`Error updating paths in database: ${dbResult.error}`);
      return { success: false, error: `Database update error: ${dbResult.error}` };
    }
    
    logger.info(`✅ Paths updated in database: ${oldCategoryPath} -> ${newCategoryPath}`);
    
    // 7. THEN rename directory in file system
    try {
      const fsResult = await categoryRenameOperationsFS.renameDirectory(oldCategoryPath, newCategoryPath);
      
      if (!fsResult.success) {
        logger.warn(`⚠️ Directory was not renamed: ${fsResult.error}. Operation partially successful.`);
      } else {
        logger.info(`✅ Category physically renamed: ${oldCategoryPath} -> ${newCategoryPath}`);
      }
    } catch (fsError) {
      // Only log file system error, doesn't affect operation success
      logger.error(`❌ Directory rename error: ${fsError.message}`);
    }
    
    logApiSuccess(logger, 'renameCategory', { oldName, newName });
    return { success: true };
  } catch (error) {
    logApiError(logger, 'renameCategory', error);
    return { success: false, error: error.message };
  }
}

// Export only API functions
export default {
  renameCategory
}; 
