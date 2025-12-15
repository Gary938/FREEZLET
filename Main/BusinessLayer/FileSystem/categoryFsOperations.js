// Main/BusinessLayer/FileSystem/categoryFsOperations.js
// File system access layer for categories

import fs from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { mainLogger } from '../../loggerHub.js';

// Logger for module
const logger = {
  info: (message) => mainLogger.info('BusinessLayer:FileSystem:categoryOperations', message),
  warn: (message) => mainLogger.warn('BusinessLayer:FileSystem:categoryOperations', message),
  error: (message, data) => mainLogger.error('BusinessLayer:FileSystem:categoryOperations', message, data),
  debug: (message) => mainLogger.debug('BusinessLayer:FileSystem:categoryOperations', message),
  success: (message) => mainLogger.success('BusinessLayer:FileSystem:categoryOperations', message)
};

/**
 * Checks directory existence
 * @param {string} dirPath - Directory path
 * @returns {boolean} - Whether directory exists
 */
export function directoryExists(dirPath) {
  try {
    return existsSync(dirPath) && existsSync(path.resolve(dirPath));
  } catch (error) {
    logger.error(`Error checking directory existence: ${error.message}`);
    return false;
  }
}

/**
 * Creates category directory
 * @param {string} categoryPath - Full category path
 * @returns {Object} - Operation result
 */
export async function createDirectory(categoryPath) {
  try {
    if (directoryExists(categoryPath)) {
      logger.warn(`Category directory already exists: ${categoryPath}`);
      return { success: true, created: false };
    }
    
    await fs.mkdir(categoryPath, { recursive: true });
    logger.info(`Category directory created: ${categoryPath}`);
    
    return { success: true, created: true };
  } catch (error) {
    logger.error(`Error creating category directory: ${error.message}`);
    return { success: false, error: error.message };
  }
}

/**
 * Deletes category directory
 * @param {string} categoryPath - Full category path
 * @returns {Object} - Operation result
 */
export async function deleteDirectory(categoryPath) {
  try {
    if (!directoryExists(categoryPath)) {
      logger.warn(`Category directory does not exist: ${categoryPath}`);
      return { success: true, deleted: false };
    }
    
    await fs.rm(categoryPath, { recursive: true, force: true });
    logger.info(`Category directory deleted: ${categoryPath}`);
    
    return { success: true, deleted: true };
  } catch (error) {
    logger.error(`Error deleting category directory: ${error.message}`);
    return { success: false, error: error.message };
  }
}

/**
 * Renames category directory
 * @param {string} oldPath - Old category path
 * @param {string} newPath - New category path
 * @returns {Object} - Operation result
 */
export async function renameDirectory(oldPath, newPath) {
  try {
    // Check old directory existence
    if (!directoryExists(oldPath)) {
      logger.warn(`Source directory does not exist: ${oldPath}`);
      return { success: false, error: 'Source directory does not exist' };
    }
    
    // Check new directory existence
    if (directoryExists(newPath)) {
      logger.warn(`Target directory already exists: ${newPath}`);
      return { success: false, error: 'Target directory already exists' };
    }
    
    // Create parent directory for new path if it doesn't exist
    const newParentDir = path.dirname(newPath);
    if (!directoryExists(newParentDir)) {
      await fs.mkdir(newParentDir, { recursive: true });
      logger.info(`Parent directory created: ${newParentDir}`);
    }
    
    // Rename directory
    await fs.rename(oldPath, newPath);
    logger.info(`Directory renamed: ${oldPath} -> ${newPath}`);
    
    return { success: true };
  } catch (error) {
    logger.error(`Error renaming directory: ${error.message}`);
    return { success: false, error: error.message };
  }
}

/**
 * Gets list of files and subdirectories in category
 * @param {string} categoryPath - Path to category
 * @returns {Object} - Operation result with file and directory list
 */
export async function getCategoryContents(categoryPath) {
  try {
    // Check directory existence
    if (!directoryExists(categoryPath)) {
      logger.warn(`Directory does not exist: ${categoryPath}`);
      return { success: false, error: 'Directory does not exist' };
    }
    
    // Get list of files and directories
    const items = await fs.readdir(categoryPath, { withFileTypes: true });
    
    // Filter and form result
    const files = [];
    const directories = [];
    
    for (const item of items) {
      const itemPath = path.join(categoryPath, item.name);
      
      if (item.isDirectory()) {
        directories.push({
          name: item.name,
          path: itemPath
        });
      } else if (item.isFile()) {
        files.push({
          name: item.name,
          path: itemPath
        });
      }
    }
    
    return {
      success: true,
      data: {
        files,
        directories
      }
    };
  } catch (error) {
    logger.error(`Error getting category contents: ${error.message}`);
    return { success: false, error: error.message };
  }
}

// Export all functions as single module
export default {
  directoryExists,
  createDirectory,
  deleteDirectory,
  renameDirectory,
  getCategoryContents
}; 