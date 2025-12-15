import { contextMenuController } from './contextMenuController.js';
import { createLogger } from '../../Utils/loggerService.js';

const logger = createLogger('UI/ContextMenu/Service');

/**
 * Gets logging-safe information about menu items
 * @param {Array<Object>} items - Menu items
 * @returns {Array<Object>} - Logging-safe data
 */
function getSafeMenuItemsInfo(items) {
  if (!Array.isArray(items)) {
    return 'Not an array';
  }

  return items.map(item => ({
    label: item.label,
    hasSeparator: !!item.separator,
    hasAction: typeof item.action === 'function',
    icon: item.icon,
    disabled: !!item.disabled
  }));
}

/**
 * Context menu service - provides API for other controllers
 */
export const contextMenuService = {
  /**
   * Shows context menu with specified items
   * @param {Array<Object>} items - Menu items
   * @param {Object|Event} position - Position or event
   * @returns {HTMLElement} - Context menu DOM element
   */
  show(items, position) {
    logger.debug('ContextMenuService.show called with items:', getSafeMenuItemsInfo(items));
    return contextMenuController.show(items, position);
  },

  /**
   * Creates a menu separator
   * @returns {Object} - Separator object
   */
  separator() {
    return { separator: true };
  },

  /**
   * Creates a menu item
   * @param {string} label - Item text
   * @param {Function} action - Function called on click
   * @param {Object} [options] - Additional parameters
   * @returns {Object} - Menu item object
   */
  item(label, action, options = {}) {
    logger.debug('Creating menu item:', { label, hasAction: !!action, options: { icon: options.icon, disabled: options.disabled } });
    return {
      label,
      action,
      icon: options.icon,
      disabled: options.disabled
    };
  },

  /**
   * Closes all open context menus
   */
  closeAll() {
    contextMenuController.closeAll();
  }
}; 