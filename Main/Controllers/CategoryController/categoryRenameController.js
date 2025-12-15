import { mainLogger } from '../../loggerHub.js';
import { renameCategory as renameCategoryAPI } from '../../API/CategoryAPI/categoryRename.js';
import { setLastCategory, getLastCategory } from '../../API/CategoryAPI/lastCategoryApi.js';

// Create logger for module
const logger = {
  info: (message) => mainLogger.info('Controllers:CategoryController:categoryRenameController', message),
  warn: (message) => mainLogger.warn('Controllers:CategoryController:categoryRenameController', message),
  error: (message, error) => mainLogger.error('Controllers:CategoryController:categoryRenameController', message, error),
  debug: (message) => mainLogger.debug('Controllers:CategoryController:categoryRenameController', message)
};

/**
 * Checks if category is root
 * @param {string} categoryPath - Path to category
 * @returns {boolean} - true if category is root
 */
function isRootCategory(categoryPath) {
  // Only Tests/ category is considered root
  // All other categories can be renamed
  return !categoryPath || !categoryPath.includes('/') || categoryPath === 'Tests/' || categoryPath === 'Tests';
}

/**
 * Get category name from path
 * @param {string} categoryPath - Path to category
 * @returns {string} - Category name
 */
function getCategoryNameFromPath(categoryPath) {
  if (!categoryPath) return '';
  const parts = categoryPath.split('/');
  return parts[parts.length - 1] || parts[parts.length - 2] || '';
}

/**
 * Get parent category path
 * @param {string} categoryPath - Path to category
 * @returns {string} - Parent path
 */
function getParentPath(categoryPath) {
  if (!categoryPath || !categoryPath.includes('/')) return '';
  const parts = categoryPath.split('/');
  parts.pop(); // Remove last element (category name)
  return parts.join('/');
}

/**
 * Renames category
 * @param {string} categoryPath - Path to category
 * @param {string} newName - New category name
 * @returns {Promise<Object>} - Operation result
 */
export async function renameCategory(categoryPath, newName) {
  try {
    logger.info(`Category rename request: ${categoryPath} -> ${newName}`);
    
    // Input validation
    if (!categoryPath || typeof categoryPath !== 'string') {
      logger.warn(`Invalid category path passed: ${categoryPath}`);
      return { success: false, error: 'Invalid category path' };
    }
    
    if (!newName || typeof newName !== 'string' || !newName.trim()) {
      logger.warn(`Invalid new name passed: ${newName}`);
      return { success: false, error: 'New category name cannot be empty' };
    }
    
    // Check if category is root
    if (isRootCategory(categoryPath)) {
      logger.warn(`Attempt to rename root category: ${categoryPath}`);
      return { success: false, error: 'Cannot rename root category' };
    }
    
    // Get current category name from path
    const currentName = getCategoryNameFromPath(categoryPath);
    
    // If new name matches current, return error
    if (currentName === newName.trim()) {
      logger.warn(`New name matches current: ${currentName}`);
      return { success: false, error: 'New name matches current' };
    }
    
    // Call API to rename category
    // Pass oldName and newName, where oldName is full path,
    // and newName is full new path (preserving parent path)
    logger.debug(`Calling API to rename category: ${categoryPath} -> ${newName}`);
    
    // Get parent path
    const parentPath = getParentPath(categoryPath);
    const newFullName = parentPath ? `${parentPath}/${newName.trim()}` : newName.trim();
    
    // Call API with correct parameters
    const result = await renameCategoryAPI(categoryPath, newFullName);

    if (result.success) {
      logger.info(`Category successfully renamed: ${categoryPath} -> ${newFullName}`);

      // Update lastSelectedCategory if renamed category was last selected
      try {
        const lastCategory = await getLastCategory();
        if (lastCategory.success && lastCategory.path) {
          // Check if path matches or starts with renamed path
          if (lastCategory.path === categoryPath || lastCategory.path.startsWith(categoryPath + '/')) {
            const newPath = lastCategory.path.replace(categoryPath, newFullName);
            await setLastCategory(newPath);
            logger.info(`Updated last selected category: ${lastCategory.path} -> ${newPath}`);
          }
        }
      } catch (error) {
        logger.warn(`Failed to update lastSelectedCategory: ${error.message}`);
      }
    } else {
      logger.error(`Category rename error: ${result.error}`);
    }

    return result;
  } catch (error) {
    logger.error(`Exception renaming category: ${error.message}`, error);
    return { success: false, error: error.message };
  }
}

// Export controller
export const categoryRenameController = {
  rename: renameCategory
};

export default categoryRenameController; 