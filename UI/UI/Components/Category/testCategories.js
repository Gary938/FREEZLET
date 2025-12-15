/**
 * Module for connecting and initializing category tree
 * @module UI/UI/Components/Category/testCategories
 */

import { CategoryTree } from './CategoryTree.js';
import { CreateCategoryButton } from './CreateCategory.js';
import { createLogger } from '../../../Utils/loggerService.js';

// Create logger for module
const logger = createLogger('UI/Components/Category/testCategories');

/**
 * Initializes category tree and category creation button
 */
export async function initializeCategoryComponents() {
  try {
    logger.debug('Initializing category components');

    // Find container for category tree
    const folderListContainer = document.getElementById('folderList');
    const categoriesContainer = document.getElementById('categories');

    if (!folderListContainer || !categoriesContainer) {
      logger.error('Category tree containers not found');
      return;
    }

    // Initialize category creation button
    const createCategoryButton = new CreateCategoryButton(folderListContainer);
    createCategoryButton.initialize();

    // Initialize category tree
    const categoryTree = new CategoryTree(categoriesContainer);
    // init method is called automatically in constructor
    // No additional method calls required

    logger.info('Category components successfully initialized');
  } catch (error) {
    logger.error(`Error initializing category components: ${error.message}`);
  }
}

// Export initialization function
export default { initializeCategoryComponents };
