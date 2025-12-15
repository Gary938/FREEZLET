import path from 'path';
import { mainLogger } from '../../loggerHub.js';
import { 
  createApiLogger, 
  logApiStart, 
  logApiSuccess, 
  logApiError 
} from '../../Logger/apiLogger.js';
import { fsOperations } from '../../BusinessLayer/FileSystem/fsOperations.js';
import { fileOperations as fileOps } from '../../BusinessLayer/FileSystem/fileOperations.js';

// Create logger for module
const logger = createApiLogger('FileAPI:fileOperations');

/**
 * File operations for centralized API
 */

/**
 * Checks file existence
 * @param {string} filePath - File path
 * @returns {Promise<Object>} - Operation result
 */
export async function fileExists(filePath) {
  try {
    // Log operation start
    logApiStart(logger, 'fileExists', { filePath });
    
    // Check file existence using business layer
    const exists = fsOperations.fileExists(filePath);
    
    // Log operation success
    logApiSuccess(logger, 'fileExists');
    
    return { 
      success: true, 
      exists
    };
  } catch (error) {
    // Log error
    logApiError(logger, 'fileExists', error);
    
    return {
      success: false,
      exists: false,
      error: error.message
    };
  }
}

/**
 * Reads text file
 * @param {string} filePath - File path
 * @returns {Promise<Object>} - Operation result
 */
export async function readTextFile(filePath) {
  try {
    // Log operation start
    logApiStart(logger, 'readTextFile', { filePath });
    
    // Read file content via business layer
    const result = await fsOperations.readTextFile(filePath);
    
    // Log operation success or error
    if (result.success) {
      logApiSuccess(logger, 'readTextFile');
    } else {
      logApiError(logger, 'readTextFile', new Error(result.error));
    }
    
    return result;
  } catch (error) {
    // Log error
    logApiError(logger, 'readTextFile', error);
    
    return {
      success: false,
      content: null,
      error: error.message
    };
  }
}

/**
 * Writes content to text file
 * @param {string} filePath - File path
 * @param {string} content - Content to write
 * @returns {Promise<Object>} - Operation result
 */
export async function writeTextFile(filePath, content) {
  try {
    // Log operation start
    logApiStart(logger, 'writeTextFile', { filePath });
    
    // Write to file via business layer
    const result = await fsOperations.writeTextFile(filePath, content);
    
    // Log operation success or error
    if (result.success) {
      logApiSuccess(logger, 'writeTextFile');
    } else {
      logApiError(logger, 'writeTextFile', new Error(result.error));
    }
    
    return result;
  } catch (error) {
    // Log error
    logApiError(logger, 'writeTextFile', error);
    
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Deletes file
 * @param {string} filePath - File path
 * @returns {Promise<Object>} - Operation result
 */
export async function deleteFile(filePath) {
  try {
    // Log operation start
    logApiStart(logger, 'deleteFile', { filePath });
    
    // Delete file via business layer
    const result = await fsOperations.deleteFile(filePath);
    
    // Log operation success or error
    if (result.success) {
      logApiSuccess(logger, 'deleteFile');
    } else {
      logApiError(logger, 'deleteFile', new Error(result.error));
    }
    
    return result;
  } catch (error) {
    // Log error
    logApiError(logger, 'deleteFile', error);
    
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Copies file
 * @param {string} sourcePath - Source file path
 * @param {string} targetPath - Target file path
 * @returns {Promise<Object>} - Operation result
 */
export async function copyFile(sourcePath, targetPath) {
  try {
    // Log operation start
    logApiStart(logger, 'copyFile', { sourcePath, targetPath });
    
    // Copy file via business layer
    const result = await fsOperations.copyFile(sourcePath, targetPath);
    
    // Log operation success or error
    if (result.success) {
      logApiSuccess(logger, 'copyFile');
    } else {
      logApiError(logger, 'copyFile', new Error(result.error));
    }
    
    return result;
  } catch (error) {
    // Log error
    logApiError(logger, 'copyFile', error);
    
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Appends content to end of text file
 * @param {string} filePath - File path
 * @param {string} content - Content to append
 * @returns {Promise<Object>} - Operation result
 */
export async function appendToFile(filePath, content) {
  try {
    // Log operation start
    logApiStart(logger, 'appendToFile', { filePath });
    
    // Append to file via business layer
    const result = await fsOperations.appendToFile(filePath, content);
    
    // Log operation success or error
    if (result.success) {
      logApiSuccess(logger, 'appendToFile');
    } else {
      logApiError(logger, 'appendToFile', new Error(result.error));
    }
    
    return result;
  } catch (error) {
    // Log error
    logApiError(logger, 'appendToFile', error);
    
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Writes content to merged test file
 * @param {string} fileName - File name (without path)
 * @param {string} content - Content to write
 * @returns {Promise<Object>} - Operation result
 */
export async function writeMergedTestFile(fileName, content) {
  try {
    // Log operation start
    logApiStart(logger, 'writeMergedTestFile', { fileName });
    
    // Use method from business layer
    const result = await fileOps.writeMergedTestFile(fileName, content);
    
    // Log operation success or error
    if (result.success) {
      logApiSuccess(logger, 'writeMergedTestFile');
    } else {
      logApiError(logger, 'writeMergedTestFile', new Error(result.error));
    }
    
    return result;
  } catch (error) {
    // Log error
    logApiError(logger, 'writeMergedTestFile', error);
    
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Gets list of files in directory
 * @param {string} directoryPath - Directory path
 * @returns {Promise<Object>} - Operation result
 */
export async function listFiles(directoryPath) {
  try {
    // Log operation start
    logApiStart(logger, 'listFiles', { directoryPath });
    
    // Get files list via business layer
    const result = await fsOperations.listFiles(directoryPath);
    
    // Log operation success or error
    if (result.success) {
      logApiSuccess(logger, 'listFiles');
    } else {
      logApiError(logger, 'listFiles', new Error(result.error));
    }
    
    return result;
  } catch (error) {
    // Log error
    logApiError(logger, 'listFiles', error);
    
    return {
      success: false,
      files: [],
      error: error.message
    };
  }
}

/**
 * Gets file information
 * @param {string} filePath - File path
 * @returns {Promise<Object>} - Operation result with file information
 */
export async function getFileInfo(filePath) {
  try {
    // Log operation start
    logApiStart(logger, 'getFileInfo', { filePath });
    
    // Use method from business layer
    const result = await fileOps.getFileInfo(filePath);
    
    // Log operation success or error
    if (result.success) {
      logApiSuccess(logger, 'getFileInfo');
    } else {
      logApiError(logger, 'getFileInfo', new Error(result.error));
    }
    
    return result;
  } catch (error) {
    // Log error
    logApiError(logger, 'getFileInfo', error);
    
    return {
      success: false,
      info: null,
      error: error.message
    };
  }
}

/**
 * Checks if file is an image
 * @param {string} filePath - File path
 * @returns {boolean} - Check result
 */
export function isImageFile(filePath) {
  return fileOps.isImageFile(filePath);
}

export default {
  fileExists,
  readTextFile,
  writeTextFile,
  deleteFile,
  copyFile,
  appendToFile,
  writeMergedTestFile,
  listFiles,
  getFileInfo,
  isImageFile
}; 
