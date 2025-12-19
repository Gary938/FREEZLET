/**
 * UI controller for creating categories
 * @module UI/Controllers/Category/categoryCreateController
 */

import { modalService } from '../Modal/modalService.js';
import { createLogger } from '../../Utils/loggerService.js';
import { categoryBridge } from '../../Bridge/Category/index.js';
import { uiEventDispatcher } from '../uiEventDispatcher.js';
import { t } from '@UI/i18n/index.js';
import categorySelectController from './categorySelectController.js';

const logger = createLogger('UI/Category/CreateController');

/**
 * Initializes category creation controller
 */
export function initCategoryCreateController() {
  try {
    logger.info('Initializing category creation controller');

    // Initialization actions can be performed here

    logger.info('Category creation controller initialized');
  } catch (error) {
    logger.error('Error initializing category creation controller', error);
  }
}

/**
 * Handles click on "Create Category" button
 * @returns {Promise<Object>} - Operation result
 */
export async function handleCreateCategoryClick() {
  try {
    logger.info('Processing "Create Category" button click');

    // Request name via modal window
    const name = await modalService.prompt(
      t('category.create'),
      t('category.enterName'),
      t('modal.ok'),
      t('modal.cancel')
    );

    // If name is not specified or user clicked "Cancel", exit
    if (!name) {
      logger.info('User cancelled category creation');
      return { success: false, canceled: true };
    }

    // Log entered name
    logger.info(`User entered category name: ${name}`);

    // Trim whitespace
    const trimmedName = name.trim();

    // Check categoryBridge availability
    logger.debug('Checking categoryBridge availability', categoryBridge);

    // Call API through bridge
    logger.info(`Calling API through bridge to create category: ${trimmedName}`);
    const result = await categoryBridge.createCategory(trimmedName);
    logger.debug('Category creation result:', result);

    // If creation successful, dispatch category created event
    if (result.success) {
      logger.info('Category created successfully, dispatching event');

      // Delay before dispatching event to ensure backend completed operations
      await new Promise(resolve => setTimeout(resolve, 300));

      // Dispatch category created event through dispatcher
      uiEventDispatcher.dispatch(uiEventDispatcher.events.CATEGORY_CREATED, {
        path: result.path,
        name: trimmedName,
        timestamp: Date.now()
      });

      // Dispatch category tree updated event
      uiEventDispatcher.dispatch(uiEventDispatcher.events.CATEGORY_TREE_UPDATED, {
        timestamp: Date.now(),
        source: 'categoryCreateController'
      });

      // Auto-select the newly created category
      try {
        logger.info(`Auto-selecting new category: ${result.path}`);
        await categorySelectController.handleCategorySelect(result.path);
      } catch (selectError) {
        logger.error('Error selecting new category', selectError);
      }
    } else {
      // Show error message
      logger.error(`Category creation error: ${result.error}`);
      await modalService.alert(
        `Failed to create category: ${result.error}`,
        t('category.deleteError')
      );
    }

    return result;
  } catch (error) {
    logger.error('Error processing category creation', error);
    await modalService.alert(
      `An error occurred: ${error.message}`,
      t('error.title')
    );
    return { success: false, error: error.message };
  }
}

/**
 * Handles click on "Create Subcategory" context menu item
 * @param {string} parentCategory - Path to parent category
 * @returns {Promise<Object>} - Operation result
 */
export async function handleCreateSubcategoryClick(parentCategory) {
  try {
    logger.info(`Processing subcategory creation for ${parentCategory}`);

    // Check that parent category exists
    if (!parentCategory) {
      logger.error('Parent category not specified');
      return { success: false, error: 'Parent category is not specified' };
    }

    // Request name via modal window
    const name = await modalService.prompt(
      t('category.create'),
      t('category.enterName'),
      t('modal.ok'),
      t('modal.cancel')
    );

    // If name is not specified or user clicked "Cancel", exit
    if (!name) {
      logger.info('User cancelled subcategory creation');
      return { success: false, canceled: true };
    }

    // Log entered name
    logger.info(`User entered subcategory name: ${name}`);

    // Parent category parameters
    logger.debug('Parent category parameters:', { parentCategory });

    // Trim whitespace
    const trimmedName = name.trim();

    // Create subcategory through bridge
    logger.info(`Calling API through bridge to create subcategory: ${trimmedName} in ${parentCategory}`);
    const result = await categoryBridge.createSubcategory(parentCategory, trimmedName);
    logger.debug('Subcategory creation result:', result);

    // If creation successful, dispatch subcategory created event
    if (result.success) {
      logger.info('Subcategory created successfully, dispatching event');

      // Delay before dispatching event to ensure backend completed operations
      await new Promise(resolve => setTimeout(resolve, 300));

      // Dispatch subcategory created event through dispatcher
      uiEventDispatcher.dispatch(uiEventDispatcher.events.CATEGORY_CREATED, {
        path: result.path,
        parentPath: parentCategory,
        name: trimmedName,
        isSubcategory: true,
        timestamp: Date.now()
      });

      // Dispatch category tree updated event
      uiEventDispatcher.dispatch(uiEventDispatcher.events.CATEGORY_TREE_UPDATED, {
        timestamp: Date.now(),
        source: 'categoryCreateController'
      });

      // Auto-select the newly created subcategory
      try {
        logger.info(`Auto-selecting new subcategory: ${result.path}`);
        await categorySelectController.handleCategorySelect(result.path);
      } catch (selectError) {
        logger.error('Error selecting new subcategory', selectError);
      }
    } else {
      // Show error message
      logger.error(`Subcategory creation error: ${result.error}`);
      await modalService.alert(
        `Failed to create subcategory: ${result.error}`,
        t('error.title')
      );
    }

    return result;
  } catch (error) {
    logger.error('Error processing subcategory creation', error);
    await modalService.alert(
      `An error occurred: ${error.message}`,
      t('error.title')
    );
    return { success: false, error: error.message };
  }
}

/**
 * Handles category renaming
 * @param {string} categoryPath - Path to category
 * @returns {Promise<Object>} - Operation result
 */
export async function handleRenameCategoryClick(categoryPath) {
  try {
    logger.info(`Processing category rename: ${categoryPath}`);

    // Show modal window for entering new name
    const newName = await modalService.prompt(
      t('category.rename'),
      t('category.enterNewName'),
      t('modal.ok'),
      t('modal.cancel')
    );

    // If user cancelled the operation
    if (!newName) {
      logger.info('User cancelled category rename');
      return { success: false, canceled: true };
    }

    logger.info(`User entered new name: ${newName}`);

    // Trim whitespace
    const trimmedName = newName.trim();

    // Call API through bridge
    logger.info(`Calling API through bridge to rename category: ${categoryPath} -> ${trimmedName}`);
    const result = await categoryBridge.renameCategory(categoryPath, trimmedName);
    logger.debug('Category rename result:', result);

    // If rename successful, dispatch update events
    if (result.success) {
      logger.info('Category renamed successfully, dispatching update events');

      // Delay before dispatching event to ensure backend completed operations
      await new Promise(resolve => setTimeout(resolve, 300));

      // Dispatch category updated event through dispatcher
      uiEventDispatcher.dispatch(uiEventDispatcher.events.CATEGORY_UPDATED, {
        path: categoryPath,
        newName: trimmedName,
        timestamp: Date.now(),
        action: 'rename'
      });

      // Dispatch category tree updated event
      uiEventDispatcher.dispatch(uiEventDispatcher.events.CATEGORY_TREE_UPDATED, {
        timestamp: Date.now(),
        source: 'categoryRenameController'
      });
    } else {
      // Show error message
      logger.error(`Category rename error: ${result.error}`);
      await modalService.alert(
        `Failed to rename category: ${result.error}`,
        t('category.renameError')
      );
    }

    return result;
  } catch (error) {
    logger.error(`Error processing category rename: ${error.message}`, error);
    await modalService.alert(
      `An error occurred: ${error.message}`,
      t('error.title')
    );
    return { success: false, error: error.message };
  }
}

// Export public functions
export const categoryCreateController = {
  init: initCategoryCreateController,
  createCategory: handleCreateCategoryClick,
  createSubcategory: handleCreateSubcategoryClick,
  renameCategory: handleRenameCategoryClick
}; 