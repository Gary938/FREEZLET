/**
 * Business logic for building category tree
 * Follows six-layer project architecture
 * @module Main/BusinessLayer/Categories/categoryTreeBuilder
 */

import { mainLogger } from '../../loggerHub.js';

// Create logger for module
const logger = {
  info: (message) => mainLogger.info('BusinessLayer:Categories:categoryTreeBuilder', message),
  warn: (message) => mainLogger.warn('BusinessLayer:Categories:categoryTreeBuilder', message),
  error: (message, error) => mainLogger.error('BusinessLayer:Categories:categoryTreeBuilder', message, error),
  debug: (message) => mainLogger.debug('BusinessLayer:Categories:categoryTreeBuilder', message)
};

/**
 * Normalizes category path for tree uniformity
 * @param {string} path - Source path
 * @returns {string} - Normalized path
 * @private
 */
function _normalizePath(path) {
  if (!path) return 'Tests'; // If path is empty, return root node
  
  // Remove trailing slash (if any) for uniformity
  return path.endsWith('/') ? path.slice(0, -1) : path;
}

/**
 * Builds category tree from path list
 * Main business logic for tree building
 * @param {string[]} paths - List of category paths
 * @returns {Array} - Category tree structure
 */
export function buildCategoryTree(paths) {
  try {
    if (!Array.isArray(paths)) {
      logger.warn('Invalid data passed: paths is not an array');
      // Return correct structure even on error
      return [{
        name: 'Tests',
        fullPath: 'Tests',
        children: []
      }];
    }

    logger.debug(`Starting category tree building. Input paths: ${paths.length}`);

    const tree = [];
    const map = new Map();

    // Normalize all paths for uniform processing
    const normalizedPaths = paths.map(_normalizePath).filter(Boolean);

    // Sort paths by nesting level count
    // This is critical for proper hierarchy building
    const sortedPaths = [...normalizedPaths].sort((a, b) => {
      return a.split('/').length - b.split('/').length;
    });

    // Create Tests root node - this is important for proper UI display
    const root = {
      name: 'Tests',
      fullPath: 'Tests',
      children: []
    };
    tree.push(root);
    map.set('Tests', root);

    // Build tree
    for (const path of sortedPaths) {
      // Skip Tests root node (already created)
      if (path === 'Tests') continue;
      
      // Process only paths starting with Tests/
      if (!path.startsWith('Tests/')) {
        logger.warn(`Path doesn't start with Tests/: ${path}, skipping`);
        continue;
      }
      
      // Split path into parts
      const parts = path.split('/');
      let currentPath = 'Tests';
      
      // Skip Tests root element (first element)
      for (let i = 1; i < parts.length; i++) {
        const part = parts[i];
        if (!part) continue; // Skip empty parts
        
        // Build path gradually
        const newPath = `${currentPath}/${part}`;
        
        // If node already exists, just update current path
        if (map.has(newPath)) {
          currentPath = newPath;
          continue;
        }
        
        // Create new node
        const node = {
          name: part,
          fullPath: newPath,
          children: []
        };
        
        // Add node to map and to parent node
        map.set(newPath, node);
        const parent = map.get(currentPath);
        if (parent) {
          parent.children.push(node);
        }
        
        // Update current path for next iteration
        currentPath = newPath;
      }
    }

    // Sort child nodes
    const sortNode = (node) => {
      if (node.children && node.children.length > 0) {
        // Special sorting for root node (Tests)
        if (node.name === 'Tests') {
          // Sort so Merged Tests is always first
          node.children.sort((a, b) => {
            if (a.name === 'Merged Tests') return -1;
            if (b.name === 'Merged Tests') return 1;
            return a.name.localeCompare(b.name, undefined, { sensitivity: 'base' });
          });
        } else {
          // For other nodes - regular alphabetical sorting
          node.children.sort((a, b) => 
            a.name.localeCompare(b.name, undefined, { sensitivity: 'base' })
          );
        }
        
        // Recursively sort child nodes
        node.children.forEach(sortNode);
      }
    };
    
    sortNode(root);

    // Detailed result logging
    logger.debug(`Built category tree with ${root.children.length} root elements`);
    
    return tree;
  } catch (error) {
    logger.error(`Error building category tree`, error);
    // Return correct structure even on error
    return [{
      name: 'Tests',
      fullPath: 'Tests',
      children: []
    }];
  }
} 