/**
 * UI Bridge for deleting categories
 * @module UI/Bridge/Category/categoryDeleteBridge
 */

import { createLogger } from '../../Utils/loggerService.js';

const logger = createLogger('UI/Bridge/Category/categoryDeleteBridge');

export const categoryDeleteBridge = {
  /**
   * Deletes a category
   * @param {string} categoryPath - Path to category
   * @returns {Promise<{success: boolean, error?: string}>}
   */
  async deleteCategory(categoryPath) {
    // Validate parameter
    if (!categoryPath || typeof categoryPath !== 'string' || categoryPath.trim() === '') {
      logger.warn('Invalid category path: empty or not a string');
      return { success: false, error: 'Invalid category path' };
    }

    try {
      logger.info(`Sending request to delete category: ${categoryPath}`);

      // Check electron API availability
      if (!window.electron || !window.electron.categories) {
        logger.error('Categories API not available');
        throw new Error('Categories API not available');
      }

      // Call IPC method to delete category via controller
      logger.debug(`Calling IPC method delete for ${categoryPath} via controller`);
      const result = await window.electron.categories.delete(categoryPath);

      if (result.success) {
        logger.info(`Category successfully deleted: ${categoryPath}`);
      } else {
        logger.warn(`Category deletion error: ${result.error}`);
      }

      return result;
    } catch (error) {
      logger.error(`Error calling IPC to delete category: ${error.message}`, error);
      return { success: false, error: error.message };
    }
  }
}; 