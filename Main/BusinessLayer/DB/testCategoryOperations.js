// Main/BusinessLayer/DB/testCategoryOperations.js
// Test operations in categories in database

import { db } from '../../db.js';
import { getBusinessLogger } from '../../Logger/businessLogger.js';
import { formatPathForQuery } from '../../Utils/pathUtils.js';

// Logger for module
const logger = getBusinessLogger('BusinessLayer:DB:testCategoryOperations');

/**
 * Test operations in categories in database
 */
export const testCategoryOperations = {
  /**
   * Gets tests for specified category
   * @param {string} categoryPath - Path to category
   * @returns {{success: boolean, tests?: Array, error?: string}} - Operation result
   */
  getByCategory(categoryPath) {
    try {
      if (!categoryPath) {
        logger.warn('Category path not specified');
        return { 
          success: false, 
          error: 'Category path not specified',
          tests: []
        };
      }

      // Prepare path for query
      const searchPath = `${categoryPath}/%`;
      
      // Get tests from specified category, excluding category markers
      const tests = db.prepare(`
        SELECT * FROM tests
        WHERE path LIKE ? 
        AND (is_category_marker = 0 OR is_category_marker IS NULL)
        ORDER BY path
      `).all(searchPath);
      
      // Process test names - remove file extensions (without mutating original)
      const processedTests = tests.map(test => ({
        ...test,
        name: test.name?.endsWith('.txt') ? test.name.replace(/\.txt$/, '') : test.name
      }));
      
      logger.debug(`Got ${processedTests.length} tests for category ${categoryPath}`);
      return { 
        success: true, 
        tests: processedTests 
      };
    } catch (error) {
      logger.error(`Error getting category ${categoryPath} tests: ${error.message}`);
      return { 
        success: false, 
        error: error.message,
        tests: []
      };
    }
  },

  /**
   * Deletes all tests from specified category
   * @param {string} categoryPath - Path to category
   * @returns {{success: boolean, deletedPaths?: Array<string>, error?: string}} - Operation result
   */
  deleteTestsByCategory(categoryPath) {
    try {
      if (!categoryPath) {
        logger.warn('Category path for test deletion not specified');
        return { 
          success: false, 
          error: 'Category path for test deletion not specified',
          deletedPaths: []
        };
      }

      // Prepare path for query
      const searchPath = `${categoryPath}/%`;
      
      // Get list of tests for deletion
      const testsToDelete = db.prepare(`
        SELECT path FROM tests
        WHERE path LIKE ?
      `).all(searchPath);
      
      if (testsToDelete.length === 0) {
        logger.info(`No tests to delete in category ${categoryPath}`);
        return { 
          success: true, 
          deletedPaths: [] 
        };
      }
      
      // Extract only paths
      const testPaths = testsToDelete.map(test => test.path);
      
      // Delete all category tests
      db.prepare(`
        DELETE FROM tests
        WHERE path LIKE ?
      `).run(searchPath);
      
      logger.success(`Deleted ${testPaths.length} tests from category ${categoryPath}`);
      return { 
        success: true, 
        deletedPaths: testPaths 
      };
    } catch (error) {
      logger.error(`Error deleting tests from category: ${error.message}`);
      return { 
        success: false, 
        error: error.message,
        deletedPaths: []
      };
    }
  },

  /**
   * Checks if there are tests (except placeholders) in specified category
   * @param {string} categoryPath - Path to category
   * @returns {{success: boolean, hasTests: boolean, count: number, error?: string}} - Check result
   */
  categoryHasTests(categoryPath) {
    try {
      if (!categoryPath) {
        logger.warn('Category path for check not specified');
        return { 
          success: false, 
          error: 'Category path for check not specified',
          hasTests: false,
          count: 0
        };
      }

      // Prepare path for query
      const searchPath = `${categoryPath}/%`;
      
      // Count tests in category
      const result = db.prepare(`
        SELECT COUNT(*) as count FROM tests
        WHERE path LIKE ?
      `).get(searchPath);
      
      const hasTests = result.count > 0;
      
      logger.debug(`Checking for tests in category ${categoryPath}: ${hasTests ? 'yes' : 'no'} (${result.count})`);
      return { 
        success: true, 
        hasTests,
        count: result.count
      };
    } catch (error) {
      logger.error(`Error checking for tests in category: ${error.message}`);
      return { 
        success: false, 
        error: error.message,
        hasTests: false,
        count: 0
      };
    }
  },

  /**
   * Gets list of tests from specified category
   * @param {string} categoryPath - Path to category
   * @returns {Array} - List of tests in category
   */
  getTestsByCategory(categoryPath) {
    try {
      if (!categoryPath) {
        logger.warn('Category path not specified');
        return [];
      }

      // Form correct path for query to get only tests directly in category
      // without subcategories
      const formattedPath = formatPathForQuery(categoryPath);
      const escapedPath = formattedPath.replace(/([%_])/g, '\\$1'); // Escape SQL special characters
      
      // Get all tests only from specified category, without subcategories
      const stmt = db.prepare(`
        SELECT * FROM tests
        WHERE 
          -- Find tests located directly in this category
          -- and exclude those in subcategories
          path LIKE ? 
          AND path NOT LIKE ? || '/%/%'
          -- Exclude category markers
          AND (is_category_marker = 0 OR is_category_marker IS NULL)
        ORDER BY name COLLATE NOCASE ASC
      `);
      
      const tests = stmt.all(`${formattedPath}/%`, escapedPath);
      
      // Process test names - remove file extensions (without mutating original)
      const processedTests = tests.map(test => ({
        ...test,
        name: test.name?.endsWith('.txt') ? test.name.replace(/\.txt$/, '') : test.name
      }));
      
      logger.debug(`Got ${processedTests.length} tests from category ${categoryPath} (excluding subcategories)`);
      
      return processedTests;
    } catch (error) {
      logger.error(`Error getting tests from category ${categoryPath}: ${error.message}`);
      throw new Error(`Error getting tests from category: ${error.message}`);
    }
  }
};

export default testCategoryOperations; 