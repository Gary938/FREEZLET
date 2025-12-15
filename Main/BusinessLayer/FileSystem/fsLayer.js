// Main/BusinessLayer/FileSystem/fsLayer.js
// File system access layer

import fs from 'fs';
import fsp from 'fs/promises';
import path from 'path';
import { createApiLogger } from '../../Logger/apiLogger.js';

// Create logger for this module
const logger = createApiLogger('BusinessLayer:FileSystem');

// Log module loading
logger.info('Initializing fsLayer');

/**
 * Checks file existence
 * @param {string} filePath - File path
 * @returns {boolean} - Whether file exists
 */
export function fileExists(filePath) {
  try {
    return fs.existsSync(filePath);
  } catch (error) {
    logger.error('Error checking file existence', error);
    return false;
  }
}

/**
 * Checks directory existence
 * @param {string} dirPath - Directory path
 * @returns {boolean} - Whether directory exists
 */
export function dirExists(dirPath) {
  try {
    return fs.existsSync(dirPath) && fs.statSync(dirPath).isDirectory();
  } catch (error) {
    logger.error('Error checking directory existence', error);
    return false;
  }
}

/**
 * Creates directory recursively
 * @param {string} dirPath - Directory path
 * @returns {Promise<Object>} - Operation result
 */
export async function createDir(dirPath) {
  try {
    await fsp.mkdir(dirPath, { recursive: true });
    return { success: true };
  } catch (error) {
    logger.error('Error creating directory', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Writes content to file
 * @param {string} filePath - File path
 * @param {string} content - Content to write
 * @returns {Promise<Object>} - Operation result
 */
export async function writeFile(filePath, content) {
  try {
    // Create parent directory if needed
    const dirPath = path.dirname(filePath);
    if (!dirExists(dirPath)) {
      await createDir(dirPath);
    }
    
    // Write file
    await fsp.writeFile(filePath, content, 'utf-8');
    return { success: true };
  } catch (error) {
    logger.error('Error writing file', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Reads file contents
 * @param {string} filePath - File path
 * @returns {Promise<Object>} - Operation result
 */
export async function readFile(filePath) {
  try {
    // Check file existence
    if (!fileExists(filePath)) {
      return { 
        success: false, 
        error: 'File not found',
        content: null
      };
    }
    
    // Read file contents
    const content = await fsp.readFile(filePath, 'utf-8');
    return { 
      success: true, 
      content 
    };
  } catch (error) {
    logger.error('Error reading file', error);
    return {
      success: false,
      content: null,
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
    // Check file existence
    if (!fileExists(filePath)) {
      return { 
        success: true, 
        skipped: true 
      };
    }
    
    // Delete file
    await fsp.unlink(filePath);
    return { success: true };
  } catch (error) {
    logger.error('Error deleting file', error);
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
    // Check source file existence
    if (!fileExists(sourcePath)) {
      return { 
        success: false, 
        error: 'Source file not found' 
      };
    }
    
    // Create parent directory for target file if needed
    const targetDir = path.dirname(targetPath);
    if (!dirExists(targetDir)) {
      await createDir(targetDir);
    }
    
    // Copy file
    await fsp.copyFile(sourcePath, targetPath);
    return { success: true };
  } catch (error) {
    logger.error('Error copying file', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Renames file or directory
 * @param {string} oldPath - Old path
 * @param {string} newPath - New path
 * @returns {Promise<Object>} - Operation result
 */
export async function rename(oldPath, newPath) {
  try {
    // Check source path existence
    if (!fileExists(oldPath)) {
      return { 
        success: false, 
        error: 'Source path not found' 
      };
    }
    
    // Create parent directory for new path if needed
    const newDir = path.dirname(newPath);
    if (!dirExists(newDir)) {
      await createDir(newDir);
    }
    
    // Rename
    await fsp.rename(oldPath, newPath);
    return { success: true };
  } catch (error) {
    logger.error('Error renaming', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Gets list of files and directories
 * @param {string} dirPath - Directory path
 * @returns {Promise<Object>} - Operation result
 */
export async function listDir(dirPath) {
  try {
    // Check directory existence
    if (!dirExists(dirPath)) {
      return { 
        success: false, 
        error: 'Directory not found',
        files: [] 
      };
    }
    
    // Get list of files and directories
    const files = await fsp.readdir(dirPath);
    
    // Get info about each file/directory
    const fileInfoPromises = files.map(async (file) => {
      const filePath = path.join(dirPath, file);
      const stats = await fsp.stat(filePath);
      return {
        name: file,
        path: filePath,
        isDirectory: stats.isDirectory(),
        size: stats.size,
        modifiedTime: stats.mtime
      };
    });
    
    const fileInfos = await Promise.all(fileInfoPromises);
    
    return { 
      success: true, 
      files: fileInfos 
    };
  } catch (error) {
    logger.error('Error getting file list', error);
    return {
      success: false,
      files: [],
      error: error.message
    };
  }
}

// Export all functions as object
export const fsLayer = {
  fileExists,
  dirExists,
  createDir,
  writeFile,
  readFile,
  deleteFile,
  copyFile,
  rename,
  listDir
};

// Log successful loading
logger.success('fsLayer successfully loaded');

export default fsLayer; 