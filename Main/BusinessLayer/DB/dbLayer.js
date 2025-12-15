// Main/BusinessLayer/DB/dbLayer.js
// Database access layer

import { getBusinessLogger } from '../../Logger/businessLogger.js';
import { db } from '../../db.js';

// Create logger for this module
const logger = getBusinessLogger('BusinessLayer:DB:dbLayer');

// Log module loading
logger.info('Initializing dbLayer');

/**
 * Executes SQL query with prepared parameters
 * @param {string} sql - SQL query
 * @param {Array} params - Query parameters
 * @returns {Array} - Query result
 */
export function executeQuery(sql, params = []) {
  try {
    const stmt = db.prepare(sql);
    return stmt.all(...params);
  } catch (error) {
    logger.error('Query execution error', error);
    throw error;
  }
}

/**
 * Executes SQL query returning single row
 * @param {string} sql - SQL query
 * @param {Array} params - Query parameters
 * @returns {Object} - Query result
 */
export function executeQuerySingle(sql, params = []) {
  try {
    const stmt = db.prepare(sql);
    return stmt.get(...params);
  } catch (error) {
    logger.error('Query execution error', error);
    throw error;
  }
}

/**
 * Executes SQL query without returning data
 * @param {string} sql - SQL query
 * @param {Array} params - Query parameters
 * @returns {Object} - Result information
 */
export function executeStatement(sql, params = []) {
  try {
    const stmt = db.prepare(sql);
    const result = stmt.run(...params);
    return {
      changes: result.changes,
      lastInsertRowid: result.lastInsertRowid
    };
  } catch (error) {
    logger.error('Query execution error', error);
    throw error;
  }
}

/**
 * Executes transaction with set of operations
 * @param {Function} transactionFn - Transaction function
 * @returns {*} - Transaction result
 */
export function executeTransaction(transactionFn) {
  try {
    const transaction = db.transaction(transactionFn);
    return transaction();
  } catch (error) {
    logger.error('Transaction execution error', error);
    throw error;
  }
}

// Duplicate functions removed (getAllTests, getTestsByCategory, addTest, updateTest, deleteTest, renameCategoryPath)
// Use testRepository or categoryRepository for these operations

// Export only basic SQL functions
export const dbLayer = {
  executeQuery,
  executeQuerySingle,
  executeStatement,
  executeTransaction
};

// Log successful loading
logger.success('dbLayer loaded successfully');

export default dbLayer; 