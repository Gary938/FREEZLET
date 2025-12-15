/**
 * Utility for managing category expansion state
 * Allows setting and tracking expanded/collapsed state of categories
 * @module UI/Utils/categoryStateManager
 */

import { createLogger } from './loggerService.js';

// Create logger for module
const logger = createLogger('UI/Utils/categoryStateManager');

// Flag indicating whether first tree render has been completed
let isFirstRender = true;

/**
 * Utility for managing category expansion state
 */
export const categoryStateManager = {
  /**
   * Checks if this is the first category tree render
   * @returns {boolean} First render flag
   */
  isFirstRender() {
    return isFirstRender;
  },
  
  /**
   * Marks that first render is complete
   */
  markRendered() {
    if (isFirstRender) {
      logger.debug('First category tree render complete, subsequent updates will not collapse categories');
      isFirstRender = false;
    }
  },
  
  /**
   * Force sets first render status
   * Used for testing and debugging
   */
  forceFirstRender() {
    isFirstRender = true;
    logger.info('First render state forcibly set');

    // Add to window object for debugging
    if (typeof window !== 'undefined') {
      window.categoryStateDebug = {
        isFirstRender: true,
        timestamp: new Date().toISOString()
      };
    }
    
    return true;
  },
  
  /**
   * Prepares category tree, setting all nodes to collapsed state on first render
   * @param {Object} categoryTree - Category tree
   * @returns {Object} - Modified category tree
   */
  prepareTree(categoryTree) {
    if (!categoryTree) return categoryTree;

    // If first render, set all categories to collapsed state
    if (isFirstRender) {
      logger.info('Preparing category tree for first render - all categories will be collapsed');
      return this.setAllNodesCollapsed(categoryTree);
    }

    // For subsequent renders, don't change state
    return categoryTree;
  },
  
  /**
   * Recursively sets all tree nodes to collapsed state
   * @param {Object} node - Category tree node
   * @returns {Object} - Modified node
   */
  setAllNodesCollapsed(node) {
    if (!node) return node;

    // Copy node to avoid modifying original directly
    const modifiedNode = { ...node };

    // Set shouldBeExpanded property to false
    if (!modifiedNode.uiState) {
      modifiedNode.uiState = {};
    }

    // Explicitly set shouldBeExpanded to false
    modifiedNode.uiState.shouldBeExpanded = false;

    // If node has children, process them recursively
    if (Array.isArray(modifiedNode.children) && modifiedNode.children.length > 0) {
      modifiedNode.children = modifiedNode.children.map(child => this.setAllNodesCollapsed(child));

      // Log state if not root node
      if (modifiedNode.fullPath && modifiedNode.fullPath !== 'Tests') {
        logger.debug(`Category ${modifiedNode.fullPath} set to collapsed state`);
      }
    }

    return modifiedNode;
  },
  
  /**
   * Resets utility state (for testing or forced reset)
   * @returns {boolean} - Operation success
   */
  reset() {
    // Force set flag to true
    isFirstRender = true;

    // Add to window object for debugging
    if (typeof window !== 'undefined') {
      window.categoryStateDebug = {
        isFirstRender: true,
        reset: true,
        timestamp: new Date().toISOString()
      };
    }

    logger.info('Category manager state reset, next update will set categories to collapsed state');
    return true;
  },
  
  /**
   * Gets current manager state
   * @returns {Object} - Manager state
   */
  getState() {
    return {
      isFirstRender,
      timestamp: new Date().toISOString()
    };
  }
};

// Export globally for debugging
if (typeof window !== 'undefined') {
  window.categoryStateManager = categoryStateManager;
}

export default categoryStateManager; 