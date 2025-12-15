/**
 * API for building category tree
 * Used by Renderer components to display category hierarchy
 * @module Main/API/CategoryAPI/categoryTree
 */

import { createApiLogger, logApiStart, logApiSuccess, logApiError } from '../../Logger/apiLogger.js';
import { buildCategoryTree } from '../../BusinessLayer/Categories/categoryTreeBuilder.js';

// Create logger for module
const logger = createApiLogger('API:CategoryAPI:tree');

/**
 * Builds category tree from array of paths
 * @param {Array<string>} paths - Array of category paths
 * @returns {Promise<Object>} - Object with operation result and built tree
 */
export async function buildCategoryTreeFromPaths(paths) {
  try {
    // Log operation start
    logApiStart(logger, 'buildCategoryTreeFromPaths', { pathCount: paths?.length || 0 });
    
    // Input validation
    if (!Array.isArray(paths)) {
      logger.warn('Invalid data passed: paths is not an array');
      return { 
        success: false, 
        error: 'Invalid data passed: paths is not an array',
        tree: [] // Add empty array to ensure structure
      };
    }
    
    // Build tree via business layer
    const tree = buildCategoryTree(paths);
    
    // Log successful build
    logApiSuccess(logger, 'buildCategoryTreeFromPaths');
    
    return { 
      success: true, 
      tree: tree || [] // Ensure tree is not undefined
    };
  } catch (error) {
    // Log error
    logApiError(logger, 'buildCategoryTreeFromPaths', error);
    
    return { 
      success: false, 
      error: error.message || 'Error building category tree',
      tree: [] // Add empty array to ensure structure 
    };
  }
} 