/**
 * Controller for working with selected category
 * Follows six-layer project architecture
 * @module Main/Controllers/CategoryController/categorySelectController
 */

import { getLastCategory, setLastCategory } from '../../API/CategoryAPI/lastCategoryApi.js';
import { mainLogger } from '../../loggerHub.js';

// Create logger for module
const logger = {
  debug: (message) => mainLogger.debug('Controllers:CategoryController:categorySelectController', message),
  info: (message) => mainLogger.info('Controllers:CategoryController:categorySelectController', message),
  warn: (message) => mainLogger.warn('Controllers:CategoryController:categorySelectController', message),
  error: (message, error) => mainLogger.error('Controllers:CategoryController:categorySelectController', message, error),
  success: (message) => mainLogger.success('Controllers:CategoryController:categorySelectController', message)
};

/**
 * Controller for working with selected category
 */
export const categorySelectController = {
  /**
   * Gets last selected category
   * @returns {Promise<Object>} Operation result with category path
   */
  async getLastSelectedCategory() {
    try {
      logger.debug('Requesting last selected category');
      const result = await getLastCategory();
      
      if (result.success) {
        logger.info(`Got last selected category: ${result.path}`);
      } else {
        logger.warn('Last selected category not found');
      }
      
      return result;
    } catch (error) {
      logger.error('Error getting last selected category', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Sets selected category
   * @param {string} categoryPath - Path to category
   * @returns {Promise<Object>} Operation result
   */
  async selectCategory(categoryPath) {
    try {
      if (!categoryPath) {
        logger.warn('Attempt to select category with empty path');
        return { success: false, error: 'Category path cannot be empty' };
      }
      
      logger.debug(`Setting selected category: ${categoryPath}`);
      const result = await setLastCategory(categoryPath);
      
      if (result.success) {
        logger.info(`Category successfully selected: ${categoryPath}`);
      } else {
        logger.error(`Category selection error: ${result.error}`);
      }
      
      return result;
    } catch (error) {
      logger.error(`Error selecting category: ${error.message}`, error);
      return { success: false, error: error.message };
    }
  }
}; 