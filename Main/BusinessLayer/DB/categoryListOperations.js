/**
 * Operations for getting category list
 * @module BusinessLayer/DB/categoryListOperations
 */

import { db } from '../../db.js';
import { getBusinessLogger } from '../../Logger/businessLogger.js';

// Create logger for module
const logger = getBusinessLogger('BusinessLayer:DB:categoryListOperations');

/**
 * Gets list of all categories
 * @returns {Array<string>} - Array of category paths
 */
export function getCategoryList() {
  try {
    logger.debug('Getting list of all categories');
    
    // Query DB to get all unique category paths (including subcategories)
    const stmt = db.prepare(`
      WITH RECURSIVE category_paths(path) AS (
        -- First get main categories (first level)
        SELECT DISTINCT
          SUBSTR(path, 1, INSTR(path || '/', '/') - 1) AS category_path
        FROM tests
        WHERE path LIKE 'Tests/%'
        
        UNION
        
        -- Then get subcategories recursively
        SELECT
          CASE
            -- If path ends with "/", remove last character
            WHEN SUBSTR(t.path, 1, INSTR(SUBSTR(t.path, LENGTH(cp.path) + 2) || '/', '/') + LENGTH(cp.path) + 1) LIKE '%/' THEN
              SUBSTR(SUBSTR(t.path, 1, INSTR(SUBSTR(t.path, LENGTH(cp.path) + 2) || '/', '/') + LENGTH(cp.path) + 1), 1, 
              LENGTH(SUBSTR(t.path, 1, INSTR(SUBSTR(t.path, LENGTH(cp.path) + 2) || '/', '/') + LENGTH(cp.path) + 1)) - 1)
            ELSE
              SUBSTR(t.path, 1, INSTR(SUBSTR(t.path, LENGTH(cp.path) + 2) || '/', '/') + LENGTH(cp.path) + 1)
          END AS subcategory_path
        FROM tests t
        JOIN category_paths cp ON t.path LIKE cp.path || '/%/%'
        WHERE LENGTH(t.path) > LENGTH(cp.path) + 1
      )
      -- Filter paths, excluding "Tests" path and empty paths
      SELECT DISTINCT path 
      FROM category_paths
      WHERE path <> 'Tests' AND path IS NOT NULL AND path <> '' AND path NOT LIKE '%/'
      ORDER BY path
    `);
    
    const result = stmt.all();
    let categoryPaths = result.map(row => row.path);
    
    // Process received paths: add root path "Tests" if not present
    if (!categoryPaths.includes('Tests')) {
      categoryPaths.unshift('Tests');
    }

    // Ensure "Merged Tests" folder presence - it should always be visible
    if (!categoryPaths.includes('Tests/Merged Tests')) {
      categoryPaths.push('Tests/Merged Tests');
    }
    
    // Add logging for debugging
    logger.debug(`Paths before processing: ${JSON.stringify(categoryPaths.slice(0, 10))}${categoryPaths.length > 10 ? '...' : ''}`);
    
    // Additional processing: remove trailing slashes and filter empty paths
    categoryPaths = categoryPaths
      .map(path => path.endsWith('/') ? path.slice(0, -1) : path)
      .filter(path => path && path.trim() !== '');
    
    logger.debug(`Paths after slash processing: ${JSON.stringify(categoryPaths.slice(0, 10))}${categoryPaths.length > 10 ? '...' : ''}`);
    
    // Add check for subcategory processing
    // Ensure all parent paths exist for each path
    const allPaths = new Set(categoryPaths);
    const parentPaths = new Set();
    
    categoryPaths.forEach(path => {
      const parts = path.split('/');
      if (parts.length > 2) {
        // For paths deeper than 2 levels (Tests/category/subcategory)
        // create all intermediate paths
        for (let i = 2; i < parts.length; i++) {
          const parentPath = parts.slice(0, i).join('/');
          if (!allPaths.has(parentPath)) {
            parentPaths.add(parentPath);
          }
        }
      }
    });
    
    // Add missing parent paths
    if (parentPaths.size > 0) {
      logger.info(`Added ${parentPaths.size} intermediate categories for tree completeness`);
      categoryPaths = [...allPaths, ...parentPaths].sort();
    }
    
    // Detailed path logging
    logger.info(`Found ${categoryPaths.length} categories in DB`);
    if (categoryPaths.length > 0) {
      logger.info(`Category path examples: ${JSON.stringify(categoryPaths.slice(0, 10))}${categoryPaths.length > 10 ? '...' : ''}`);
      
      // Count subcategories (paths with more than one nesting level)
      const subcategories = categoryPaths.filter(path => path.split('/').length > 2);
      logger.info(`Found ${subcategories.length} subcategories`);
      if (subcategories.length > 0) {
        logger.info(`Subcategory examples: ${JSON.stringify(subcategories.slice(0, 5))}${subcategories.length > 5 ? '...' : ''}`);
      }
    }
    
    return { success: true, categories: categoryPaths };
  } catch (error) {
    logger.error(`Error getting category list: ${error.message}`, error);
    return { success: false, categories: [], error: error.message };
  }
}

export default {
  getCategoryList
}; 