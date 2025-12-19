// Main/BusinessLayer/FileSystem/categoryFsOperations.js
// File system access layer for categories

import fs from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { mainLogger } from '../../loggerHub.js';
import { getBasePath } from '../../Utils/appPaths.js';

// Helper: convert relative path to absolute with security checks
const toAbsolutePath = (relativePath) => {
  // Reject absolute paths for security
  if (path.isAbsolute(relativePath)) {
    throw new Error('Absolute paths are not allowed');
  }

  // Check for path traversal before joining
  if (relativePath.includes('..')) {
    throw new Error('Path traversal detected: contains ".."');
  }

  const basePath = getBasePath();
  const absolutePath = path.join(basePath, relativePath);

  // Additional check: ensure path stays within base directory after normalization
  const normalizedPath = path.normalize(absolutePath);
  if (!normalizedPath.startsWith(basePath)) {
    throw new Error('Path traversal detected');
  }

  return normalizedPath;
};

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
    const absolutePath = toAbsolutePath(dirPath);
    return existsSync(absolutePath) && existsSync(path.resolve(absolutePath));
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
    const absolutePath = toAbsolutePath(categoryPath);
    if (directoryExists(categoryPath)) {
      logger.warn(`Category directory already exists: ${absolutePath}`);
      return { success: true, created: false };
    }

    await fs.mkdir(absolutePath, { recursive: true });
    logger.info(`Category directory created: ${absolutePath}`);

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
    const absolutePath = toAbsolutePath(categoryPath);
    if (!directoryExists(categoryPath)) {
      logger.warn(`Category directory does not exist: ${absolutePath}`);
      return { success: true, deleted: false };
    }

    await fs.rm(absolutePath, { recursive: true, force: true });
    logger.info(`Category directory deleted: ${absolutePath}`);

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
    const absoluteOldPath = toAbsolutePath(oldPath);
    const absoluteNewPath = toAbsolutePath(newPath);

    // Check old directory existence
    if (!directoryExists(oldPath)) {
      logger.warn(`Source directory does not exist: ${absoluteOldPath}`);
      return { success: false, error: 'Source directory does not exist' };
    }

    // Check new directory existence
    if (directoryExists(newPath)) {
      logger.warn(`Target directory already exists: ${absoluteNewPath}`);
      return { success: false, error: 'Target directory already exists' };
    }

    // Create parent directory for new path if it doesn't exist
    const newParentDir = path.dirname(absoluteNewPath);
    if (!existsSync(newParentDir)) {
      await fs.mkdir(newParentDir, { recursive: true });
      logger.info(`Parent directory created: ${newParentDir}`);
    }

    // Rename directory
    await fs.rename(absoluteOldPath, absoluteNewPath);
    logger.info(`Directory renamed: ${absoluteOldPath} -> ${absoluteNewPath}`);

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
    const absolutePath = toAbsolutePath(categoryPath);

    // Check directory existence
    if (!directoryExists(categoryPath)) {
      logger.warn(`Directory does not exist: ${absolutePath}`);
      return { success: false, error: 'Directory does not exist' };
    }

    // Get list of files and directories
    const items = await fs.readdir(absolutePath, { withFileTypes: true });

    // Filter and form result
    const files = [];
    const directories = [];

    for (const item of items) {
      const itemPath = path.join(absolutePath, item.name);

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