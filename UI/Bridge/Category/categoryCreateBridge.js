/**
 * UI Bridge for creating categories
 * @module UI/Bridge/Category/categoryCreateBridge
 */

import { createLogger } from '../../Utils/loggerService.js';

const logger = createLogger('UI/Bridge/Category/categoryCreateBridge');

export const categoryCreateBridge = {
  /**
   * Creates a new top-level category
   * @param {string} categoryName - New category name
   * @returns {Promise<{success: boolean, path?: string, error?: string}>}
   */
  async createCategory(categoryName) {
    // Validate parameter
    if (!categoryName || typeof categoryName !== 'string' || categoryName.trim() === '') {
      logger.warn('Invalid category name: empty or not a string');
      return { success: false, error: 'Invalid category name' };
    }

    try {
      logger.info(`Sending request to create category: ${categoryName}`);

      // Check electron API availability
      if (!window.electron || !window.electron.categories) {
        logger.error('Categories API not available');
        throw new Error('Categories API not available');
      }

      // Call IPC method to create category via controller
      logger.debug(`Calling IPC method create for ${categoryName} via controller`);
      const result = await window.electron.categories.create(categoryName);

      if (result.success) {
        logger.info(`Category successfully created: ${result.path}`);
      } else {
        logger.warn(`Category creation error: ${result.error}`);
      }

      return result;
    } catch (error) {
      logger.error(`Error calling IPC to create category: ${error.message}`, error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Creates a new subcategory
   * @param {string} parentCategory - Path to parent category
   * @param {string} subcategoryName - New subcategory name
   * @returns {Promise<{success: boolean, path?: string, error?: string}>}
   */
  async createSubcategory(parentCategory, subcategoryName) {
    // Validate parameters
    if (!parentCategory || typeof parentCategory !== 'string' || parentCategory.trim() === '') {
      logger.warn('Invalid parent category: empty or not a string');
      return { success: false, error: 'Invalid parent category' };
    }
    if (!subcategoryName || typeof subcategoryName !== 'string' || subcategoryName.trim() === '') {
      logger.warn('Invalid subcategory name: empty or not a string');
      return { success: false, error: 'Invalid subcategory name' };
    }

    try {
      logger.info(`Sending request to create subcategory: ${subcategoryName} in ${parentCategory}`);

      // Check electron API availability
      if (!window.electron || !window.electron.categories) {
        logger.error('Categories API not available');
        throw new Error('Categories API not available');
      }

      // Call IPC method to create subcategory via controller
      logger.debug(`Calling IPC method createSub for ${subcategoryName} in ${parentCategory} via controller`);
      const result = await window.electron.categories.createSub(parentCategory, subcategoryName);

      if (result.success) {
        logger.info(`Subcategory successfully created: ${result.path}`);
      } else {
        logger.warn(`Subcategory creation error: ${result.error}`);
      }

      return result;
    } catch (error) {
      logger.error(`Error calling IPC to create subcategory: ${error.message}`, error);
      return { success: false, error: error.message };
    }
  }
}; 