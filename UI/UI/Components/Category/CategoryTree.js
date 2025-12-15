/**
 * Component for displaying category tree
 * @module UI/UI/Components/Category/CategoryTree
 */

import { renderCategoryList } from './CategoryNode.js';
import { createLogger } from '../../../Utils/loggerService.js';
import { uiEventDispatcher } from '../../../Controllers/uiEventDispatcher.js';
import { categoryTreeController } from '../../../Controllers/Category/categoryTreeController.js';
import { categoryStateManager } from '../../../Utils/categoryStateManager.js';
import { t } from '@UI/i18n/index.js';

// Create logger for module
const logger = createLogger('UI/UI/Components/Category/CategoryTree');

/**
 * Class for managing category tree
 */
export class CategoryTree {
  /**
   * Creates category tree component instance
   * @param {HTMLElement} container - DOM element where tree will be added
   */
  constructor(container) {
    if (!container) {
      logger.error('Container not specified for category tree');
      throw new Error('Container not specified for category tree');
    }

    this.container = container;

    // Initialize component
    this.init();

    // Add event handlers for updating category tree via dispatcher
    this.unsubscribers = [
      // Subscribe to category tree update event
      uiEventDispatcher.subscribe(
        uiEventDispatcher.events.CATEGORY_TREE_UPDATED,
        this.handleCategoryTreeUpdated.bind(this)
      ),

      // Subscribe to category selection event
      uiEventDispatcher.subscribe(
        uiEventDispatcher.events.CATEGORY_SELECTED,
        this.handleCategorySelected.bind(this)
      ),

      // Subscribe to path expansion event
      uiEventDispatcher.subscribe(
        'expandCategoryPath',
        this.handleExpandPath.bind(this)
      )
    ];

    logger.info('Category tree instance initialized');
  }

  /**
   * Initializes category tree component
   */
  async init() {
    try {
      logger.debug('Initializing category tree');

      // Show loading indicator
      this.showLoading();

      // Load and display category tree via controller
      await this.updateCategoryTree();
    } catch (error) {
      logger.error('Error initializing category tree', error);
      this.showError(t('category.empty'));
    }
  }

  /**
   * Releases resources when component is destroyed
   */
  destroy() {
    // Unsubscribe from all events
    this.unsubscribers.forEach(unsubscribe => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    });

    logger.info('Category tree instance destroyed');
  }

  /**
   * Shows loading indicator in container
   */
  showLoading() {
    this.container.innerHTML = `<div class="loading-indicator">${t('category.loading')}</div>`;
  }

  /**
   * Shows error message in container
   * @param {string} message - Message text
   */
  showError(message) {
    this.container.innerHTML = `<div class="error-message">${message}</div>`;
  }

  /**
   * Shows info message in container
   * @param {string} message - Message text
   */
  showInfo(message) {
    const emptyElement = document.createElement('div');
    emptyElement.className = 'info-message';
    emptyElement.textContent = message;
    this.container.innerHTML = '';
    this.container.appendChild(emptyElement);
  }

  /**
   * Handler for category tree update event
   * @param {CustomEvent} event - Category tree update event
   */
  async handleCategoryTreeUpdated(event) {
    try {
      logger.info('Category tree update event received');

      const detail = event.detail || {};

      // Update tree with received data
      await this.updateCategoryTree(detail.tree, detail.currentCategory);

      logger.debug('Category tree updated by event');
    } catch (error) {
      logger.error('Error handling category tree update event', error);
    }
  }

  /**
   * Handler for category selection event
   * @param {CustomEvent} event - Category selection event
   */
  handleCategorySelected(event) {
    try {
      const { path } = event.detail || {};

      if (!path) {
        logger.warn('Category selection event received without path');
        return;
      }

      logger.info(`Category selection event received: ${path}`);

      // Highlight category in tree
      this.selectCategoryInTree(path);

      // Expand path to selected category
      this.expandPathToSelectedNode(path);
    } catch (error) {
      logger.error('Error handling category selection event', error);
    }
  }

  /**
   * Handler for path expansion event
   * @param {CustomEvent} event - Path expansion event
   */
  handleExpandPath(event) {
    try {
      const { path } = event.detail || {};

      if (!path) {
        logger.warn('Path expansion event received without path');
        return;
      }

      logger.info(`Path expansion event received: ${path}`);

      // Expand path to specified category
      this.expandPathToSelectedNode(path);
    } catch (error) {
      logger.error('Error handling path expansion event', error);
    }
  }

  /**
   * Highlights category in tree
   * @param {string} categoryPath - Selected category path
   */
  selectCategoryInTree(categoryPath) {
    try {
      if (!categoryPath) {
        logger.debug('Category path not specified, skipping highlighting');
        return;
      }

      logger.debug(`Selecting category in tree: ${categoryPath}`);

      // Find category DOM element
      const categoryElement = document.querySelector(`[data-path="${categoryPath}"]`);

      if (!categoryElement) {
        logger.debug(`DOM element for category ${categoryPath} not found`);
        return;
      }

      // Remove previous highlighting
      const activeElements = document.querySelectorAll('.category-btn.active');
      activeElements.forEach(el => {
        el.classList.remove('active');
      });

      // Set new highlighting
      categoryElement.classList.add('active');

      // Scroll to selected element
      categoryElement.scrollIntoView({ behavior: 'smooth', block: 'center' });

      logger.debug(`Category ${categoryPath} highlighted in tree`);
    } catch (error) {
      logger.error('Error selecting category in tree', error);
    }
  }

  /**
   * Expands path to selected category
   * @param {string} categoryPath - Category path
   */
  expandPathToSelectedNode(categoryPath) {
    try {
      if (!categoryPath) {
        logger.warn('Empty category path for expansion');
        return;
      }

      // Check if this is first render
      if (categoryStateManager.isFirstRender()) {
        logger.info(`First tree render, skipping automatic path expansion: ${categoryPath}`);
        return;
      }

      logger.debug(`Expanding path to category: ${categoryPath}`);

      // Find category element
      const categoryElement = document.querySelector(`[data-path="${categoryPath}"]`);

      if (!categoryElement) {
        logger.warn(`Category element ${categoryPath} not found`);
        return;
      }

      // Expand all parent nodes
      this.expandParentNodes(categoryElement);

      logger.debug(`Path to category ${categoryPath} expanded`);
    } catch (error) {
      logger.error('Error expanding path to category', error);
    }
  }

  /**
   * Updates category tree
   * @param {Object} [treeData] - Tree data
   * @param {string} [currentCategory] - Current selected category
   */
  async updateCategoryTree(treeData, currentCategory) {
    try {
      logger.info('Updating category tree');

      // Show loading indicator
      this.showLoading();

      // If data not provided, get it via controller
      if (!treeData) {
        logger.debug('Tree data not provided, getting via controller');

        const result = await categoryTreeController.getCategoryTreeData();

        if (!result.success) {
          logger.error(`Error getting tree data: ${result.error}`);
          this.showError(t('category.empty'));
          return;
        }

        treeData = result.categoryTree;
        currentCategory = result.currentCategory;
      }

      // Check for data
      if (!treeData) {
        logger.error('Tree data not received');
        this.showError('Error loading categories');
        return;
      }

      // Clear container
      this.container.innerHTML = '';

      // Check if this is first render
      const isFirst = categoryStateManager.isFirstRender();
      if (isFirst) {
        logger.info('First tree render: all categories will be collapsed');
      }

      // Render tree - fixed argument order
      renderCategoryList(treeData.children || [], this.container, currentCategory);

      logger.info(`Category tree updated, selected category: ${currentCategory}`);

      // If there's a current category, highlight it and expand path
      if (currentCategory) {
        this.selectCategoryInTree(currentCategory);

        // Expand path only if not first render
        if (!isFirst) {
          this.expandPathToSelectedNode(currentCategory);
        } else {
          logger.debug(`Skipping automatic path expansion on first render for: ${currentCategory}`);
        }
      }
    } catch (error) {
      logger.error('Error updating category tree', error);
      this.showError('Error loading categories');
    }
  }

  /**
   * Expands all parent nodes for element
   * @param {HTMLElement} element - Category DOM element
   */
  expandParentNodes(element) {
    try {
      if (!element) return;

      // Find nearest parent list element
      let parentListItem = element.closest('li');

      // If element not found or not a list item, stop
      if (!parentListItem) return;

      // Recursively expand parent nodes
      while (parentListItem) {
        // Find expand/collapse button
        const toggleButton = parentListItem.querySelector('.toggle-btn');
        // Find child list
        const childList = parentListItem.querySelector('ul');

        // If there's a button and list is hidden, expand
        if (toggleButton && childList && childList.style.display === 'none') {
          toggleButton.classList.add('expanded');
          childList.style.display = 'block';
        }

        // Move to next parent list element
        parentListItem = parentListItem.parentElement.closest('li');
      }
    } catch (error) {
      logger.error('Error expanding parent nodes', error);
    }
  }
};
