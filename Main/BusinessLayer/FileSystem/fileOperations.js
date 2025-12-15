// Main/BusinessLayer/FileSystem/fileOperations.js
// Specialized file operations

import path from 'path';
import { mainLogger } from '../../loggerHub.js';
import { fsOperations } from './fsOperations.js';
import { getMergeTestPath } from '../../Utils/pathUtils.js';

// Logger for module
const logger = {
  info: (message) => mainLogger.info('BusinessLayer:FileSystem:fileOperations', message),
  warn: (message) => mainLogger.warn('BusinessLayer:FileSystem:fileOperations', message),
  error: (message, data) => mainLogger.error('BusinessLayer:FileSystem:fileOperations', message, data),
  debug: (message) => mainLogger.debug('BusinessLayer:FileSystem:fileOperations', message),
  success: (message) => mainLogger.success('BusinessLayer:FileSystem:fileOperations', message)
};

/**
 * File operations
 */
export const fileOperations = {
  /**
   * Writes content to merged test file
   * @param {string} fileName - File name (without path)
   * @param {string} content - Content to write
   * @returns {Promise<{success: boolean, path?: string, error?: string}>} - Operation result
   */
  async writeMergedTestFile(fileName, content) {
    try {
      if (!fileName) {
        logger.warn('Empty filename when writing merged test');
        return { success: false, error: 'Empty filename' };
      }
      
      // Get full file path in MERGE directory
      const filePath = getMergeTestPath(fileName);
      
      logger.debug(`Writing merged test to file: ${filePath}`);
      
      // Write file via fsOperations
      const result = await fsOperations.writeTextFile(filePath, content);
      
      if (result.success) {
        logger.success(`Merged test written: ${filePath}`);
        return { success: true, path: filePath };
      } else {
        logger.error(`Error writing merged test: ${result.error}`);
        return { success: false, error: result.error };
      }
    } catch (error) {
      logger.error(`Error writing merged test ${fileName}: ${error.message}`);
      return { success: false, error: error.message };
    }
  },
  
  /**
   * Checks if file is an image by extension
   * @param {string} filePath - File path
   * @returns {boolean} - true if file is an image
   */
  isImageFile(filePath) {
    if (!filePath) return false;
    
    const ext = path.extname(filePath).toLowerCase();
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.svg'];
    
    return imageExtensions.includes(ext);
  },
  
  /**
   * Returns file type based on its extension
   * @param {string} filePath - File path
   * @returns {string} - File type (image, text, binary, unknown)
   */
  getFileType(filePath) {
    if (!filePath) return 'unknown';
    
    const ext = path.extname(filePath).toLowerCase();
    
    // File types by extensions
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.svg'];
    const textExtensions = ['.txt', '.md', '.html', '.htm', '.css', '.js', '.json', '.xml', '.csv'];
    
    if (imageExtensions.includes(ext)) {
      return 'image';
    } else if (textExtensions.includes(ext)) {
      return 'text';
    } else {
      return 'binary';
    }
  },
  
  /**
   * Gets file information
   * @param {string} filePath - File path
   * @returns {Promise<{success: boolean, info?: Object, error?: string}>} - Operation result
   */
  async getFileInfo(filePath) {
    try {
      if (!filePath) {
        logger.warn('Empty file path when getting info');
        return { success: false, error: 'Empty file path' };
      }
      
      // Check file existence
      if (!fsOperations.fileExists(filePath)) {
        logger.warn(`File does not exist: ${filePath}`);
        return { success: false, error: 'File does not exist' };
      }
      
      // Get base name and extension
      const basename = path.basename(filePath);
      const ext = path.extname(filePath);
      const dirname = path.dirname(filePath);
      
      // Determine file type
      const fileType = this.getFileType(filePath);
      
      // Form result
      const info = {
        path: filePath,
        name: basename,
        extension: ext,
        directory: dirname,
        type: fileType,
        isImage: fileType === 'image'
      };
      
      logger.debug(`Got file info: ${filePath}`);
      
      return { success: true, info };
    } catch (error) {
      logger.error(`Error getting file info ${filePath}: ${error.message}`);
      return { success: false, error: error.message };
    }
  }
};

// Export individual functions for convenience
export const { writeMergedTestFile, isImageFile, getFileType, getFileInfo } = fileOperations;