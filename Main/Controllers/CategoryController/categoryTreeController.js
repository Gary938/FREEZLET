/**
 * Business logic controller for category tree
 * @module Main/Controllers/CategoryController/categoryTreeController
 */

import { getCategoryList } from '../../API/CategoryAPI/categoryList.js';
import { getLastCategory } from '../../API/CategoryAPI/lastCategoryApi.js';
import { buildCategoryTreeFromPaths } from '../../API/CategoryAPI/categoryTree.js';
import { mainLogger } from '../../loggerHub.js';

// Create logger for module
const logger = {
  info: (message) => mainLogger.info('Controllers:CategoryController:categoryTreeController', message),
  warn: (message) => mainLogger.warn('Controllers:CategoryController:categoryTreeController', message),
  error: (message, error) => mainLogger.error('Controllers:CategoryController:categoryTreeController', message, error),
  debug: (message) => mainLogger.debug('Controllers:CategoryController:categoryTreeController', message)
};

/**
 * Controller for category tree
 */
export const categoryTreeController = {
  /**
   * Gets category paths from DB and last selected category
   * @returns {Promise<{success: boolean, paths?: string[], currentCategory?: string, error?: string}>}
   */
  async getCategoryPaths() {
    try {
      logger.debug('Getting category paths');
      
      // Get category list from API
      const categoriesResult = await getCategoryList();
      
      if (!categoriesResult.success) {
        logger.error(`Error getting category list: ${categoriesResult.error}`);
        return { 
          success: false, 
          error: categoriesResult.error || 'Error getting category list' 
        };
      }
      
      // Get last active category (or adjacent if last was deleted)
      const lastCategoryResult = await getLastCategory();

      // Use found category or null if no categories
      const currentCategory = lastCategoryResult.success ? lastCategoryResult.path : null;
      
      logger.info(`Got ${categoriesResult.categories.length} categories, current: ${currentCategory}`);
      
      return {
        success: true,
        paths: categoriesResult.categories,
        currentCategory
      };
    } catch (error) {
      logger.error(`Error in getCategoryPaths`, error);
      return { 
        success: false, 
        error: error.message 
      };
    }
  },
  
  /**
   * Gets and prepares data for building category tree
   * @returns {Promise<{success: boolean, categoryTree?: Object, currentCategory?: string, error?: string}>}
   */
  async buildCategoryTreeData() {
    try {
      logger.info('Getting data for building category tree');
      
      // Get categories and current selected category
      const pathsResult = await this.getCategoryPaths();
      
      if (!pathsResult.success) {
        return pathsResult;
      }
      
      // Build tree from paths via API
      const treeResult = await buildCategoryTreeFromPaths(pathsResult.paths);
      
      if (!treeResult.success) {
        logger.error(`Tree building error: ${treeResult.error}`);
        return {
          success: false,
          error: treeResult.error,
          categoryTree: { name: 'Tests', fullPath: 'Tests', children: [] }
        };
      }
      
      // Get tree from result
      const categoryTree = treeResult.tree.length > 0 ? treeResult.tree[0] : { 
        name: 'Tests', 
        fullPath: 'Tests', 
        children: [] 
      };
      
      logger.info('Category tree data successfully retrieved');
      return {
        success: true,
        categoryTree,
        currentCategory: pathsResult.currentCategory
      };
    } catch (error) {
      logger.error(`Error in buildCategoryTreeData`, error);
      return {
        success: false,
        error: error.message,
        categoryTree: { name: 'Tests', fullPath: 'Tests', children: [] }
      };
    }
  }
}; 