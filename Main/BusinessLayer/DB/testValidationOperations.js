// Main/BusinessLayer/DB/testValidationOperations.js
// Operations for validation and test existence check in database

import { db } from '../../db.js';
import { getBusinessLogger } from '../../Logger/businessLogger.js';

// Logger for module
const logger = getBusinessLogger('BusinessLayer:DB:testValidationOperations');

/**
 * Operations for validation and test existence check in database
 */
export const testValidationOperations = {
  /**
   * Checks if test exists in database
   * @param {string} testPath - Test path
   * @returns {{success: boolean, exists: boolean, error?: string}} - Check result
   */
  testExists(testPath) {
    try {
      if (!testPath) {
        logger.warn('Test path for check not specified');
        return { 
          success: false, 
          error: 'Test path for check not specified',
          exists: false
        };
      }

      const test = db.prepare('SELECT path FROM tests WHERE path = ?').get(testPath);
      
      logger.debug(`Checking test ${testPath} existence: ${test ? 'exists' : 'does not exist'}`);
      return { 
        success: true, 
        exists: !!test 
      };
    } catch (error) {
      logger.error(`Error checking test existence: ${error.message}`);
      return { 
        success: false, 
        error: error.message,
        exists: false
      };
    }
  },

  /**
   * Checks file existence in database
   * @param {string} filePath - File path
   * @returns {boolean} - Whether file exists in DB
   */
  fileExistsInDB(filePath) {
    try {
      const stmt = db.prepare('SELECT COUNT(*) as count FROM tests WHERE path = ?');
      const result = stmt.get(filePath);
      return result.count > 0;
    } catch (error) {
      logger.error(`Error checking file existence in DB: ${error.message}`);
      return false;
    }
  },

  /**
   * Gets list of full paths of selected tests by their identifiers
   * @param {string[]} testIds - Array of test identifiers
   * @returns {{success: boolean, paths: string[], error: string|null}} - Path retrieval result
   */
  getSelectedTestPaths(testIds) {
    try {
      if (!Array.isArray(testIds) || testIds.length === 0) {
        logger.warn('Requesting paths for empty test ID list');
        return { success: true, paths: [], error: null };
      }

      logger.debug(`Requesting paths for ${testIds.length} selected tests`);
      
      // Generate placeholders for query
      const placeholders = testIds.map(() => '?').join(',');
      
      // Query DB to get paths by identifiers
      const stmt = db.prepare(`
        SELECT path FROM tests
        WHERE id IN (${placeholders})
        ORDER BY path
      `);
      
      const paths = stmt.all(...testIds).map(row => row.path);
      logger.debug(`Got ${paths.length} paths for selected tests`);
      
      return { success: true, paths, error: null };
    } catch (error) {
      logger.error(`Error getting selected test paths: ${error.message}`);
      return { success: false, paths: [], error: error.message };
    }
  },

  /**
   * Validates and formats list of selected test paths
   * @param {string[]} paths - Array of test paths
   * @returns {{success: boolean, formattedPaths: string[], error: string|null}} - Validation and formatting result
   */
  validateAndFormatTestPaths(paths) {
    try {
      if (!Array.isArray(paths)) {
        logger.warn('Attempt to validate invalid path list (not array)');
        return { success: false, formattedPaths: [], error: 'Invalid path list format' };
      }

      // Filter and format paths
      const formattedPaths = paths
        .filter(path => typeof path === 'string' && path.trim() !== '')
        .map(path => {
          // Path formatting: remove extra slashes, standardize
          return path.replace(/\\/g, '/').replace(/\/+$/, '');
        });

      logger.debug(`Validated ${formattedPaths.length} of ${paths.length} paths`);
      return { success: true, formattedPaths, error: null };
    } catch (error) {
      logger.error(`Error validating selected test paths: ${error.message}`);
      return { success: false, formattedPaths: [], error: error.message };
    }
  },

  /**
   * Checks validity of selected tests
   * @param {string[]} testPaths - Array of test paths
   * @returns {{success: boolean, validCount: number, isValid: boolean, error: string|null}} - Check result
   */
  validateTestSelection(testPaths) {
    try {
      if (!Array.isArray(testPaths)) {
        logger.warn('Attempt to check invalid test list (not array)');
        return { success: false, validCount: 0, isValid: false, error: 'Invalid test list format' };
      }

      // Check existence of each test in DB
      const validTests = [];
      
      for (const path of testPaths) {
        if (this.fileExistsInDB(path)) {
          validTests.push(path);
        } else {
          logger.warn(`Test not found in DB: ${path}`);
        }
      }

      const isValid = validTests.length > 0;
      logger.debug(`Test selection check: ${validTests.length} valid of ${testPaths.length}`);
      
      return {
        success: true,
        validCount: validTests.length,
        isValid,
        error: null
      };
    } catch (error) {
      logger.error(`Error checking selected tests: ${error.message}`);
      return { success: false, validCount: 0, isValid: false, error: error.message };
    }
  }
};

export default testValidationOperations; 