import { createCategory, createSubcategory } from '../../API/CategoryAPI/categoryCreate.js';
import { mainLogger } from '../../loggerHub.js';

const logger = {
  info: (message) => mainLogger.info('Controllers:CategoryController:categoryCreateController', message),
  warn: (message) => mainLogger.warn('Controllers:CategoryController:categoryCreateController', message),
  error: (message, error) => mainLogger.error('Controllers:CategoryController:categoryCreateController', message, error),
  debug: (message) => mainLogger.debug('Controllers:CategoryController:categoryCreateController', message)
};

/**
 * Category creation controller
 */
export const categoryCreateController = {
  /**
   * Handles request to create new category
   * @param {string} categoryName - New category name
   * @returns {Promise<Object>} - Operation result
   */
  async create(categoryName) {
    try {
      logger.info(`Processing category creation request: ${categoryName}`);
      
      // Basic category name validation
      if (!categoryName || typeof categoryName !== 'string' || !categoryName.trim()) {
        logger.warn('Received empty or invalid category name');
        return { success: false, error: 'Category name cannot be empty' };
      }
      
      // Call API to create category
      const result = await createCategory(categoryName.trim());
      
      if (result.success) {
        logger.info(`Category successfully created: ${result.path}`);
      } else {
        logger.warn(`Category creation error: ${result.error}`);
      }
      
      return result;
    } catch (error) {
      logger.error(`Unexpected error creating category`, error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Handles request to create subcategory
   * @param {string} parentCategory - Path to parent category
   * @param {string} subcategoryName - New subcategory name
   * @returns {Promise<Object>} - Operation result
   */
  async createSub(parentCategory, subcategoryName) {
    try {
      logger.info(`Processing subcategory creation request: ${subcategoryName} in ${parentCategory}`);
      
      // Basic validation
      if (!parentCategory || typeof parentCategory !== 'string') {
        logger.warn('Invalid parent category path received');
        return { success: false, error: 'Invalid parent category path' };
      }
      
      if (!subcategoryName || typeof subcategoryName !== 'string' || !subcategoryName.trim()) {
        logger.warn('Empty or invalid subcategory name received');
        return { success: false, error: 'Subcategory name cannot be empty' };
      }
      
      // Normalize parent path if necessary
      const normalizedParentPath = parentCategory.endsWith('/') 
        ? parentCategory 
        : `${parentCategory}/`;
      
      // Call API to create subcategory
      const result = await createSubcategory(normalizedParentPath, subcategoryName.trim());
      
      if (result.success) {
        logger.info(`Subcategory successfully created: ${result.path}`);
      } else {
        logger.warn(`Subcategory creation error: ${result.error}`);
      }
      
      return result;
    } catch (error) {
      logger.error(`Unexpected error creating subcategory`, error);
      return { success: false, error: error.message };
    }
  }
}; 