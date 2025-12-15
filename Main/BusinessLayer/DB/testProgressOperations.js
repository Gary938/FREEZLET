// Main/BusinessLayer/DB/testProgressOperations.js
// Test progress operations in database

import { db } from '../../db.js';
import { getBusinessLogger } from '../../Logger/businessLogger.js';

// Logger for module
const logger = getBusinessLogger('BusinessLayer:DB:testProgressOperations');

/**
 * Test progress operations in database
 */
export const testProgressOperations = {
  /**
   * Gets progress for specified test
   * @param {string} testPath - Test path
   * @returns {Object} - Object with progress data
   */
  getProgress(testPath) {
    try {
      if (!testPath) {
        logger.warn('Test path for getting progress not specified');
        return {
          success: false,
          error: 'Test path for getting progress not specified',
          stage: 0,
          stars: 0,
          percentage: 0,
          attempts: 0
        };
      }

      // Get progress data from DB (including attempts)
      const row = db.prepare("SELECT stage, stars, percentage, attempts FROM tests WHERE path = ?").get(testPath);
      
      // If data not found, return zero progress with error
      if (!row) {
        logger.warn(`Test not found for getting progress: ${testPath}`);
        return {
          success: false,
          error: 'Test not found',
          stage: 0,
          stars: 0,
          percentage: 0,
          attempts: 0
        };
      }

      logger.debug(`Got progress for test ${testPath}: stage=${row.stage}, stars=${row.stars}, percentage=${row.percentage}`);
      return { 
        success: true, 
        ...row 
      };
    } catch (error) {
      logger.error(`Error getting test ${testPath} progress: ${error.message}`);
      return {
        success: false,
        error: error.message,
        stage: 0,
        stars: 0,
        percentage: 0,
        attempts: 0
      };
    }
  },

  /**
   * Resets progress for specified test
   * @param {string} testPath - Test path
   * @returns {{success: boolean, error?: string}} - Operation result
   */
  resetProgress(testPath) {
    try {
      if (!testPath) {
        logger.warn('Test path for resetting progress not specified');
        return { 
          success: false, 
          error: 'Test path for progress reset not specified' 
        };
      }

      // Check test existence
      const testExists = db.prepare("SELECT COUNT(*) as count FROM tests WHERE path = ?").get(testPath);
      
      if (testExists.count === 0) {
        logger.warn(`Test not found for resetting progress: ${testPath}`);
        return { 
          success: false, 
          error: 'Test not found' 
        };
      }

      // Reset progress in DB
      const result = db.prepare("UPDATE tests SET stage = 0, stars = 0, percentage = 0 WHERE path = ?").run(testPath);
      
      if (result.changes !== 1) {
        logger.warn(`Failed to reset test progress: ${testPath}`);
        return { 
          success: false, 
          error: 'Failed to reset test progress' 
        };
      }

      logger.success(`Test progress reset: ${testPath}`);
      return { success: true };
    } catch (error) {
      logger.error(`Error resetting test ${testPath} progress: ${error.message}`);
      return { 
        success: false, 
        error: error.message 
      };
    }
  },

  /**
   * Updates progress for specified test
   * @param {string} testPath - Test path
   * @param {Object} data - Data for progress update
   * @param {number} [data.stage] - Test stage
   * @param {number} [data.stars] - Number of stars
   * @param {number} [data.percentage] - Completion percentage
   * @returns {{success: boolean, error?: string}} - Operation result
   */
  updateProgress(testPath, data) {
    try {
      if (!testPath) {
        logger.warn('Test path for updating progress not specified');
        return { 
          success: false, 
          error: 'Test path for progress update not specified' 
        };
      }

      if (!data || Object.keys(data).length === 0) {
        logger.warn('Progress update data not specified');
        return { 
          success: false, 
          error: 'Data for progress update not specified' 
        };
      }

      // Check test existence
      const testExists = db.prepare("SELECT COUNT(*) as count FROM tests WHERE path = ?").get(testPath);
      
      if (testExists.count === 0) {
        logger.warn(`Test not found for updating progress: ${testPath}`);
        return { 
          success: false, 
          error: 'Test not found' 
        };
      }

      // Build SQL query based on passed data
      let sql = "UPDATE tests SET ";
      const params = [];
      const updates = [];
      
      if (data.stage !== undefined) {
        updates.push("stage = ?");
        params.push(data.stage);
      }
      
      if (data.stars !== undefined) {
        updates.push("stars = ?");
        params.push(data.stars);
      }
      
      if (data.percentage !== undefined) {
        updates.push("percentage = ?");
        params.push(data.percentage);
      }
      
      // If no data for update, exit with error
      if (updates.length === 0) {
        logger.warn('No valid data for progress update');
        return { 
          success: false, 
          error: 'No valid data for progress update' 
        };
      }
      
      // Build final SQL query
      sql += updates.join(", ") + " WHERE path = ?";
      params.push(testPath);
      
      // Execute query
      const result = db.prepare(sql).run(...params);
      
      if (result.changes !== 1) {
        logger.warn(`Failed to update test progress: ${testPath}`);
        return { 
          success: false, 
          error: 'Failed to update test progress' 
        };
      }

      logger.success(`Test progress updated: ${testPath}`);
      return { success: true };
    } catch (error) {
      logger.error(`Error updating test ${testPath} progress: ${error.message}`);
      return { 
        success: false, 
        error: error.message 
      };
    }
  },

  /**
   * Increments attempt counter for specified test
   * @param {string} testPath - Test path
   * @returns {{success: boolean, attempts?: number, error?: string}} - Operation result
   */
  incrementAttempts(testPath) {
    try {
      if (!testPath) {
        logger.warn('Test path for incrementing attempts counter not specified');
        return { 
          success: false, 
          error: 'Test path for incrementing attempts not specified' 
        };
      }

      // Check test existence
      const test = db.prepare("SELECT attempts FROM tests WHERE path = ?").get(testPath);
      
      if (!test) {
        logger.warn(`Test not found for incrementing attempts counter: ${testPath}`);
        return { 
          success: false, 
          error: 'Test not found' 
        };
      }

      // Increment attempts counter in DB
      db.prepare("UPDATE tests SET attempts = attempts + 1 WHERE path = ?").run(testPath);
      
      // Get updated counter value
      const updatedTest = db.prepare("SELECT attempts FROM tests WHERE path = ?").get(testPath);
      
      logger.success(`Attempts counter incremented for test ${testPath}: ${updatedTest.attempts}`);
      return { 
        success: true, 
        attempts: updatedTest.attempts 
      };
    } catch (error) {
      logger.error(`Error incrementing test ${testPath} attempts: ${error.message}`);
      return { 
        success: false, 
        error: error.message 
      };
    }
  }
};

export default testProgressOperations; 