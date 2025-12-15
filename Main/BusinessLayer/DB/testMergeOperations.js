// Main/BusinessLayer/DB/testMergeOperations.js
// Merged test operations in database

import { db } from '../../db.js';
import { getBusinessLogger } from '../../Logger/businessLogger.js';

// Logger for module
const logger = getBusinessLogger('BusinessLayer:DB:testMergeOperations');

/**
 * Merged test operations in database
 */
export const testMergeOperations = {
  /**
   * Gets all merged tests from MERGE category
   * @returns {{success: boolean, tests?: Array, error?: string}} - Operation result
   */
  getAllMergedTests() {
    try {
      // Query DB to get all tests in MERGE category
      const tests = db.prepare(`
        SELECT * FROM tests
        WHERE path LIKE 'Tests/Merged Tests/%'
        ORDER BY path
      `).all();
      
      logger.debug(`Got ${tests.length} merged tests`);
      return { 
        success: true, 
        tests 
      };
    } catch (error) {
      logger.error(`Error getting merged tests: ${error.message}`);
      return { 
        success: false, 
        error: error.message,
        tests: []
      };
    }
  },

  /**
   * Gets merged test by path
   * @param {string} testPath - Full path to test or filename
   * @returns {{success: boolean, test?: Object, error?: string}} - Operation result
   */
  getMergedTest(testPath) {
    try {
      if (!testPath) {
        logger.warn('Merged test path not specified');
        return { 
          success: false, 
          error: 'Merged test path not specified',
          test: null
        };
      }

      // Form full path if only filename is passed
      const fullPath = testPath.includes('/') ? testPath : `Tests/Merged Tests/${testPath}`;
      
      // Query DB to get test
      const test = db.prepare(`
        SELECT * FROM tests
        WHERE path = ?
      `).get(fullPath);
      
      if (!test) {
        logger.warn(`Merged test not found in DB: ${fullPath}`);
        return { 
          success: false, 
          error: 'Test not found',
          test: null
        };
      }
      
      logger.debug(`Got merged test: ${fullPath}`);
      return { 
        success: true, 
        test 
      };
    } catch (error) {
      logger.error(`Error getting merged test: ${error.message}`);
      return { 
        success: false, 
        error: error.message,
        test: null
      };
    }
  },

  /**
   * Registers merged test in database
   * @param {string} fileName - Merged test filename
   * @param {number} [questionsCount=0] - Number of questions in test
   * @returns {{success: boolean, test?: Object, error?: string}} - Operation result
   */
  registerMergedTest(fileName, questionsCount = 0) {
    try {
      if (!fileName) {
        logger.warn('Merged test file name not specified');
        return { 
          success: false, 
          error: 'Merged test file name not specified',
          test: null
        };
      }

      // Add .txt extension if missing
      const fileNameWithExt = fileName.endsWith('.txt') ? fileName : `${fileName}.txt`;
      
      // Form full file path
      const testPath = `Tests/Merged Tests/${fileNameWithExt}`;
      
      // Get test name from filename (without extension)
      const name = fileNameWithExt.replace(/\.txt$/, '');
      
      // Check if test with this path already exists
      const existingTest = db.prepare('SELECT * FROM tests WHERE path = ?').get(testPath);
      
      if (existingTest) {
        logger.warn(`Test with path ${testPath} already exists in database`);
        return { 
          success: true, 
          test: existingTest, 
          message: 'Test already exists in database' 
        };
      }
      
      // Add record to database
      const insertResult = db.prepare(`
        INSERT INTO tests (path, name, stage, stars, percentage, questions, attempts)
        VALUES (?, ?, 0, 0, 0, ?, 0)
      `).run(testPath, name, questionsCount);
      
      if (insertResult.changes !== 1) {
        logger.warn(`Failed to register merged test: ${testPath}`);
        return { 
          success: false, 
          error: 'Failed to register merged test',
          test: null
        };
      }
      
      logger.success(`Merged test registered: ${testPath}`);
      return {
        success: true,
        test: {
          path: testPath,
          name: name,
          questions: questionsCount,
          stage: 0,
          stars: 0,
          percentage: 0,
          attempts: 0
        }
      };
    } catch (error) {
      logger.error(`Error registering merged test: ${error.message}`);
      return {
        success: false,
        error: error.message,
        test: null
      };
    }
  },

  /**
   * Deletes merged test
   * @param {string} testPath - Test path or filename
   * @returns {{success: boolean, path?: string, error?: string}} - Operation result
   */
  deleteMergedTest(testPath) {
    try {
      if (!testPath) {
        logger.warn('Merged test path for deletion not specified');
        return { 
          success: false, 
          error: 'Merged test path for deletion not specified'
        };
      }

      // Form full path if only filename is passed
      const fullPath = testPath.includes('/')
        ? testPath
        : `Tests/Merged Tests/${testPath}${testPath.endsWith('.txt') ? '' : '.txt'}`;
      
      // Check if test exists in DB
      const test = db.prepare('SELECT * FROM tests WHERE path = ?').get(fullPath);
      
      if (!test) {
        logger.warn(`Test with path ${fullPath} not found in database`);
        return { 
          success: false, 
          error: 'Test not found in database' 
        };
      }
      
      // Delete record from DB
      const deleteResult = db.prepare('DELETE FROM tests WHERE path = ?').run(fullPath);
      
      if (deleteResult.changes !== 1) {
        logger.warn(`Failed to delete merged test from DB: ${fullPath}`);
        return { 
          success: false, 
          error: 'Failed to delete test from DB'
        };
      }
      
      logger.success(`Merged test deleted from DB: ${fullPath}`);
      return {
        success: true,
        path: fullPath
      };
    } catch (error) {
      logger.error(`Error deleting merged test: ${error.message}`);
      return {
        success: false,
        error: error.message
      };
    }
  }
};

export default testMergeOperations; 