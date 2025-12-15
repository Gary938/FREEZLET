/**
 * UI controller for working with category selection
 * Follows project's six-layer architecture
 * @module UI/Controllers/Category/categorySelectController
 */

import { createLogger } from '../../Utils/loggerService.js';
import { categoryBridge } from '../../Bridge/Category/index.js';
import { uiEventDispatcher } from '../uiEventDispatcher.js';

// Create logger for module
const logger = createLogger('UI/Category/SelectController');

// Stores last selected category in memory
let lastSelectedCategory = null;

/**
 * Category selection handler
 * @param {string} categoryPath - Path to selected category
 * @param {boolean} [skipSaveToBackend=false] - Skip saving to backend (for internal calls)
 * @returns {Promise<Object>} Operation result
 */
async function handleCategorySelect(categoryPath, skipSaveToBackend = false) {
  try {
    logger.info(`Processing category selection: ${categoryPath}`);

    // If category hasn't changed, don't make backend request
    if (lastSelectedCategory === categoryPath) {
      logger.debug(`Category ${categoryPath} already selected, skipping save`);
      return { success: true, path: categoryPath };
    }

    const oldCategory = lastSelectedCategory;
    lastSelectedCategory = categoryPath;

    // If need to save to backend
    if (!skipSaveToBackend) {
      // Call bridge to save selected category
      const result = await categoryBridge.selectCategory(categoryPath);

      if (result.success) {
        logger.debug('Category successfully selected', { path: categoryPath });
      } else {
        logger.error(`Error selecting category: ${result.error}`);
        // On error, restore previous category
        lastSelectedCategory = oldCategory;
        return result;
      }
    }

    // Dispatch category selected event
    uiEventDispatcher.dispatch(uiEventDispatcher.events.CATEGORY_SELECTED, {
      path: categoryPath,
      timestamp: Date.now(),
      source: 'categorySelectController'
    });

    return { success: true, path: categoryPath };
  } catch (error) {
    logger.error(`Exception selecting category: ${error.message}`, error);
    return { success: false, error: error.message };
  }
}

/**
 * Gets last selected category
 * @returns {Promise<Object>} Last selected category data
 */
async function getLastSelectedCategory() {
  try {
    logger.debug('Requesting last selected category');

    // If we already have last category in memory
    if (lastSelectedCategory) {
      logger.debug(`Returning category from memory: ${lastSelectedCategory}`);
      return { success: true, path: lastSelectedCategory };
    }

    // Otherwise get from backend
    const result = await categoryBridge.getLastSelectedCategory();

    if (result.success && result.path) {
      logger.info(`Got last selected category from backend: ${result.path}`);

      // Save to memory
      lastSelectedCategory = result.path;

      // Dispatch last selected category loaded event
      uiEventDispatcher.dispatch(uiEventDispatcher.events.CATEGORY_SELECTED, {
        path: result.path,
        timestamp: Date.now(),
        isLastSelected: true,
        source: 'categorySelectController'
      });
    } else {
      logger.warn('Last selected category not found or error getting it');
    }

    return result;
  } catch (error) {
    logger.error(`Error getting last selected category: ${error.message}`, error);
    return { success: false, error: error.message };
  }
}

/**
 * Controller initialization
 * Loads last selected category on startup
 */
async function init() {
  logger.info('Initializing category select controller');

  // Subscribe to UI initialization
  const unsubscribeInit = uiEventDispatcher.subscribe(
    uiEventDispatcher.events.UI_INITIALIZED,
    async () => {
      logger.debug('UI initialized, loading last selected category');
      await getLastSelectedCategory();
    }
  );

  // Subscribe to native category click event
  document.addEventListener('category-node-click', async (event) => {
    const categoryPath = event.detail.path;
    logger.debug(`Received category click event: ${categoryPath}`);
    await handleCategorySelect(categoryPath);
  });

  // Return unsubscribe function for cleanup if needed
  return () => {
    unsubscribeInit();
    document.removeEventListener('category-node-click', handleCategorySelect);
    logger.info('Category select controller deinitialized');
  };
}

// Export controller methods
export default {
  init,
  handleCategorySelect,
  getLastSelectedCategory
}; 