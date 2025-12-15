// Main/BusinessLayer/FileSystem/dirOperations.js
// Directory operations

import fs from 'fs/promises';
import { mainLogger } from '../../loggerHub.js';
import { fsOperations } from './fsOperations.js';

// Logger for module
const logger = {
  info: (message) => mainLogger.info('BusinessLayer:FileSystem:dirOperations', message),
  warn: (message) => mainLogger.warn('BusinessLayer:FileSystem:dirOperations', message),
  error: (message, data) => mainLogger.error('BusinessLayer:FileSystem:dirOperations', message, data),
  debug: (message) => mainLogger.debug('BusinessLayer:FileSystem:dirOperations', message),
  success: (message) => mainLogger.success('BusinessLayer:FileSystem:dirOperations', message)
};

/**
 * Directory operations
 */
export const dirOperations = {
  /**
   * Gets list of directories in specified directory
   * @param {string} dirPath - Directory path
   * @returns {Promise<{success: boolean, dirs: string[], error?: string}>} - Operation result with directory list
   */
  async listDirs(dirPath) {
    try {
      if (!dirPath) {
        logger.warn('Empty directory path when getting directory list');
        return { success: false, dirs: [], error: 'Empty directory path' };
      }
      
      // Check directory existence
      if (!fsOperations.dirExists(dirPath)) {
        logger.warn(`Directory does not exist: ${dirPath}`);
        return { success: false, dirs: [], error: 'Directory not found' };
      }
      
      // Get directory list
      const entries = await fs.readdir(dirPath, { withFileTypes: true });
      const dirs = entries
        .filter(entry => entry.isDirectory())
        .map(entry => entry.name);
      
      logger.debug(`Got ${dirs.length} directories from ${dirPath}`);
      
      return { 
        success: true, 
        dirs
      };
    } catch (error) {
      logger.error(`Error getting directory list from ${dirPath}: ${error.message}`);
      
      return {
        success: false,
        dirs: [],
        error: error.message
      };
    }
  },

  /**
   * Gets list of files in specified directory
   * @param {string} dirPath - Directory path
   * @returns {Promise<{success: boolean, files: string[], error?: string}>} - Operation result with file list
   */
  async listFiles(dirPath) {
    try {
      if (!dirPath) {
        logger.warn('Empty directory path when getting file list');
        return { success: false, files: [], error: 'Empty directory path' };
      }
      
      // Check directory existence
      if (!fsOperations.dirExists(dirPath)) {
        logger.warn(`Directory does not exist: ${dirPath}`);
        return { success: false, files: [], error: 'Directory not found' };
      }
      
      // Get file list
      const entries = await fs.readdir(dirPath, { withFileTypes: true });
      const files = entries
        .filter(entry => entry.isFile())
        .map(entry => entry.name);
      
      logger.debug(`Got ${files.length} files from ${dirPath}`);
      
      return { 
        success: true, 
        files
      };
    } catch (error) {
      logger.error(`Error getting file list from ${dirPath}: ${error.message}`);
      
      return {
        success: false,
        files: [],
        error: error.message
      };
    }
  },

  /**
   * Gets list of all files and directories in specified directory
   * @param {string} dirPath - Directory path
   * @returns {Promise<{success: boolean, entries: string[], error?: string}>} - Operation result with entry list
   */
  async readDir(dirPath) {
    try {
      if (!dirPath) {
        logger.warn('Empty directory path when reading contents');
        return { success: false, entries: [], error: 'Empty directory path' };
      }
      
      // Check directory existence
      if (!fsOperations.dirExists(dirPath)) {
        logger.warn(`Directory does not exist: ${dirPath}`);
        return { success: false, entries: [], error: 'Directory not found' };
      }
      
      // Get all entries list
      const entries = await fs.readdir(dirPath);
      
      logger.debug(`Got ${entries.length} entries from ${dirPath}`);
      
      return { 
        success: true, 
        entries
      };
    } catch (error) {
      logger.error(`Error reading directory contents ${dirPath}: ${error.message}`);
      
      return {
        success: false,
        entries: [],
        error: error.message
      };
    }
  },

  /**
   * Gets list of images in specified directory
   * @param {string} dirPath - Directory path
   * @returns {Promise<{success: boolean, images: string[], error?: string}>} - Operation result with image list
   */
  async listImages(dirPath) {
    try {
      if (!dirPath) {
        logger.warn('Empty directory path when getting image list');
        return { success: false, images: [], error: 'Empty directory path' };
      }
      
      // Check directory existence
      if (!fsOperations.dirExists(dirPath)) {
        logger.warn(`Directory does not exist: ${dirPath}`);
        return { success: false, images: [], error: 'Directory not found' };
      }
      
      // Get image list
      const entries = await fs.readdir(dirPath, { withFileTypes: true });
      const images = entries
        .filter(entry => entry.isFile() && /\.(jpg|jpeg|png|webp)$/i.test(entry.name))
        .map(entry => entry.name);
      
      logger.debug(`Got ${images.length} images from ${dirPath}`);
      
      return { 
        success: true, 
        images
      };
    } catch (error) {
      logger.error(`Error getting image list from ${dirPath}: ${error.message}`);
      
      return {
        success: false,
        images: [],
        error: error.message
      };
    }
  }
};

// Export individual functions for convenience
export const { listDirs, listFiles, readDir, listImages } = dirOperations; 