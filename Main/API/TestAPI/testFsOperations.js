// Main/API/TestAPI/testFsOperations.js
// API for file system test operations

import { mainLogger } from '../../loggerHub.js';
import { createApiLogger, logApiStart, logApiSuccess, logApiError } from '../../Logger/apiLogger.js';
import * as testFsOperations from '../../BusinessLayer/FileSystem/testFsOperations.js';
import path from 'path';

// Create logger for module
const logger = createApiLogger('TestAPI:fsOperations');

/**
 * Checks test existence in file system
 * @param {string} testPath - Full path to test file
 * @returns {Promise<{success: boolean, exists: boolean, error?: string}>} - Check result
 */
export async function checkTestExists(testPath) {
  try {
    logApiStart(logger, 'checkTestExists', { testPath });
    
    const result = await testFsOperations.checkTestExists(testPath);
    
    logApiSuccess(logger, 'checkTestExists', { exists: result.exists });
    return result;
  } catch (error) {
    logApiError(logger, 'checkTestExists', error);
    return {
      success: false,
      error: error.message,
      exists: false
    };
  }
}

/**
 * Reads test file content
 * @param {string} testPath - Full path to test file
 * @returns {Promise<{success: boolean, content?: string, error?: string}>} - Read result
 */
export async function readTestContent(testPath) {
  try {
    logApiStart(logger, 'readTestContent', { testPath });
    
    const result = await testFsOperations.readTestContent(testPath);
    
    logApiSuccess(logger, 'readTestContent', { 
      success: result.success, 
      contentLength: result.content?.length || 0 
    });
    return result;
  } catch (error) {
    logApiError(logger, 'readTestContent', error);
    return {
      success: false,
      error: error.message,
      content: ''
    };
  }
}

/**
 * Writes content to test file
 * @param {string} testPath - Full path to test file
 * @param {string} content - Content to write
 * @param {boolean} [createDir=true] - Whether to create directory if it doesn't exist
 * @returns {Promise<{success: boolean, path?: string, error?: string}>} - Write result
 */
export async function writeTestContent(testPath, content, createDir = true) {
  try {
    logApiStart(logger, 'writeTestContent', { 
      testPath, 
      contentLength: content?.length || 0,
      createDir 
    });
    
    const result = await testFsOperations.writeTestContent(testPath, content, createDir);
    
    logApiSuccess(logger, 'writeTestContent', { success: result.success });
    return result;
  } catch (error) {
    logApiError(logger, 'writeTestContent', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Deletes test file from file system
 * @param {string} testPath - Full path to test file
 * @returns {Promise<{success: boolean, path?: string, error?: string}>} - Deletion result
 */
export async function deleteTestFile(testPath) {
  try {
    logApiStart(logger, 'deleteTestFile', { testPath });
    
    const result = await testFsOperations.deleteTestFile(testPath);
    
    logApiSuccess(logger, 'deleteTestFile', { success: result.success });
    return result;
  } catch (error) {
    logApiError(logger, 'deleteTestFile', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Merges tests into single file
 * @param {Array<string>} testPaths - Array of test paths to merge
 * @param {string} outputPath - Path to save merged test
 * @returns {Promise<{success: boolean, path?: string, questionsCount?: number, error?: string}>} - Merge result
 */
export async function mergeTests(testPaths, outputPath) {
  try {
    logApiStart(logger, 'mergeTests', { 
      testPathsCount: testPaths?.length || 0,
      outputPath 
    });
    
    const result = await testFsOperations.mergeTests(testPaths, outputPath);
    
    logApiSuccess(logger, 'mergeTests', { 
      success: result.success, 
      questionsCount: result.questionsCount || 0 
    });
    return result;
  } catch (error) {
    logApiError(logger, 'mergeTests', error);
    return {
      success: false,
      error: error.message,
      questionsCount: 0
    };
  }
}

/**
 * Gets list of test files in directory
 * @param {string} directoryPath - Directory path for search
 * @returns {Promise<{success: boolean, files?: Array<string>, error?: string}>} - Search result
 */
export async function getTestFilesInDirectory(directoryPath) {
  try {
    logApiStart(logger, 'getTestFilesInDirectory', { directoryPath });
    
    const result = await testFsOperations.getTestFilesInDirectory(directoryPath);
    
    logApiSuccess(logger, 'getTestFilesInDirectory', { 
      success: result.success, 
      filesCount: result.files?.length || 0 
    });
    return result;
  } catch (error) {
    logApiError(logger, 'getTestFilesInDirectory', error);
    return {
      success: false,
      error: error.message,
      files: []
    };
  }
}

/**
 * Uploads test file to specified directory
 * @param {string} sourcePath - Source file path
 * @param {string} destinationPath - Path to save file
 * @returns {Promise<{success: boolean, path?: string, error?: string}>} - Upload result
 */
export async function uploadTestFile(sourcePath, destinationPath) {
  try {
    logApiStart(logger, 'uploadTestFile', { 
      sourcePath, 
      destinationPath 
    });
    
    const result = await testFsOperations.uploadTestFile(sourcePath, destinationPath);
    
    logApiSuccess(logger, 'uploadTestFile', { success: result.success });
    return result;
  } catch (error) {
    logApiError(logger, 'uploadTestFile', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Counts questions in test content
 * @param {string} content - Test content
 * @returns {number} - Question count
 */
export function countQuestionsInContent(content) {
  try {
    logApiStart(logger, 'countQuestionsInContent', { 
      contentLength: content?.length || 0 
    });
    
    const result = testFsOperations.countQuestionsInContent(content);
    
    logApiSuccess(logger, 'countQuestionsInContent', { count: result });
    return result;
  } catch (error) {
    logApiError(logger, 'countQuestionsInContent', error);
    return 0;
  }
}

// Export default object for backward compatibility
export default {
  checkTestExists,
  readTestContent,
  writeTestContent,
  deleteTestFile,
  mergeTests,
  getTestFilesInDirectory,
  uploadTestFile,
  countQuestionsInContent
}; 