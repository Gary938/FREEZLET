/**
 * UI controller for working with category tree
 * Manages category tree interface state
 * @module UI/Controllers/Category/categoryTreeController
 */

import { categoryTreeBridge } from '../../Bridge/Category/categoryTreeBridge.js';
import { createLogger } from '../../Utils/loggerService.js';
import { uiEventDispatcher } from '../uiEventDispatcher.js';
import categorySelectController from './categorySelectController.js';
import { categoryStateManager } from '../../Utils/categoryStateManager.js';

// Create logger for module
const logger = createLogger('UI/Controllers/Category/categoryTreeController');

/**
 * Controller for managing category tree UI
 */
export const categoryTreeController = {
  /**
   * Initializes the controller
   */
  init() {
    try {
      logger.info('Initializing category tree controller');

      // Subscribe to category create and update events
      uiEventDispatcher.subscribe(
        uiEventDispatcher.events.CATEGORY_CREATED,
        this.handleCategoryCreated.bind(this)
      );

      uiEventDispatcher.subscribe(
        uiEventDispatcher.events.CATEGORY_UPDATED,
        this.handleCategoryUpdated.bind(this)
      );

      uiEventDispatcher.subscribe(
        uiEventDispatcher.events.CATEGORY_DELETED,
        this.handleCategoryDeleted.bind(this)
      );

      // Subscribe to category selection event
      uiEventDispatcher.subscribe(
        uiEventDispatcher.events.CATEGORY_SELECTED,
        this.handleCategorySelected.bind(this)
      );

      logger.info('Category tree controller initialized');
    } catch (error) {
      logger.error('Error initializing category tree controller', error);
    }
  },

  /**
   * Category created event handler
   * @param {CustomEvent} event - Category created event
   */
  async handleCategoryCreated(event) {
    try {
      const { path } = event.detail || {};
      logger.info(`Processing category created event: ${path}`);

      // Initiate category tree refresh
      await this.refreshCategoryTree();

      // If path specified, select and expand category
      if (path) {
        await this.selectCategory(path);
      }
    } catch (error) {
      logger.error('Error processing category created event', error);
    }
  },

  /**
   * Category updated event handler
   * @param {CustomEvent} event - Category updated event
   */
  async handleCategoryUpdated(event) {
    try {
      logger.info('Processing category updated event');
      await this.refreshCategoryTree();
    } catch (error) {
      logger.error('Error processing category updated event', error);
    }
  },

  /**
   * Category deleted event handler
   * @param {CustomEvent} event - Category deleted event
   */
  async handleCategoryDeleted(event) {
    try {
      logger.info('Processing category deleted event');
      await this.refreshCategoryTree();
    } catch (error) {
      logger.error('Error processing category deleted event', error);
    }
  },

  /**
   * Category selected event handler
   * @param {CustomEvent} event - Category selected event
   */
  handleCategorySelected(event) {
    try {
      const { path } = event.detail || {};

      if (!path) {
        logger.warn('Received category selection event without path');
        return;
      }

      logger.info(`Received category selection event: ${path}`);

      // Send signal to update selected category
      this.selectCategory(path);
    } catch (error) {
      logger.error('Error processing category selection event', error);
    }
  },

  /**
   * Gets data for building category tree
   * @returns {Promise<{success: boolean, categoryTree: Object, currentCategory: string, error?: string}>}
   */
  async getCategoryTreeData() {
    try {
      logger.debug('Requesting category tree data');

      // Get data via bridge
      const result = await categoryTreeBridge.getCategoryTreeData();

      if (result.success) {
        logger.info('Category tree data successfully retrieved via bridge');
      } else {
        logger.error(`Error getting category tree data: ${result.error}`);
      }

      return result;
    } catch (error) {
      logger.error('Error getting category tree data', error);
      return {
        success: false,
        error: error.message,
        categoryTree: { name: 'Root', fullPath: 'Tests', children: [] },
        currentCategory: ''
      };
    }
  },

  /**
   * Selects category in UI and notifies system of selection
   * @param {string} categoryPath - Category path
   * @returns {Promise<boolean>} - Category selection success
   */
  async selectCategory(categoryPath) {
    try {
      logger.debug(`Selecting category: ${categoryPath}`);

      // Find category DOM element
      const categoryElement = document.querySelector(`[data-path="${categoryPath}"]`);

      if (categoryElement) {
        // Remove previous selection
        const activeElements = document.querySelectorAll('.category-btn.active');
        activeElements.forEach(el => {
          el.classList.remove('active');
        });

        // Set new selection
        categoryElement.classList.add('active');
      }

      // Send request to change selected category via category select controller
      const result = await categorySelectController.handleCategorySelect(categoryPath);

      if (result.success) {
        logger.info(`Category ${categoryPath} selected`);
      } else {
        logger.error(`Category selection error: ${result.error || 'Unknown error'}`);
      }

      return result.success;
    } catch (error) {
      // Avoid passing error object to logger.error to prevent circular reference
      logger.error(`Category selection error: ${error.message || 'Unknown error'}`);
      return false;
    }
  },

  /**
   * Force refreshes category tree
   * @returns {Promise<{success: boolean, error?: string}>}
   */
  async refreshCategoryTree() {
    try {
      logger.info('Request to refresh category tree');

      // Get category tree data via bridge
      const treeData = await this.getCategoryTreeData();

      if (!treeData.success) {
        logger.error(`Failed to get current category data: ${treeData.error}`);
        return { success: false, error: treeData.error };
      }

      // Use utility to prepare tree (all categories will be collapsed on first render)
      const preparedTree = categoryStateManager.prepareTree(treeData.categoryTree);

      if (categoryStateManager.isFirstRender()) {
        logger.info('First tree render - all categories will be displayed collapsed');
      }

      // Dispatch category tree update event with prepared tree
      uiEventDispatcher.dispatch(
        uiEventDispatcher.events.CATEGORY_TREE_UPDATED,
        {
          tree: preparedTree,
          currentCategory: treeData.currentCategory,
          firstRender: categoryStateManager.isFirstRender(),
          timestamp: Date.now()
        }
      );

      // Mark that render is complete
      categoryStateManager.markRendered();

      logger.info('Category tree update event dispatched');
      return { success: true };
    } catch (error) {
      logger.error(`Error in refreshCategoryTree`, error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  /**
   * Toggles tree node expanded state
   * @param {HTMLElement} nodeElement - Node DOM element
   */
  toggleNodeExpanded(nodeElement) {
    try {
      if (!nodeElement) {
        logger.warn('Node element not specified for state toggle');
        return;
      }

      // Check if node has children
      const hasChildren = nodeElement.dataset.hasChildren === 'true';

      if (!hasChildren) {
        // If node has no children, do nothing
        logger.debug('Node has no children, skipping toggle');
        return;
      }

      // Get current state
      const isExpanded = nodeElement.dataset.expanded === 'true';

      // Invert state
      nodeElement.dataset.expanded = (!isExpanded).toString();

      // Get node ID
      const nodeId = nodeElement.dataset.nodeId;

      // Update folder icon
      const folderIcon = nodeElement.querySelector('.folder-icon');
      if (folderIcon) {
        folderIcon.textContent = !isExpanded ? '📂 ' : '📁 ';
      }

      // Find all child elements
      const childNodes = document.querySelectorAll(`[data-parent="${nodeId}"]`);

      // Update child element visibility
      // If expanding node - make children visible (display: flex)
      // If collapsing - make invisible (display: none)
      childNodes.forEach(childNode => {
        // Change display style
        childNode.style.display = !isExpanded ? 'flex' : 'none';

        // Explicitly set CSS property
        if (!isExpanded) {
          childNode.classList.add('visible-node');
          childNode.classList.remove('hidden-node');
        } else {
          childNode.classList.add('hidden-node');
          childNode.classList.remove('visible-node');
        }

        // Update visibility data attribute for debugging
        childNode.dataset.visible = (!isExpanded).toString();
      });

      // Detailed logging for debugging
      logger.info(`Node "${nodeElement.dataset.path}" state toggled: expanded=${!isExpanded}, affected ${childNodes.length} child nodes`);
    } catch (error) {
      logger.error('Error toggling tree node state', error);
    }
  }
}; 