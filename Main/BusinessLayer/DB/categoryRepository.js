// Main/BusinessLayer/DB/categoryRepository.js
// Database access layer for categories

import { db } from '../../db.js';
import { getBusinessLogger } from '../../Logger/businessLogger.js';

// Logger for module
const logger = getBusinessLogger('BusinessLayer:DB:categoryRepository');

/**
 * Checks category existence in DB
 * @param {string} categoryPath - Category path
 * @returns {boolean} - Whether category exists
 */
export function categoryExists(categoryPath) {
  try {
    const stmt = db.prepare(`SELECT COUNT(*) as count FROM tests WHERE path LIKE ?`);
    const result = stmt.get(`${categoryPath}/%`);
    return result.count > 0;
  } catch (error) {
    logger.error(`Error checking category in DB: ${error.message}`);
    return false;
  }
}

/**
 * Checks subcategory existence in DB
 * @param {string} subcategoryPath - Full subcategory path
 * @returns {boolean} - Whether subcategory exists
 */
export function subcategoryExists(subcategoryPath) {
  try {
    const stmt = db.prepare(`SELECT COUNT(*) as count FROM tests WHERE path LIKE ?`);
    const result = stmt.get(`${subcategoryPath}/%`);
    return result.count > 0;
  } catch (error) {
    logger.error(`Error checking subcategory in DB: ${error.message}`);
    return false;
  }
}

/**
 * Adds category to DB (creates empty test marker)
 * @param {string} categoryPath - Category path
 * @returns {Object} - Operation result
 */
export function addCategory(categoryPath) {
  try {
    // Create category test marker for system registration
    const markerPath = `${categoryPath}/.category_marker`;
    
    // Check if category is a subcategory
    // For subcategories path will be like "Tests/CategoryName/SubCategoryName"
    // Count slashes in path
    const slashCount = (categoryPath.match(/\//g) || []).length;
    const isSubcategory = slashCount > 1; // For main categories path is "Tests/CategoryName" (1 slash)
    
    // Set is_category_marker = 1 flag for all categories and subcategories
    const stmt = db.prepare(`
      INSERT INTO tests (path, name, is_category_marker) 
      VALUES (?, ?, 1)
    `);
    
    stmt.run(markerPath, '.category_marker');
    
    if (isSubcategory) {
      logger.info(`Subcategory ${categoryPath} added to DB with category marker`);
    } else {
      logger.info(`Category ${categoryPath} added to DB with category marker`);
    }
    
    return { success: true };
  } catch (error) {
    logger.error(`Error adding category to DB: ${error.message}`);
    return { success: false, error: error.message };
  }
}

/**
 * Deletes category from DB
 * @param {string} categoryPath - Category path
 * @returns {Object} - Operation result
 */
export function removeCategory(categoryPath) {
  try {
    // Delete category marker
    const markerPath = `${categoryPath}/.category_marker`;
    
    const stmt = db.prepare(`
      DELETE FROM tests 
      WHERE path = ? AND is_category_marker = 1
    `);
    
    stmt.run(markerPath);
    
    logger.info(`Category ${categoryPath} deleted from DB`);
    return { success: true };
  } catch (error) {
    logger.error(`Error deleting category from DB: ${error.message}`);
    return { success: false, error: error.message };
  }
}

/**
 * Deletes all records from DB related to specified category path
 * @param {string} categoryPath - Path to category
 * @returns {Object} - Operation result
 */
export function cleanupCategoryPath(categoryPath) {
  try {
    // Delete all tests associated with category
    db.prepare("DELETE FROM tests WHERE path LIKE ?")
      .run(`${categoryPath}/%`);
    
    logger.info(`Category records deleted from DB: ${categoryPath}`);
    return { success: true };
  } catch (error) {
    logger.error(`Error deleting records from DB: ${error.message}`);
    return { success: false, error: error.message };
  }
}

/**
 * Renames category path in all DB records
 * @param {string} oldPath - Old category path
 * @param {string} newPath - New category path
 * @returns {Object} - Operation result
 */
export function updateCategoryPaths(oldPath, newPath) {
  try {
    let updateCount = 0;
    
    db.transaction(() => {
      // Get all paths that start with oldPath
      const stmt = db.prepare(`
        SELECT path 
        FROM tests 
        WHERE path = ? 
           OR path LIKE ? 
           OR path LIKE ?`
      );
      
      // Find exact matches and nested paths
      const exactPath = oldPath;
      const subPath = `${oldPath}/%`;
      const nestedPath = `${oldPath}/%/%`;
      
      const rows = stmt.all(exactPath, subPath, nestedPath);

      const updateStmt = db.prepare("UPDATE tests SET path = ? WHERE path = ?");
      for (const row of rows) {
        // Safe replacement of path prefix only (fixed replace bug)
        const updatedPath = row.path.startsWith(oldPath)
          ? newPath + row.path.slice(oldPath.length)
          : row.path;
        logger.debug(`Updating path: ${row.path} → ${updatedPath}`);
        const result = updateStmt.run(updatedPath, row.path);
        updateCount += result.changes;
      }
    })();
    
    logger.info(`Paths updated in database: ${oldPath} -> ${newPath}, records changed: ${updateCount}`);
    return { success: true, updatedCount: updateCount };
  } catch (error) {
    logger.error(`Error updating paths in database: ${error.message}`);
    return { success: false, error: error.message };
  }
}

/**
 * Gets list of all tests in category
 * @param {string} categoryPath - Category path
 * @returns {Object} - Operation result with test list
 */
export function getTestsByCategory(categoryPath) {
  try {
    const stmt = db.prepare(`
      SELECT * FROM tests
      WHERE path LIKE ? 
      AND (
        LENGTH(REPLACE(path, ?, '')) - LENGTH(REPLACE(REPLACE(path, ?, ''), '/', '')) = 1
      )
      ORDER BY name COLLATE NOCASE ASC
    `);
    
    const prefix = `${categoryPath}/%`;
    const tests = stmt.all(prefix, categoryPath, categoryPath);
    
    return { success: true, data: tests };
  } catch (error) {
    logger.error(`Error getting tests from category: ${error.message}`);
    return { success: false, error: error.message };
  }
}

// getAllCategories() removed - contained bug and was not used
// Use getCategoryList() from categoryListOperations.js

/**
 * Gets last used category from DB
 * @returns {Object} - Operation result with last category path
 */
export function getLastCategory() {
  try {
    const stmt = db.prepare(`
      SELECT full_path FROM last_category
      LIMIT 1
    `);

    const result = stmt.get();

    if (result && result.full_path) {
      // Check category existence in DB (tests table)
      if (!categoryExists(result.full_path)) {
        logger.debug(`Last category ${result.full_path} does not exist, returning null`);
        return { success: true, categoryPath: null };
      }
      return { success: true, categoryPath: result.full_path };
    } else {
      return { success: true, categoryPath: null };
    }
  } catch (error) {
    logger.error(`Error getting last category: ${error.message}`);
    return { success: false, error: error.message };
  }
}

/**
 * Finds adjacent category (next or previous) for deleted path
 * @param {string} deletedPath - Deleted category path
 * @returns {{success: boolean, categoryPath: string|null}} - Adjacent category or null
 */
export function getAdjacentCategory(deletedPath) {
  try {
    // Get all unique category paths (root), sorted
    const stmt = db.prepare(`
      SELECT DISTINCT
        CASE
          WHEN INSTR(SUBSTR(path, 7), '/') > 0
          THEN 'Tests/' || SUBSTR(SUBSTR(path, 7), 1, INSTR(SUBSTR(path, 7), '/') - 1)
          ELSE SUBSTR(path, 1, LENGTH(path) - LENGTH(SUBSTR(path, INSTR(path || '/', '/'))))
        END as category_path
      FROM tests
      WHERE path LIKE 'Tests/%'
      ORDER BY category_path COLLATE NOCASE ASC
    `);

    const allCategories = stmt.all()
      .map(row => row.category_path)
      .filter(path => path && path !== 'Tests' && path.startsWith('Tests/'));

    // Remove duplicates
    const categories = [...new Set(allCategories)];

    if (categories.length === 0) {
      logger.debug('No available categories for selection');
      return { success: true, categoryPath: null };
    }

    // Find deleted category position
    const deletedIndex = categories.findIndex(c => c === deletedPath);

    let adjacentPath = null;

    if (deletedIndex === -1) {
      // Deleted category not in list - take first available
      adjacentPath = categories[0];
    } else if (deletedIndex < categories.length - 1) {
      // Next category exists - take it
      adjacentPath = categories[deletedIndex + 1];
    } else if (deletedIndex > 0) {
      // No next, but previous exists - take it
      adjacentPath = categories[deletedIndex - 1];
    } else {
      // This is the only category and it was deleted
      adjacentPath = null;
    }

    logger.debug(`Adjacent category for ${deletedPath}: ${adjacentPath}`);
    return { success: true, categoryPath: adjacentPath };
  } catch (error) {
    logger.error(`Error finding adjacent category: ${error.message}`);
    return { success: false, error: error.message, categoryPath: null };
  }
}

/**
 * Saves last used category to DB
 * @param {string} categoryPath - Category path
 * @returns {Object} - Operation result
 */
export function setLastCategory(categoryPath) {
  try {
    // Use transaction for atomicity DELETE + INSERT
    const saveCategory = db.transaction((path) => {
      // Clear table before insert (since we store only one record)
      db.prepare(`DELETE FROM last_category`).run();

      // Insert new record
      db.prepare(`INSERT INTO last_category (full_path) VALUES (?)`).run(path);
    });

    saveCategory(categoryPath);
    logger.info(`Last category saved: ${categoryPath}`);

    return { success: true };
  } catch (error) {
    logger.error(`Error saving last category: ${error.message}`);
    return { success: false, error: error.message };
  }
}

// Export all functions as single module
export default {
  categoryExists,
  subcategoryExists,
  addCategory,
  removeCategory,
  cleanupCategoryPath,
  updateCategoryPaths,
  getTestsByCategory,
  getLastCategory,
  getAdjacentCategory,
  setLastCategory
}; 