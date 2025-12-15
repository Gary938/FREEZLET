/**
 * UI Bridge for working with last selected category
 * @module UI/Bridge/Category/categoryLastSelectedBridge
 */

import { createLogger } from '../../Utils/loggerService.js';

const logger = createLogger('UI/Bridge/Category/categoryLastSelectedBridge');

export const categoryLastSelectedBridge = {
  /**
   * Gets the last selected category
   * @returns {Promise<{success: boolean, path?: string, error?: string}>}
   */
  async getLastSelectedCategory() {
    try {
      logger.debug('Requesting last selected category');

      // Check electron API availability
      if (!window.electron || !window.electron.categories) {
        logger.error('Categories API not available');
        throw new Error('Categories API not available');
      }

      // Call IPC method to get last selected category
      logger.debug('Calling IPC method getLastSelected via controller');
      const result = await window.electron.categories.getLastSelected();

      if (result.success) {
        logger.info(`Got last selected category: ${result.path}`);
      } else {
        logger.warn(`Error getting last selected category: ${result.error}`);
      }

      return result;
    } catch (error) {
      logger.error(`Error calling IPC to get selected category: ${error.message}`, error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Sets the current selected category
   * @param {string} categoryPath - Path to category
   * @returns {Promise<{success: boolean, error?: string}>}
   */
  async selectCategory(categoryPath) {
    try {
      logger.info(`Sending request to set selected category: ${categoryPath}`);

      // Check electron API availability
      if (!window.electron || !window.electron.categories) {
        logger.error('Categories API not available');
        throw new Error('Categories API not available');
      }

      // Call IPC method to set selected category
      logger.debug(`Calling IPC method selectCategory for ${categoryPath} via controller`);
      const result = await window.electron.categories.selectCategory(categoryPath);

      if (result.success) {
        logger.info(`Category successfully selected: ${categoryPath}`);
      } else {
        logger.warn(`Category selection error: ${result.error}`);
      }

      return result;
    } catch (error) {
      logger.error(`Error calling IPC to select category: ${error.message}`, error);
      return { success: false, error: error.message };
    }
  }
}; 