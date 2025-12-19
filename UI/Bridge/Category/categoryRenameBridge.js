/**
 * UI Bridge for renaming categories
 * @module UI/Bridge/Category/categoryRenameBridge
 */

import { createLogger } from '../../Utils/loggerService.js';

const logger = createLogger('UI/Bridge/Category/categoryRenameBridge');

export const categoryRenameBridge = {
  /**
   * Renames a category (works for any nesting level)
   * @param {string} categoryPath - Path to category
   * @param {string} newName - New category name
   * @returns {Promise<{success: boolean, error?: string}>}
   */
  async renameCategory(categoryPath, newName) {
    // Validate parameters
    if (!categoryPath || typeof categoryPath !== 'string' || categoryPath.trim() === '') {
      logger.warn('Invalid category path: empty or not a string');
      return { success: false, error: 'Invalid category path' };
    }
    if (!newName || typeof newName !== 'string' || newName.trim() === '') {
      logger.warn('Invalid new name: empty or not a string');
      return { success: false, error: 'Invalid new name' };
    }

    try {
      logger.info(`Sending request to rename category: ${categoryPath} -> ${newName}`);

      // Check electron API availability
      if (!window.electron || !window.electron.categories) {
        logger.error('Categories API not available');
        throw new Error('Categories API not available');
      }

      // Call IPC method to rename category via controller
      logger.debug(`Calling IPC method rename for ${categoryPath} -> ${newName} via controller`);
      const result = await window.electron.categories.rename(categoryPath, newName);

      if (result.success) {
        logger.info(`Category successfully renamed: ${categoryPath} -> ${newName}`);
      } else {
        logger.warn(`Category rename error: ${result.error}`);
      }

      return result;
    } catch (error) {
      logger.error(`Error calling IPC to rename category: ${error.message}`, error);
      return { success: false, error: error.message };
    }
  }
}; 