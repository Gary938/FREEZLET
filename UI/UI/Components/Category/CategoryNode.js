/**
 * Component for displaying category tree node
 * @module UI/UI/Components/Category/CategoryNode
 */

import { categoryTreeController } from '../../../Controllers/Category/categoryTreeController.js';
import { createLogger } from '../../../Utils/loggerService.js';
import { setupMenuIconHandler, setupContextMenuHandler } from '../../../Controllers/Category/categoryContextMenuController.js';
import { categoryStateManager } from '../../../Utils/categoryStateManager.js';
import { t } from '../../../i18n/index.js';

// Counter for generating unique node identifiers
let nodeIdCounter = 1;

// Create logger for module
const logger = createLogger('UI/UI/Components/Category/CategoryNode');

/**
 * Creates "three dots" menu icon for context menu
 * @param {string} path - Category path
 * @returns {HTMLElement} - Menu icon DOM element
 */
function createMenuIcon(path) {
  try {
    const menuIcon = document.createElement('span');
    menuIcon.className = 'menu-icon';
    menuIcon.textContent = '⋯';
    menuIcon.dataset.path = path;
    return menuIcon;
  } catch (error) {
    logger.error(`Error creating menu icon: ${error.message}`);
    return null;
  }
}

/**
 * Creates DOM element for category node
 * @param {Object} node - Category node data
 * @param {string|null} parentNodeId - Parent node ID for subcategories
 * @returns {HTMLElement} - Node DOM element
 */
export function createCategoryNode(node, parentNodeId = null) {
  try {
    if (!node || !node.fullPath) {
      logger.warn('Invalid category node received');
      return null;
    }

    const { name: nodeName, fullPath, uiState = {}, children = [] } = node;
    const { isCurrent, level = 0, shouldBeVisible = true, hasChildren = false } = uiState;

    // Check name - if empty, extract from path
    let displayName = nodeName;
    if (!displayName || displayName.trim() === '') {
      const pathParts = fullPath.split('/');
      displayName = pathParts[pathParts.length - 1] || 'Unnamed';
      logger.debug(`Node name ${fullPath} was empty, extracted from path: ${displayName}`);
    }

    // Check if node actually has children
    const nodeHasChildren = hasChildren || (Array.isArray(children) && children.length > 0);

    // Generate unique identifier for node
    const nodeId = `category-node-${nodeIdCounter++}`;

    // Create category button according to old style
    const nodeElement = document.createElement('button');
    nodeElement.className = level > 0 ? 'category-btn subcategory' : 'category-btn';
    nodeElement.dataset.nodeId = nodeId;
    nodeElement.dataset.path = fullPath;
    nodeElement.dataset.name = displayName;
    nodeElement.dataset.type = 'category';
    nodeElement.dataset.level = level.toString();
    nodeElement.dataset.hasChildren = nodeHasChildren.toString();

    // If this is a subcategory, set parent relationship
    if (parentNodeId) {
      nodeElement.dataset.parent = parentNodeId;
    }

    // Set padding based on level
    nodeElement.style.paddingLeft = `${20 + level * 20}px`;

    // Set node visibility
    // Visibility logic: always show first level categories,
    // subcategories - only if shouldBeVisible
    nodeElement.style.display = (level <= 1 || shouldBeVisible) ? 'flex' : 'none';

    // Add folder indicator for nodes with subcategories
    if (nodeHasChildren) {
      const folderIcon = document.createElement('span');
      folderIcon.className = 'folder-icon';
      folderIcon.textContent = '📁 ';
      nodeElement.appendChild(folderIcon);
    }

    // Add element text
    const textNode = document.createTextNode(displayName);
    nodeElement.appendChild(textNode);

    // Add class for current selected category
    if (isCurrent) {
      nodeElement.classList.add('active');
    }

    // Special formatting for Merged Tests folder
    if (displayName === 'Merged Tests') {
      nodeElement.classList.add('merge-folder');
    }

    // Add "three dots" icon for all nodes except Merged Tests
    if (displayName !== 'Merged Tests') {
      const menuIcon = createMenuIcon(fullPath);
      if (menuIcon) {
        nodeElement.appendChild(menuIcon);
        setupMenuIconHandler(menuIcon, fullPath);
      }

      // Add right-click handler for context menu
      setupContextMenuHandler(nodeElement, fullPath);
    }

    // Add click handler for entire node
    nodeElement.addEventListener('click', async (event) => {
      try {
        // Remove highlighting from all nodes
        document.querySelectorAll('.category-btn.active').forEach(node => {
          node.classList.remove('active');
        });

        // Highlight current node
        nodeElement.classList.add('active');

        // Toggle node expansion ONLY if it has children
        if (nodeHasChildren) {
          categoryTreeController.toggleNodeExpanded(nodeElement);
        }

        // Notify controller about category selection
        await categoryTreeController.selectCategory(fullPath);
      } catch (error) {
        logger.error(`Error handling click on category ${fullPath}`, error);
      }
    });

    // Set expansion state if node has children
    if (nodeHasChildren) {
      // Get flag for whether node should be expanded
      const shouldBeExpanded = uiState?.shouldBeExpanded ?? false;
      nodeElement.dataset.expanded = shouldBeExpanded.toString();

      // If node should be expanded, change icon
      if (shouldBeExpanded && nodeElement.querySelector('.folder-icon')) {
        nodeElement.querySelector('.folder-icon').textContent = '📂 ';
      }
    }

    logger.debug(`Created DOM element for node ${fullPath} (level ${level})`);
    return nodeElement;
  } catch (error) {
    logger.error('Error creating node DOM element', error);
    return null;
  }
}

/**
 * Recursively creates DOM elements for category and all its subcategories
 * @param {Object} node - Category node
 * @param {HTMLElement} container - Container for adding nodes
 * @param {string|null} parentNodeId - Parent node ID for subcategories
 */
function renderCategoryNodeWithChildren(node, container, parentNodeId = null) {
  try {
    if (!node || !container) {
      logger.warn('Node or container not specified in renderCategoryNodeWithChildren');
      return;
    }

    // Check if node has full path
    if (!node.fullPath) {
      logger.warn('Node is missing full path (fullPath)');
      return;
    }

    // Create and add current node element
    const nodeElement = createCategoryNode(node, parentNodeId);
    if (nodeElement) {
      container.appendChild(nodeElement);

      // Get this node's ID for linking its children
      const nodeId = nodeElement.dataset.nodeId;

      // If node has children, recursively display them
      if (node.children && node.children.length > 0) {
        // Set flag that node has children
        nodeElement.dataset.hasChildren = 'true';

        // Check if this is first render
        const isFirstRender = categoryStateManager.isFirstRender();

        // Set expansion state considering first render
        const shouldBeExpanded = isFirstRender ? false : (node.uiState?.shouldBeExpanded ?? false);

        // Update node state
        nodeElement.dataset.expanded = shouldBeExpanded.toString();

        // Log state on first render
        if (isFirstRender) {
          logger.debug(`Category ${node.fullPath} will be collapsed on first render`);
        }

        // Update folder icon based on state
        const folderIcon = nodeElement.querySelector('.folder-icon');
        if (folderIcon) {
          folderIcon.textContent = shouldBeExpanded ? '📂 ' : '📁 ';
        }

        // Recursively display child nodes with explicit parentNodeId passing
        node.children.forEach(childNode => {
          // Set initial state for child node if not set
          if (!childNode.uiState) {
            childNode.uiState = {};
          }

          // Inherit level from parent and increment
          const parentLevel = node.uiState?.level ?? 0;
          childNode.uiState.level = parentLevel + 1;

          // Child elements are visible only if parent is expanded
          childNode.uiState.shouldBeVisible = shouldBeExpanded;

          // Create child node element and add it
          // Explicitly pass current node's nodeId as parentNodeId for child
          const childElement = createCategoryNode(childNode, nodeId);

          if (childElement) {
            // IMPORTANT: On first render, forcibly hide child elements
            if (isFirstRender || !shouldBeExpanded) {
              childElement.style.display = 'none';
              childElement.classList.add('hidden-node');
              childElement.classList.remove('visible-node');
              childElement.dataset.visible = 'false';
              logger.debug(`Child element ${childNode.fullPath} hidden during render`);
            } else {
              childElement.style.display = 'flex';
              childElement.classList.add('visible-node');
              childElement.classList.remove('hidden-node');
              childElement.dataset.visible = 'true';
            }

            // Add element to container
            container.appendChild(childElement);

            // If child node has children, recursively render them
            if (childNode.children && childNode.children.length > 0) {
              // Recursively display child nodes, passing current child node's ID
              renderCategoryNodeWithChildren(childNode, container, childElement.dataset.nodeId);
            }
          }
        });
      } else {
        // For nodes without children, set flag
        nodeElement.dataset.hasChildren = 'false';
      }

      logger.debug(`Rendered node ${node.fullPath} (with ${node.children?.length || 0} children)`);
    }
  } catch (error) {
    logger.error(`Error in renderCategoryNodeWithChildren for ${node?.fullPath}`, error);
  }
}

/**
 * Creates DOM elements for category list
 * @param {Array} categories - Category list
 * @param {HTMLElement} container - Container for adding nodes
 * @param {string} [currentCategory] - Current selected category
 */
export function renderCategoryList(categories, container, currentCategory) {
  try {
    if (!Array.isArray(categories) || !container) {
      return;
    }

    logger.debug(`Displaying category list, total ${categories.length} elements`);

    // Clear container before adding new elements
    container.innerHTML = '';

    // If no categories, show message
    if (categories.length === 0) {
      container.innerHTML = `<div class="empty-category-message">${t('category.empty')}</div>`;
      logger.info('Empty category list message displayed');
      return;
    }

    // Display each category and its subcategories recursively
    categories.forEach(category => {
      // Set current category if it matches
      if (currentCategory && category.fullPath === currentCategory) {
        category.uiState = { ...category.uiState, isCurrent: true };
      }

      renderCategoryNodeWithChildren(category, container);
    });

    logger.info(`Displayed ${categories.length} root categories with all subcategories`);
  } catch (error) {
    logger.error('Error in renderCategoryList', error);
  }
}

export default {
  createCategoryNode,
  renderCategoryList
};
