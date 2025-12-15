/**
 * Controller for deleting categories
 * @module UI/Controllers/Category/categoryDeleteController
 */

import { createLogger } from '../../Utils/loggerService.js';
import { modalService } from '../Modal/modalService.js';
import { categoryBridge } from '../../Bridge/Category/index.js';
import { uiEventDispatcher } from '../uiEventDispatcher.js';
import { t } from '@UI/i18n/index.js';

// Create logger for module
const logger = createLogger('UI/Controllers/Category/Delete');

/**
 * Deletes a category
 * @param {string} categoryPath - Path to category
 * @returns {Promise<Object>} - Operation result
 */
export async function deleteCategory(categoryPath) {
  try {
    logger.info(`Category deletion request: ${categoryPath}`);

    // Input validation
    if (!categoryPath) {
      logger.warn('Category path not specified');
      return { success: false, error: 'Category path is not specified' };
    }

    // Extract category name from path for modal display
    const categoryName = categoryPath.split('/').pop() || categoryPath;

    // Show confirmation dialog
    const confirmed = await modalService.confirm(
      `Do you really want to delete the category "${categoryName}"?`,
      t('category.deleteConfirm'),
      t('category.delete'),
      t('modal.cancel')
    );

    // If user cancelled the operation
    if (!confirmed) {
      logger.info(`Category deletion "${categoryPath}" cancelled by user`);
      return { success: false, canceled: true };
    }

    // Call bridge to delete category
    logger.debug(`Calling API through bridge to delete category: ${categoryPath}`);
    const result = await categoryBridge.deleteCategory(categoryPath);

    // Process result
    if (result.success) {
      logger.info(`Category deleted successfully: ${categoryPath}`);

      // Delay before dispatching event to ensure backend completed operations
      await new Promise(resolve => setTimeout(resolve, 300));

      // Dispatch category deleted event through dispatcher
      uiEventDispatcher.dispatch(uiEventDispatcher.events.CATEGORY_DELETED, {
        path: categoryPath,
        timestamp: Date.now()
      });

      // Dispatch category tree updated event
      uiEventDispatcher.dispatch(uiEventDispatcher.events.CATEGORY_TREE_UPDATED, {
        timestamp: Date.now(),
        source: 'categoryDeleteController'
      });
    } else {
      // Show error message
      logger.error(`Category deletion error: ${result.error}`);
      await modalService.alert(
        `Failed to delete category: ${result.error}`,
        t('category.deleteError')
      );
    }

    return result;
  } catch (error) {
    logger.error('Error deleting category', error);
    await modalService.alert(
      `An error occurred: ${error.message}`,
      t('error.title')
    );
    return { success: false, error: error.message };
  }
}

// Export public functions
export const categoryDeleteController = {
  deleteCategory
};

export default categoryDeleteController; 