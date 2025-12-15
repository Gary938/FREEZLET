// Main/BusinessLayer/DB/testBasicOperations.js
// Basic test operations in database

import { db } from '../../db.js';
import { getBusinessLogger } from '../../Logger/businessLogger.js';

// Logger for module
const logger = getBusinessLogger('BusinessLayer:DB:testBasicOperations');

/**
 * Basic test operations in database
 */
export const testBasicOperations = {
  /**
   * Gets all tests from database
   * @returns {{success: boolean, tests?: Array, error?: string}} - Operation result
   */
  getAll() {
    try {
      const tests = db.prepare(`
        SELECT * FROM tests
        ORDER BY path
      `).all();
      
      logger.debug(`Got ${tests.length} tests from database`);
      return { 
        success: true, 
        tests 
      };
    } catch (error) {
      logger.error(`Error getting test list: ${error.message}`);
      return { 
        success: false, 
        error: error.message,
        tests: []
      };
    }
  },

  /**
   * Gets test by specified path
   * @param {string} testPath - Test path
   * @returns {{success: boolean, test?: Object, error?: string}} - Operation result
   */
  getTestByPath(testPath) {
    try {
      if (!testPath) {
        logger.warn('Test path not specified');
        return { 
          success: false, 
          error: 'Test path not specified',
          test: null 
        };
      }

      const test = db.prepare(`
        SELECT * FROM tests
        WHERE path = ?
      `).get(testPath);
      
      if (!test) {
        logger.warn(`Test not found in DB: ${testPath}`);
        return { 
          success: false, 
          error: 'Test not found',
          test: null
        };
      }
      
      logger.debug(`Got test: ${testPath}`);
      return { 
        success: true, 
        test 
      };
    } catch (error) {
      logger.error(`Error getting test ${testPath}: ${error.message}`);
      return { 
        success: false, 
        error: error.message,
        test: null
      };
    }
  },

  /**
   * Adds new test to database
   * @param {Object} testData - Test data to add
   * @param {string} testData.path - Test path
   * @param {string} testData.name - Test name
   * @param {number} [testData.stage=0] - Execution stage
   * @param {number} [testData.stars=0] - Number of stars
   * @param {number} [testData.percentage=0] - Completion percentage
   * @param {number} [testData.questions=0] - Number of questions
   * @param {number} [testData.attempts=0] - Number of attempts
   * @returns {{success: boolean, test?: Object, error?: string}} - Operation result
   */
  insertTest(testData) {
    try {
      if (!testData || !testData.path) {
        logger.warn('Invalid test data for insert');
        return { 
          success: false, 
          error: 'Invalid test data for insert',
          test: null
        };
      }

      // Check if test with this path already exists
      const existingTest = db.prepare('SELECT * FROM tests WHERE path = ?').get(testData.path);
      
      if (existingTest) {
        logger.warn(`Test with path ${testData.path} already exists in database`);
        return { 
          success: false, 
          error: 'Test already exists in database',
          test: existingTest
        };
      }
      
      // Default values
      const stage = testData.stage || 0;
      const stars = testData.stars || 0;
      const percentage = testData.percentage || 0;
      const questions = testData.questions || 0;
      const attempts = testData.attempts || 0;
      
      // Insert test into database
      const insertResult = db.prepare(`
        INSERT INTO tests (path, name, stage, stars, percentage, questions, attempts)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `).run(
        testData.path, 
        testData.name, 
        stage, 
        stars, 
        percentage, 
        questions, 
        attempts
      );
      
      if (insertResult.changes !== 1) {
        logger.warn(`Failed to insert test into DB: ${testData.path}`);
        return { 
          success: false, 
          error: 'Failed to insert test into DB',
          test: null
        };
      }
      
      logger.success(`Test added to DB: ${testData.path}`);
      return { 
        success: true, 
        test: { 
          path: testData.path,
          name: testData.name,
          stage, 
          stars, 
          percentage, 
          questions, 
          attempts
        } 
      };
    } catch (error) {
      logger.error(`Error adding test to DB: ${error.message}`);
      return { 
        success: false, 
        error: error.message,
        test: null
      };
    }
  },

  /**
   * Updates test data by specified path
   * @param {string} testPath - Test path to update
   * @param {Object} updates - Updates to apply
   * @returns {{success: boolean, error?: string}} - Operation result
   */
  updateTest(testPath, updates) {
    try {
      if (!testPath) {
        logger.warn('Test path for update not specified');
        return { 
          success: false, 
          error: 'Test path for update not specified'
        };
      }

      if (!updates || Object.keys(updates).length === 0) {
        logger.warn('Test updates not specified');
        return { 
          success: false, 
          error: 'Updates for test not specified'
        };
      }

      // Check if test exists
      const existingTest = db.prepare('SELECT * FROM tests WHERE path = ?').get(testPath);
      
      if (!existingTest) {
        logger.warn(`Test for update not found: ${testPath}`);
        return { 
          success: false, 
          error: 'Test for update not found'
        };
      }
      
      // Build dynamic query to update only passed fields
      const allowedFields = ['name', 'stage', 'stars', 'percentage', 'questions', 'attempts'];
      const updateFields = [];
      const updateValues = [];
      
      for (const [key, value] of Object.entries(updates)) {
        if (allowedFields.includes(key)) {
          updateFields.push(`${key} = ?`);
          updateValues.push(value);
        }
      }
      
      if (updateFields.length === 0) {
        logger.warn('No valid fields for test update');
        return { 
          success: false, 
          error: 'No valid fields for update'
        };
      }
      
      // Add path to values for WHERE condition
      updateValues.push(testPath);
      
      const updateQuery = `
        UPDATE tests
        SET ${updateFields.join(', ')}
        WHERE path = ?
      `;
      
      const updateResult = db.prepare(updateQuery).run(...updateValues);
      
      if (updateResult.changes !== 1) {
        logger.warn(`Failed to update test: ${testPath}`);
        return { 
          success: false, 
          error: 'Failed to update test'
        };
      }
      
      logger.success(`Test updated: ${testPath}`);
      return { 
        success: true 
      };
    } catch (error) {
      logger.error(`Error updating test: ${error.message}`);
      return { 
        success: false, 
        error: error.message
      };
    }
  },

  /**
   * Deletes test from database
   * @param {string} testPath - Test path for deletion
   * @returns {{success: boolean, path?: string, error?: string}} - Operation result
   */
  deleteTest(testPath) {
    try {
      if (!testPath) {
        logger.warn(`Test path for deletion not specified`);
        return {
          success: false,
          error: 'Test path for deletion not specified'
        };
      }

      // Delete record from DB and check result via changes
      const result = db.prepare('DELETE FROM tests WHERE path = ?').run(testPath);

      if (result.changes === 0) {
        logger.warn(`Test not found in DB: ${testPath}`);
        return {
          success: false,
          error: 'Test not found in database'
        };
      }

      logger.success(`Test deleted from DB: ${testPath}`);
      return {
        success: true,
        path: testPath
      };
    } catch (error) {
      logger.error(`Error deleting test: ${error.message}`);
      return {
        success: false,
        error: error.message
      };
    }
  },

  /**
   * Loads test into database
   * @param {string} testPath - Test path to add to DB
   * @param {string} testName - Test name
   * @param {number} questionsCount - Number of questions in test
   * @param {boolean} [updateIfExists=true] - Whether to update test if it already exists
   * @returns {Promise<{success: boolean, test?: Object, updated?: boolean, error?: string}>} - Operation result
   */
  async uploadTest(testPath, testName, questionsCount, updateIfExists = true) {
    try {
      if (!testPath) {
        logger.warn('Test path for DB upload not specified');
        return { 
          success: false, 
          error: 'Test path for DB upload not specified',
          test: null
        };
      }

      if (!testName) {
        logger.warn('Test name for DB upload not specified');
        return { 
          success: false, 
          error: 'Test name for DB upload not specified',
          test: null
        };
      }

      // Check test existence in DB
      const existingTest = db.prepare('SELECT * FROM tests WHERE path = ?').get(testPath);
      
      // If test exists and needs update
      if (existingTest && updateIfExists) {
        // Update existing record
        const updateResult = db.prepare(`
          UPDATE tests 
          SET questions = ?, 
              percentage = 0,
              stage = 0,
              stars = 0,
              attempts = 0
          WHERE path = ?
        `).run(questionsCount, testPath);
        
        if (updateResult.changes !== 1) {
          logger.warn(`Failed to update test in DB: ${testPath}`);
          return { 
            success: false, 
            error: 'Failed to update test in DB',
            test: null
          };
        }
        
        logger.success(`Test updated in DB: ${testPath}`);
        return { 
          success: true, 
          test: {
            path: testPath,
            name: testName,
            questions: questionsCount,
            stage: 0,
            stars: 0,
            percentage: 0,
            attempts: 0
          },
          updated: true
        };
      } 
      // If test exists but no update needed
      else if (existingTest && !updateIfExists) {
        logger.warn(`Test already exists in DB: ${testPath}`);
        return { 
          success: false, 
          error: 'Test already exists in DB',
          test: existingTest
        };
      }
      // If test not in DB
      else {
        // Insert new record
        const insertResult = db.prepare(`
          INSERT INTO tests (path, name, stage, stars, percentage, questions, attempts)
          VALUES (?, ?, 0, 0, 0, ?, 0)
        `).run(testPath, testName, questionsCount);
        
        if (insertResult.changes !== 1) {
          logger.warn(`Failed to add test to DB: ${testPath}`);
          return { 
            success: false, 
            error: 'Failed to add test to DB',
            test: null
          };
        }
        
        logger.success(`Test added to DB: ${testPath}`);
        return { 
          success: true, 
          test: {
            path: testPath,
            name: testName,
            questions: questionsCount,
            stage: 0,
            stars: 0,
            percentage: 0,
            attempts: 0
          },
          updated: false
        };
      }
    } catch (error) {
      logger.error(`Error uploading test to DB: ${error.message}`);
      return { 
        success: false, 
        error: error.message,
        test: null
      };
    }
  },

  /**
   * Renames test in database (updates path and name)
   * @param {string} oldPath - Current test path
   * @param {string} newPath - New test path
   * @param {string} newName - New test name
   * @returns {{success: boolean, error?: string}} - Operation result
   */
  renameTest(oldPath, newPath, newName) {
    try {
      if (!oldPath) {
        logger.warn('Old path for rename not specified');
        return {
          success: false,
          error: 'Old path for rename not specified'
        };
      }

      if (!newPath) {
        logger.warn('New path for rename not specified');
        return {
          success: false,
          error: 'New path for rename not specified'
        };
      }

      if (!newName) {
        logger.warn('New name for rename not specified');
        return {
          success: false,
          error: 'New name for rename not specified'
        };
      }

      // Check if test exists
      const existingTest = db.prepare('SELECT * FROM tests WHERE path = ?').get(oldPath);

      if (!existingTest) {
        logger.warn(`Test for rename not found: ${oldPath}`);
        return {
          success: false,
          error: 'Test for rename not found'
        };
      }

      // Check if new path already exists (if different from old)
      if (oldPath !== newPath) {
        const conflictingTest = db.prepare('SELECT * FROM tests WHERE path = ?').get(newPath);
        if (conflictingTest) {
          logger.warn(`Test with new path already exists: ${newPath}`);
          return {
            success: false,
            error: 'Test with this name already exists'
          };
        }
      }

      // Update path and name
      const updateResult = db.prepare(`
        UPDATE tests
        SET path = ?, name = ?
        WHERE path = ?
      `).run(newPath, newName, oldPath);

      if (updateResult.changes !== 1) {
        logger.warn(`Failed to rename test: ${oldPath}`);
        return {
          success: false,
          error: 'Failed to rename test'
        };
      }

      logger.success(`Test renamed in DB: ${oldPath} → ${newPath}`);
      return {
        success: true
      };
    } catch (error) {
      logger.error(`Error renaming test: ${error.message}`);
      return {
        success: false,
        error: error.message
      };
    }
  },

  /**
   * Gets all tests from database with filter options
   * @param {Object} options - Query parameters
   * @param {string} options.orderBy - Sort field (default 'name')
   * @returns {Array} - Array with test data
   */
  getAllTests(options = {}) {
    try {
      // Whitelist of allowed fields for sorting (SQL injection protection)
      const allowedOrderFields = ['name', 'path', 'stage', 'stars', 'percentage', 'questions', 'attempts'];
      const orderBy = allowedOrderFields.includes(options.orderBy) ? options.orderBy : 'name';

      // Build SQL query
      const sql = `SELECT * FROM tests
                  ORDER BY ${orderBy}`;

      // Execute DB query
      const stmt = db.prepare(sql);
      const tests = stmt.all();

      return tests;
    } catch (error) {
      logger.error(`Error getting all tests: ${error.message}`);
      throw new Error(`Error getting all tests: ${error.message}`);
    }
  }
};

export default testBasicOperations; 