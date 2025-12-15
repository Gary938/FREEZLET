import { contextMenuService } from '../ContextMenu/contextMenuService.js';
import { createLogger } from '../../Utils/loggerService.js';
import {
  handleCreateSubcategoryClick,
  handleRenameCategoryClick
} from './categoryCreateController.js';
import { deleteCategory } from './categoryDeleteController.js';
import { t } from '../../i18n/index.js';

const logger = createLogger('CategoryContextMenuController');

/**
 * Builds and displays context menu for category
 * @param {string} categoryPath - Path to category
 * @param {Object|Event} position - Position or event
 * @returns {HTMLElement} - Context menu DOM element
 */
export function showCategoryContextMenu(categoryPath, position) {
  try {
    logger.info(`Opening context menu for: ${categoryPath}`);

    // Determine if category is root (more reliable way)
    const isRoot = !categoryPath.includes('/') || categoryPath === 'Tests/';
    const isSubcategory = categoryPath.split('/').length > 2;

    // Debug: category information
    logger.debug('Context menu details:', {
      path: categoryPath,
      isRoot,
      isSubcategory,
      pathParts: categoryPath.split('/')
    });

    // Build menu items
    let menuItems = [];

    // For parent categories show all options
    if (!isSubcategory) {
      // "Create subcategory" item (only for parent categories)
      menuItems.push(
        contextMenuService.item(t('contextMenu.createSubcategory'), () => {
          logger.debug(`Click on "Create subcategory" for ${categoryPath}`);
          handleCreateSubcategoryClick(categoryPath);
        }, { icon: '📁' })
      );
    }

    // Common items for all categories
    menuItems.push(
      // "Rename" item
      contextMenuService.item(t('contextMenu.rename'), () => {
        logger.debug(`Click on "Rename" for ${categoryPath}`);
        handleRenameCategoryClick(categoryPath);
      }, { icon: '✏️' })
    );

    // "Delete" item (disabled for root categories)
    menuItems.push(
      contextMenuService.item(t('contextMenu.delete'), () => {
        logger.debug(`Click on "Delete" for ${categoryPath}`);
        deleteCategory(categoryPath);
      }, {
        icon: '🗑️',
        disabled: isRoot
      })
    );

    // Log only count and types of menu items
    const menuItemsInfo = menuItems.map(item => ({
      label: item.label,
      disabled: !!item.disabled,
      icon: item.icon
    }));
    logger.debug(`Created menu with ${menuItems.length} items for ${categoryPath}`, menuItemsInfo);

    // Display menu
    const menuElement = contextMenuService.show(menuItems, position);

    // Check if menu was created successfully
    if (!menuElement) {
      logger.error(`Failed to create menu for ${categoryPath}`);
    } else {
      logger.debug(`Menu for ${categoryPath} successfully displayed`);
    }

    return menuElement;
  } catch (error) {
    logger.error(`Error displaying context menu for ${categoryPath}`, error);
    return null;
  }
}

/**
 * Sets up handler for "three dots" menu icon
 * @param {HTMLElement} menuIcon - Icon DOM element
 * @param {string} categoryPath - Path to category
 */
export function setupMenuIconHandler(menuIcon, categoryPath) {
  try {
    logger.debug(`Setting up handler for category menu icon: ${categoryPath}`);

    menuIcon.addEventListener('click', (event) => {
      event.stopPropagation();
      logger.debug(`Click on menu icon for category: ${categoryPath}`);

      showCategoryContextMenu(categoryPath, {
        top: event.clientY,
        left: event.clientX
      });
    });

    logger.debug(`Handler for category menu icon successfully set: ${categoryPath}`);
  } catch (error) {
    logger.error(`Error setting up menu icon handler: ${error.message}`, error);
  }
}

/**
 * Sets up context menu handler for category element
 * @param {HTMLElement} element - Category DOM element
 * @param {string} categoryPath - Path to category
 */
export function setupContextMenuHandler(element, categoryPath) {
  try {
    logger.debug(`Setting up context menu handler for category: ${categoryPath}`);

    element.addEventListener('contextmenu', (event) => {
      event.preventDefault();
      logger.debug(`Right click on category: ${categoryPath}`);

      showCategoryContextMenu(categoryPath, event);
    });

    logger.debug(`Context menu handler for category successfully set: ${categoryPath}`);
  } catch (error) {
    logger.error(`Error setting up context menu handler: ${error.message}`, error);
  }
} 