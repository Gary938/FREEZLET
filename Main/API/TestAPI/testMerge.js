import path from 'path';
import { createApiLogger, logApiStart, logApiSuccess, logApiError } from '../../Logger/apiLogger.js';
import { getBasePath } from '../../Utils/appPaths.js';

// Import business layer modules
import { testRepository } from '../../BusinessLayer/DB/testRepository.js';
import { testFsOperations } from '../../BusinessLayer/FileSystem/testFsOperations.js';

// Create logger for module
const logger = createApiLogger('TestAPI:testMerge');

/**
 * Registers merged test in database
 * @param {string} fileName - Merged test file name
 * @param {number} [questionsCount=0] - Number of questions in test
 * @returns {Promise<Object>} - Operation result
 */
export async function registerMergedTest(fileName, questionsCount = 0) {
  try {
    logApiStart(logger, 'registerMergedTest', { fileName, questionsCount });
    
    if (!fileName) {
      logApiError(logger, 'registerMergedTest', new Error('File name not specified'));
      return { success: false, error: 'File name not specified' };
    }
    
    // Use business layer to register test in DB
    const result = await testRepository.registerMergedTest(fileName, questionsCount);
    
    if (!result.success) {
      logApiError(logger, 'registerMergedTest', new Error(result.error));
      return { success: false, error: result.error };
    }
    
    logApiSuccess(logger, 'registerMergedTest');
    return {
      success: true,
      test: result.test,
      message: result.message
    };
  } catch (error) {
    logApiError(logger, 'registerMergedTest', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Gets list of all merged tests
 * @returns {Promise<Object>} - Operation result with test list
 */
export async function getAllMergedTests() {
  try {
    logApiStart(logger, 'getAllMergedTests');
    
    // Use business layer to get merged tests list
    const result = await testRepository.getAllMergedTests();
    
    if (!result.success) {
      logApiError(logger, 'getAllMergedTests', new Error(result.error));
      return { success: false, error: result.error, tests: [] };
    }
    
    logApiSuccess(logger, 'getAllMergedTests');
    return {
      success: true,
      tests: result.tests
    };
  } catch (error) {
    logApiError(logger, 'getAllMergedTests', error);
    return {
      success: false,
      error: error.message,
      tests: []
    };
  }
}

/**
 * Gets merged test by path
 * @param {string} testPath - Test path or filename
 * @returns {Promise<Object>} - Operation result with test data
 */
export async function getMergedTest(testPath) {
  try {
    logApiStart(logger, 'getMergedTest', { testPath });
    
    if (!testPath) {
      logApiError(logger, 'getMergedTest', new Error('Test path not specified'));
      return { success: false, error: 'Test path not specified', test: null };
    }
    
    // Use business layer to get test from DB
    const result = await testRepository.getMergedTest(testPath);
    
    if (!result.success) {
      logApiError(logger, 'getMergedTest', new Error(result.error));
      return { success: false, error: result.error, test: null };
    }
    
    logApiSuccess(logger, 'getMergedTest');
    return {
      success: true,
      test: result.test
    };
  } catch (error) {
    logApiError(logger, 'getMergedTest', error);
    return {
      success: false,
      error: error.message,
      test: null
    };
  }
}

/**
 * Deletes merged test
 * @param {string} testPath - Test path or filename
 * @returns {Promise<Object>} - Operation result
 */
export async function deleteMergedTest(testPath) {
  try {
    logApiStart(logger, 'deleteMergedTest', { testPath });
    
    if (!testPath) {
      logApiError(logger, 'deleteMergedTest', new Error('Test path not specified'));
      return { success: false, error: 'Test path not specified' };
    }
    
    // Use business layer to delete test from DB
    const dbResult = await testRepository.deleteMergedTest(testPath);
    
    if (!dbResult.success) {
      logApiError(logger, 'deleteMergedTest', new Error(dbResult.error));
      return { success: false, error: dbResult.error };
    }
    
    // Form physical path to file
    const fullPath = dbResult.path;
    const physicalPath = path.join(getBasePath(), fullPath);
    
    // Use business layer to delete file
    const fsResult = await testFsOperations.deleteTestFile(physicalPath);
    
    // If file deletion failed but DB record deleted, consider operation successful
    if (!fsResult.success) {
      logger.warn(`Failed to delete merged test file: ${fsResult.error}`);
    }
    
    logApiSuccess(logger, 'deleteMergedTest');
    return {
      success: true,
      path: fullPath
    };
  } catch (error) {
    logApiError(logger, 'deleteMergedTest', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Merges multiple tests into single file
 * @param {Array<string>} testPaths - Array of test paths to merge
 * @param {string} outputFileName - File name to save result
 * @returns {Promise<Object>} - Operation result
 */
export async function mergeTests(testPaths, outputFileName) {
  try {
    logApiStart(logger, 'mergeTests', { testPathsCount: testPaths?.length, outputFileName });
    
    if (!testPaths || !Array.isArray(testPaths) || testPaths.length === 0) {
      logApiError(logger, 'mergeTests', new Error('Test paths for merge not specified'));
      return { success: false, error: 'Test paths for merge not specified' };
    }
    
    if (!outputFileName) {
      logApiError(logger, 'mergeTests', new Error('Output file name not specified'));
      return { success: false, error: 'Output file name not specified' };
    }
    
    // Form full path for output file
    const outputPath = path.join(getBasePath(), 'Tests', 'Merged Tests', outputFileName.endsWith('.txt') ? outputFileName : `${outputFileName}.txt`);

    // Use business layer to merge tests
    const mergeResult = await testFsOperations.mergeTests(testPaths.map(p => path.join(getBasePath(), p)), outputPath);
    
    if (!mergeResult.success) {
      logApiError(logger, 'mergeTests', new Error(mergeResult.error));
      return { success: false, error: mergeResult.error };
    }
    
    // Register merged test in DB
    const dbPath = `Tests/Merged Tests/${path.basename(outputPath)}`;
    const registerResult = await testRepository.registerMergedTest(path.basename(outputPath), mergeResult.questionsCount);
    
    if (!registerResult.success) {
      logger.warn(`File created successfully but failed to register in DB: ${registerResult.error}`);
      return { 
        success: true, 
        warning: `File created but not registered in DB: ${registerResult.error}`,
        path: dbPath,
        questionsCount: mergeResult.questionsCount
      };
    }
    
    logApiSuccess(logger, 'mergeTests');
    return {
      success: true,
      test: registerResult.test,
      questionsCount: mergeResult.questionsCount,
      path: dbPath
    };
  } catch (error) {
    logApiError(logger, 'mergeTests', error);
    return {
      success: false,
      error: error.message
    };
  }
} 
