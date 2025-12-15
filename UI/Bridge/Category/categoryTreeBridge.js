/**
 * UI Bridge for category tree
 * Provides interaction between UI controller and Main process
 * @module UI/Bridge/Category/categoryTreeBridge
 */

import { createLogger } from '../../Utils/loggerService.js';

// Create logger for module
const logger = createLogger('UI/Bridge/Category/categoryTreeBridge');

/**
 * Bridge for working with category tree
 */
export const categoryTreeBridge = {
  /**
   * Gets data for building category tree from business controller
   * @returns {Promise<{success: boolean, categoryTree?: Object, currentCategory?: string, error?: string}>}
   */
  async getCategoryTreeData() {
    try {
      logger.debug('Requesting category tree data via IPC');

      // Check API availability
      if (!window.electron || !window.electron.categories) {
        throw new Error('Categories API not available');
      }

      // Call IPC method via unified API
      const result = await window.electron.categories.getTreeData();

      logger.debug(`Received IPC response: success=${result.success}`);

      // Return result without modifications
      return result;
    } catch (error) {
      logger.error(`Error in getCategoryTreeData`, error);
      // Return error object with fallback empty tree
      return {
        success: false,
        error: error.message,
        categoryTree: { name: 'Tests', fullPath: 'Tests', children: [] }
      };
    }
  },

  /**
   * Gets category paths from business controller
   * @returns {Promise<{success: boolean, paths?: string[], currentCategory?: string, error?: string}>}
   */
  async getCategoryPaths() {
    try {
      logger.debug('Requesting category paths via IPC');

      // Check API availability
      if (!window.electron || !window.electron.categories) {
        throw new Error('Categories API not available');
      }

      // Call IPC method via unified API
      const result = await window.electron.categories.getTreePaths();

      logger.debug(`Received IPC response: success=${result.success}, paths=${result.paths?.length || 0}`);

      // Return result without modifications
      return result;
    } catch (error) {
      logger.error(`Error in getCategoryPaths`, error);
      // Return error object
      return {
        success: false,
        error: error.message
      };
    }
  }
}; 