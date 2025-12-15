import { db } from '../../db.js';
import { mainLogger } from '../../loggerHub.js';

/**
 * Forms standard path to category
 * @param {string} categoryName - Category name
 * @returns {string} - Path to category
 */
export function getCategoryPath(categoryName) {
  // Check if path already starts with Tests/ to avoid duplication
  return categoryName.startsWith('Tests/') ? categoryName : `Tests/${categoryName}`;
}

/**
 * Checks category existence in DB
 * @param {string} categoryName - Category name
 * @returns {boolean} - Whether category exists
 */
export function categoryExistsInDB(categoryName) {
  try {
    // Check if category name starts with Tests/ to avoid duplication
    const categoryPath = categoryName.startsWith('Tests/') ? categoryName : `Tests/${categoryName}`;

    // Search for any tests belonging to this category
    const stmt = db.prepare(`
      SELECT COUNT(*) as count FROM tests
      WHERE path LIKE ?
    `);

    const result = stmt.get(`${categoryPath}/%`);
    const exists = result.count > 0;

    mainLogger.debug('categoryUtils', `Checking category ${categoryPath} existence in DB: ${exists ? 'exists' : 'does not exist'}`);
    return exists;
  } catch (error) {
    mainLogger.error('categoryUtils', `Error checking category existence in DB: ${error.message}`);
    return false;
  }
}

/**
 * Formats category path for DB queries
 * @param {string|Object} categoryPath - Category path to format or object with path field
 * @returns {string} - Formatted path for queries (no trailing slash)
 */
export function formatPathForQuery(categoryPath) {
  try {
    if (!categoryPath) return '';

    // Extract path string
    let pathToNormalize = '';
    if (typeof categoryPath === 'string') {
      pathToNormalize = categoryPath;
    } else if (typeof categoryPath === 'object' && categoryPath.path) {
      mainLogger.info('categoryUtils', `Received object instead of string, using categoryPath.path: ${categoryPath.path}`);
      pathToNormalize = categoryPath.path;
    } else {
      mainLogger.warn('categoryUtils', `Invalid data type for path: ${typeof categoryPath}`);
      return '';
    }

    // Normalize path
    let normalized = pathToNormalize.trim();
    normalized = normalized.replace(/\/+$/, ''); // Remove trailing slash

    // Add Tests/ prefix if missing
    if (!normalized.startsWith('Tests/')) {
      normalized = `Tests/${normalized}`;
    }

    mainLogger.debug('categoryUtils', `Formatting path for query: ${categoryPath} → ${normalized}`);
    return normalized;
  } catch (error) {
    mainLogger.error('categoryUtils', `Error formatting path for query: ${error.message}`);
    return typeof categoryPath === 'string' ? categoryPath : '';
  }
}
