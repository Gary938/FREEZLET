import { createLogger } from '../../../Utils/loggerService.js';

const logger = createLogger('UI/ContextMenu/Renderer');

// Stores active click handler for proper cleanup
let activeClickHandler = null;

/**
 * Creates DOM structure for context menu
 * @param {Array<Object>} items - Array of menu items
 * @returns {HTMLElement} - Context menu DOM element
 */
export function createContextMenuElement(items) {
  try {
    // Create context menu container
    const menu = document.createElement('div');
    menu.className = 'category-menu'; // Use class from existing CSS

    // Add menu items
    items.forEach(item => {
      const menuItem = document.createElement('div');
      menuItem.className = 'menu-item';

      if (item.separator) {
        menuItem.classList.add('menu-separator');
      } else {
        menuItem.textContent = item.label || '';

        if (item.disabled) {
          menuItem.classList.add('menu-item-disabled');
        } else {
          menuItem.addEventListener('click', (e) => {
            e.stopPropagation();
            // Close menu on click
            closeAllContextMenus();
            // Call action handler
            if (typeof item.action === 'function') {
              item.action();
            }
          });
        }

        // Add icon if specified
        if (item.icon) {
          menuItem.classList.add('menu-item-with-icon');
          const icon = document.createElement('span');
          icon.className = 'menu-item-icon';
          icon.textContent = item.icon;
          menuItem.prepend(icon);
        }
      }

      menu.appendChild(menuItem);
    });

    logger.debug('Context menu DOM element created');
    return menu;
  } catch (error) {
    logger.error('Error creating context menu', error);
    throw error;
  }
}

/**
 * Displays context menu on page
 * @param {HTMLElement} menuElement - Context menu DOM element
 * @param {Object} position - Display position {top, left}
 * @returns {HTMLElement} - Displayed menu DOM element
 */
export function showContextMenu(menuElement, position) {
  try {
    // Set menu position
    menuElement.style.position = 'fixed';
    menuElement.style.zIndex = '1000';

    // Add menu to DOM
    document.body.appendChild(menuElement);

    // Get menu and window dimensions
    const menuRect = menuElement.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // Adjust position so menu doesn't go outside window
    let top = position.top;
    let left = position.left;

    if (left + menuRect.width > viewportWidth) {
      left = viewportWidth - menuRect.width - 5;
    }

    if (top + menuRect.height > viewportHeight) {
      top = viewportHeight - menuRect.height - 5;
    }

    // Set position
    menuElement.style.top = `${top}px`;
    menuElement.style.left = `${left}px`;

    // Clear previous handler if it exists
    if (activeClickHandler) {
      document.removeEventListener('click', activeClickHandler);
      activeClickHandler = null;
    }

    // Add handler to close on click outside menu
    const clickHandler = (event) => {
      if (!menuElement.contains(event.target)) {
        closeContextMenu(menuElement);
        document.removeEventListener('click', clickHandler);
        activeClickHandler = null;
      }
    };

    // Store handler reference
    activeClickHandler = clickHandler;

    // Add small delay to prevent instant closing
    setTimeout(() => {
      document.addEventListener('click', clickHandler);
    }, 10);

    logger.debug('Context menu displayed');
    return menuElement;
  } catch (error) {
    logger.error('Error displaying context menu', error);
    throw error;
  }
}

/**
 * Closes context menu
 * @param {HTMLElement} menuElement - Context menu DOM element
 */
export function closeContextMenu(menuElement) {
  try {
    if (menuElement && menuElement.parentNode) {
      menuElement.parentNode.removeChild(menuElement);
      logger.debug('Context menu closed');
    }
  } catch (error) {
    logger.error('Error closing context menu', error);
  }
}

/**
 * Closes all open context menus
 */
export function closeAllContextMenus() {
  try {
    // Clear click handler
    if (activeClickHandler) {
      document.removeEventListener('click', activeClickHandler);
      activeClickHandler = null;
    }

    const menus = document.querySelectorAll('.category-menu');
    menus.forEach(menu => {
      if (menu.parentNode) {
        menu.parentNode.removeChild(menu);
      }
    });
    logger.debug('All context menus closed');
  } catch (error) {
    logger.error('Error closing all context menus', error);
  }
}
