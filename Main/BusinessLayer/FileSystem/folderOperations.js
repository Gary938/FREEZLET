// Main/BusinessLayer/FileSystem/folderOperations.js
// Folder operations

import fs from 'fs/promises';
import path from 'path';
import { mainLogger } from '../../loggerHub.js';
import { fsOperations } from './fsOperations.js';
import { normalizeFolderPath } from '../../Utils/PathUtils/pathFormatUtils.js';
import { isValidFolderPath } from '../../Utils/PathUtils/pathValidationUtils.js';

// Logger for module
const logger = {
  info: (message) => mainLogger.info('BusinessLayer:FileSystem:folderOperations', message),
  warn: (message) => mainLogger.warn('BusinessLayer:FileSystem:folderOperations', message),
  error: (message, data) => mainLogger.error('BusinessLayer:FileSystem:folderOperations', message, data),
  debug: (message) => mainLogger.debug('BusinessLayer:FileSystem:folderOperations', message),
  success: (message) => mainLogger.success('BusinessLayer:FileSystem:folderOperations', message)
};

/**
 * Folder operations
 */
export const folderOperations = {
  /**
   * Creates new folder
   * @param {string} folderPath - Path to folder to create
   * @returns {Promise<{success: boolean, error?: string}>} - Operation result
   */
  async createFolder(folderPath) {
    try {
      // Validate path
      if (!isValidFolderPath(folderPath)) {
        logger.warn(`Invalid folder path: ${folderPath}`);
        return { 
          success: false, 
          error: 'Folder path contains invalid characters or is empty' 
        };
      }
      
      // Normalize path
      const normalizedPath = normalizeFolderPath(folderPath);
      
      // Create folder
      const result = await fsOperations.ensureDir(normalizedPath);
      
      if (result.success) {
        logger.success(`Folder created: ${normalizedPath}`);
      } else {
        logger.error(`Error creating folder: ${result.error}`);
      }
      
      return result;
    } catch (error) {
      logger.error(`Error creating folder ${folderPath}: ${error.message}`);
      return { success: false, error: error.message };
    }
  },

  /**
   * Renames folder
   * @param {string} oldPath - Current folder path
   * @param {string} newPath - New folder path
   * @returns {Promise<{success: boolean, error?: string}>} - Operation result
   */
  async renameFolder(oldPath, newPath) {
    try {
      // Validate paths
      if (!isValidFolderPath(oldPath) || !isValidFolderPath(newPath)) {
        logger.warn(`Invalid paths: oldPath=${oldPath}, newPath=${newPath}`);
        return { 
          success: false, 
          error: 'Folder path contains invalid characters or is empty' 
        };
      }
      
      // Normalize paths
      const normalizedOldPath = normalizeFolderPath(oldPath);
      const normalizedNewPath = normalizeFolderPath(newPath);
      
      // Check source folder existence
      if (!fsOperations.dirExists(normalizedOldPath)) {
        logger.warn(`Source folder does not exist: ${normalizedOldPath}`);
        return { success: false, error: 'Source folder does not exist' };
      }
      
      // Check if target folder already exists
      if (fsOperations.dirExists(normalizedNewPath)) {
        logger.warn(`Target folder already exists: ${normalizedNewPath}`);
        return { success: false, error: 'Target folder already exists' };
      }
      
      // Rename folder
      await fs.rename(normalizedOldPath, normalizedNewPath);
      
      logger.success(`Folder renamed: ${normalizedOldPath} → ${normalizedNewPath}`);
      return { success: true };
    } catch (error) {
      logger.error(`Error renaming folder ${oldPath} → ${newPath}: ${error.message}`);
      return { success: false, error: error.message };
    }
  },

  /**
   * Deletes folder
   * @param {string} folderPath - Path to folder to delete
   * @returns {Promise<{success: boolean, error?: string}>} - Operation result
   */
  async deleteFolder(folderPath) {
    try {
      // Validate path
      if (!isValidFolderPath(folderPath)) {
        logger.warn(`Invalid folder path: ${folderPath}`);
        return { 
          success: false, 
          error: 'Folder path contains invalid characters or is empty' 
        };
      }
      
      // Normalize path
      const normalizedPath = normalizeFolderPath(folderPath);
      
      // Check folder existence
      if (!fsOperations.dirExists(normalizedPath)) {
        logger.warn(`Folder does not exist: ${normalizedPath}`);
        return { success: true }; // Folder doesn't exist anyway
      }
      
      // Delete folder with all contents
      await fs.rm(normalizedPath, { recursive: true, force: true });
      
      logger.success(`Folder deleted: ${normalizedPath}`);
      return { success: true };
    } catch (error) {
      logger.error(`Error deleting folder ${folderPath}: ${error.message}`);
      return { success: false, error: error.message };
    }
  }
};

// Export utility functions
export const { createFolder, renameFolder, deleteFolder } = folderOperations; 