// Main/API/TestAPI/testDelete.js
// API for test deletion

import path from 'path';
import { createApiLogger, logApiStart, logApiSuccess, logApiError } from '../../Logger/apiLogger.js';
import { formatPathForQuery } from '../../Utils/pathUtils.js';
import { getBasePath } from '../../Utils/appPaths.js';

// Import business layer modules
import { testRepository } from '../../BusinessLayer/DB/testRepository.js';
import { testFsOperations } from '../../BusinessLayer/FileSystem/testFsOperations.js';

// Create logger for module
const logger = createApiLogger('TestAPI:testDelete');

/**
 * Deletes test at specified path
 * @param {string} testPath - Test path for deletion
 * @returns {Promise<Object>} - Operation result
 */
export async function deleteTest(testPath) {
  try {
    logApiStart(logger, 'deleteTest', { testPath });
    
    // Check and normalize path
    if (!testPath) {
      logApiError(logger, 'deleteTest', new Error('Test path not specified'));
      return { success: false, error: 'Test path not specified' };
    }
    
    // Normalize test path via central utility
    const normalizedTestPath = formatPathForQuery(testPath);
    logger.debug(`Normalized test path: ${normalizedTestPath}`);
    
    // Delete test from DB using business layer
    const dbResult = await testRepository.deleteTest(normalizedTestPath);
    
    if (!dbResult.success) {
      logApiError(logger, 'deleteTest', new Error(dbResult.error));
      return { success: false, error: dbResult.error };
    }
    
    // Delete physical file using business layer
    const osSpecificPath = path.join(getBasePath(), normalizedTestPath.split('/').join(path.sep));
    const fsResult = await testFsOperations.deleteTestFile(osSpecificPath);
    
    // Even if file deletion failed, we consider operation successful,
    // since record was deleted from DB
    if (!fsResult.success) {
      logger.warn(`Failed to delete test file: ${fsResult.error}`);
    }
    
    logApiSuccess(logger, 'deleteTest');
    return { success: true, path: normalizedTestPath };
    
  } catch (error) {
    logApiError(logger, 'deleteTest', error);
    return { success: false, error: error.message };
  }
}

/**
 * Deletes all tests from specified category
 * @param {string} categoryName - Category name for deleting all tests
 * @returns {Promise<Object>} - Operation result
 */
export async function deleteAllTestsFromCategory(categoryName) {
  try {
    logApiStart(logger, 'deleteAllTestsFromCategory', { categoryName });
    
    if (!categoryName) {
      logApiError(logger, 'deleteAllTestsFromCategory', new Error('Category name not specified'));
      return { success: false, error: 'Category name not specified' };
    }
    
    // Form full path to category
    const categoryPath = `Tests/${categoryName}`;
    
    // Delete tests from DB using business layer
    const dbResult = await testRepository.deleteTestsByCategory(categoryPath);
    
    if (!dbResult.success) {
      logApiError(logger, 'deleteAllTestsFromCategory', new Error(dbResult.error));
      return { success: false, error: dbResult.error };
    }
    
    // If there are physical files to delete
    if (dbResult.deletedPaths && dbResult.deletedPaths.length > 0) {
      logger.info(`Deleting ${dbResult.deletedPaths.length} physical files...`);
      
      // Delete all physical test files
      for (const testPath of dbResult.deletedPaths) {
        try {
          const osSpecificPath = path.join(getBasePath(), testPath.split('/').join(path.sep));
          await testFsOperations.deleteTestFile(osSpecificPath);
        } catch (fileError) {
          // Log error, but continue deleting other files
          logger.error(`Error deleting file ${testPath}: ${fileError.message}`);
        }
      }
    }
    
    logApiSuccess(logger, 'deleteAllTestsFromCategory');
    return { 
      success: true, 
      deletedCount: dbResult.deletedPaths ? dbResult.deletedPaths.length : 0,
      categoryName
    };
    
  } catch (error) {
    logApiError(logger, 'deleteAllTestsFromCategory', error);
    return { success: false, error: error.message };
  }
}

/**
 * Deletes multiple tests at specified paths
 * @param {Array<string>} testPaths - Array of test paths for deletion
 * @returns {Promise<Object>} - Operation result
 */
export async function deleteMultipleTests(testPaths) {
  try {
    logApiStart(logger, 'deleteMultipleTests', { testPathsCount: testPaths ? testPaths.length : 0 });
    
    if (!testPaths || !Array.isArray(testPaths) || testPaths.length === 0) {
      logApiError(logger, 'deleteMultipleTests', new Error('Test paths for deletion not specified'));
      return { 
        success: false, 
        deleted: [],
        failed: [],
        error: 'Test paths for deletion not specified'
      };
    }
    
    const results = {
      success: true,
      deleted: [],
      failed: [],
      error: null
    };
    
    // Process each test
    for (const testPath of testPaths) {
      const result = await deleteTest(testPath);
      
      if (result.success) {
        results.deleted.push({
          path: result.path
        });
      } else {
        results.failed.push({
          path: testPath,
          error: result.error
        });
      }
    }
    
    // If there are failed deletions but also successful ones
    if (results.failed.length > 0 && results.deleted.length > 0) {
      results.error = `Failed to delete ${results.failed.length} of ${testPaths.length} tests`;
    } 
    // If all deletions failed
    else if (results.failed.length > 0 && results.deleted.length === 0) {
      results.success = false;
      results.error = 'Failed to delete any test';
      logApiError(logger, 'deleteMultipleTests', new Error(results.error));
      return results;
    }
    
    logger.info(`Deletion completed: ${results.deleted.length} successful, ${results.failed.length} with errors`);
    logApiSuccess(logger, 'deleteMultipleTests');
    return results;
  } catch (error) {
    logApiError(logger, 'deleteMultipleTests', error);
    return { 
      success: false, 
      deleted: [],
      failed: testPaths.map(path => ({ path, error: error.message })),
      error: error.message 
    };
  }
} 
