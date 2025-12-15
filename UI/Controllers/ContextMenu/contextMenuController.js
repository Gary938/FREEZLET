import {
  createContextMenuElement,
  showContextMenu,
  closeAllContextMenus
} from '../../UI/Components/ContextMenu/contextMenuRenderer.js';
import { createLogger } from '../../Utils/loggerService.js';

const logger = createLogger('UI/ContextMenu/Controller');

/**
 * Context menu controller
 */
export const contextMenuController = {
  /**
   * Shows context menu
   * @param {Array<Object>} items - Menu items
   * @param {Object|Event} position - Position or event
   * @returns {HTMLElement} - Context menu DOM element
   */
  show(items, position) {
    try {
      logger.debug('ContextMenuController.show called with ' + (Array.isArray(items) ? items.length : 0) + ' items');
      // Close all existing menus
      closeAllContextMenus();

      // Check that items is an array
      if (!Array.isArray(items)) {
        logger.error('Menu items must be an array', 'Received type: ' + typeof items);
        return null;
      }

      // Get position coordinates from event or object
      let coords = position;

      if (position instanceof Event) {
        position.preventDefault();
        coords = {
          top: position.clientY,
          left: position.clientX
        };
      }

      // Create and show menu
      const menuElement = createContextMenuElement(items);
      logger.debug('Showing menu at position:', {
        top: coords.top || 0,
        left: coords.left || 0
      });
      return showContextMenu(menuElement, coords);
    } catch (error) {
      logger.error('Error displaying context menu', error);
      return null;
    }
  },

  /**
   * Closes all open context menus
   */
  closeAll() {
    closeAllContextMenus();
  }
}; 