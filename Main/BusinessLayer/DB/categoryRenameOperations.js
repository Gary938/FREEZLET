/**
 * Category rename operations
 * @module BusinessLayer/DB/categoryRenameOperations
 */

import { db } from '../../db.js';
import { getBusinessLogger } from '../../Logger/businessLogger.js';

// Create logger for module
const logger = getBusinessLogger('BusinessLayer:DB:categoryRenameOperations');

/**
 * Updates category paths in database
 * @param {string} oldCategoryPath - Old category path (received from API)
 * @param {string} newCategoryPath - New category path (received from API)
 * @returns {Object} - Operation result
 */
export function updateCategoryPathsInDB(oldCategoryPath, newCategoryPath) {
  try {
    logger.debug('Updating category paths in DB', { oldCategoryPath, newCategoryPath });
    
    let updateCount = 0;
    
    db.transaction(() => {
      // Get all paths that start with oldCategoryPath
      const stmt = db.prepare(`
        SELECT path 
        FROM tests 
        WHERE path = ? 
           OR path LIKE ? 
           OR path LIKE ?`
      );
      
      // Find exact matches and nested paths
      const exactPath = oldCategoryPath;
      const subPath = `${oldCategoryPath}/%`;
      const nestedPath = `${oldCategoryPath}/%/%`;
      
      const rows = stmt.all(exactPath, subPath, nestedPath);

      const updateStmt = db.prepare("UPDATE tests SET path = ? WHERE path = ?");
      for (const row of rows) {
        // Safe replacement of path prefix only (fixed replace bug)
        const updatedPath = row.path.startsWith(oldCategoryPath)
          ? newCategoryPath + row.path.slice(oldCategoryPath.length)
          : row.path;
        logger.debug(`Updating path: ${row.path} → ${updatedPath}`);
        const result = updateStmt.run(updatedPath, row.path);
        if (result.changes > 0) {
          updateCount += result.changes;
        }
      }
    })();
    
    logger.info(`Successfully updated paths in database: ${oldCategoryPath} -> ${newCategoryPath}, records updated: ${updateCount}`);
    return { success: true, updatedCount: updateCount };
  } catch (error) {
    logger.error(`Error updating paths in database: ${error.message}`, error);
    return { success: false, error: error.message };
  }
}

export default {
  updateCategoryPathsInDB
}; 