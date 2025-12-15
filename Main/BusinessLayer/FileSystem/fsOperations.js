// Main/BusinessLayer/FileSystem/fsOperations.js
// Basic file system operations

import fs from 'fs';
import fsp from 'fs/promises';
import path from 'path';
import { mainLogger } from '../../loggerHub.js';

// Logger for module
const logger = {
  info: (message) => mainLogger.info('BusinessLayer:FileSystem:fsOperations', message),
  warn: (message) => mainLogger.warn('BusinessLayer:FileSystem:fsOperations', message),
  error: (message, data) => mainLogger.error('BusinessLayer:FileSystem:fsOperations', message, data),
  debug: (message) => mainLogger.debug('BusinessLayer:FileSystem:fsOperations', message),
  success: (message) => mainLogger.success('BusinessLayer:FileSystem:fsOperations', message)
};

/**
 * Basic file system operations
 */
export const fsOperations = {
  /**
   * Checks file existence
   * @param {string} filePath - File path
   * @returns {boolean} - Whether file exists
   */
  fileExists(filePath) {
    try {
      if (!filePath) {
        logger.warn('Empty file path when checking existence');
        return false;
      }
      return fs.existsSync(filePath);
    } catch (error) {
      logger.error(`Error checking file existence ${filePath}: ${error.message}`);
      return false;
    }
  },

  /**
   * Checks directory existence
   * @param {string} dirPath - Directory path
   * @returns {boolean} - Whether directory exists
   */
  dirExists(dirPath) {
    try {
      if (!dirPath) {
        logger.warn('Empty directory path when checking existence');
        return false;
      }
      return fs.existsSync(dirPath);
    } catch (error) {
      logger.error(`Error checking directory existence ${dirPath}: ${error.message}`);
      return false;
    }
  },

  /**
   * Creates directory if it doesn't exist
   * @param {string} dirPath - Directory path
   * @returns {Promise<{success: boolean, error?: string}>} - Operation result
   */
  async ensureDir(dirPath) {
    try {
      if (!dirPath) {
        logger.warn('Empty directory path when creating');
        return { success: false, error: 'Empty directory path' };
      }

      // If directory already exists, return success
      if (this.dirExists(dirPath)) {
        logger.debug(`Directory already exists: ${dirPath}`);
        return { success: true };
      }

      // Create directory with all parent directories
      await fsp.mkdir(dirPath, { recursive: true });
      logger.success(`Directory created: ${dirPath}`);
      return { success: true };
    } catch (error) {
      logger.error(`Error creating directory ${dirPath}: ${error.message}`);
      return { success: false, error: error.message };
    }
  },

  /**
   * Reads text file contents
   * @param {string} filePath - File path
   * @returns {Promise<{success: boolean, content?: string, error?: string}>} - Operation result
   */
  async readTextFile(filePath) {
    try {
      if (!filePath) {
        logger.warn('Empty file path when reading');
        return { success: false, error: 'Empty file path', content: '' };
      }

      // Check file existence
      if (!this.fileExists(filePath)) {
        logger.warn(`File does not exist: ${filePath}`);
        return { success: false, error: 'File does not exist', content: '' };
      }

      // Read file contents
      const content = await fsp.readFile(filePath, 'utf-8');
      logger.debug(`File read: ${filePath} (${content.length} bytes)`);
      return { success: true, content };
    } catch (error) {
      logger.error(`Error reading file ${filePath}: ${error.message}`);
      return { success: false, error: error.message, content: '' };
    }
  },

  /**
   * Writes content to text file
   * @param {string} filePath - File path
   * @param {string} content - Content to write
   * @param {boolean} [createDir=true] - Whether to create parent directory
   * @returns {Promise<{success: boolean, error?: string}>} - Operation result
   */
  async writeTextFile(filePath, content, createDir = true) {
    try {
      if (!filePath) {
        logger.warn('Empty file path when writing');
        return { success: false, error: 'Empty file path' };
      }

      // Get file directory
      const dirPath = path.dirname(filePath);

      // Create directory if needed
      if (createDir && !this.dirExists(dirPath)) {
        const createDirResult = await this.ensureDir(dirPath);
        if (!createDirResult.success) {
          return createDirResult;
        }
      }

      // Write content to file
      await fsp.writeFile(filePath, content, 'utf-8');
      logger.success(`File written: ${filePath} (${content.length} bytes)`);
      return { success: true };
    } catch (error) {
      logger.error(`Error writing file ${filePath}: ${error.message}`);
      return { success: false, error: error.message };
    }
  },

  /**
   * Deletes file
   * @param {string} filePath - File path
   * @returns {Promise<{success: boolean, error?: string}>} - Operation result
   */
  async deleteFile(filePath) {
    try {
      if (!filePath) {
        logger.warn('Empty file path when deleting');
        return { success: false, error: 'Empty file path' };
      }

      // Check file existence
      if (!this.fileExists(filePath)) {
        logger.debug(`File doesn't exist when deleting: ${filePath}`);
        return { success: true }; // File doesn't exist anyway
      }

      // Delete file
      await fsp.unlink(filePath);
      logger.success(`File deleted: ${filePath}`);
      return { success: true };
    } catch (error) {
      logger.error(`Error deleting file ${filePath}: ${error.message}`);
      return { success: false, error: error.message };
    }
  },

  /**
   * Copies file
   * @param {string} sourcePath - Source file path
   * @param {string} targetPath - Target file path
   * @param {boolean} [createDir=true] - Whether to create parent directory
   * @returns {Promise<{success: boolean, error?: string}>} - Operation result
   */
  async copyFile(sourcePath, targetPath, createDir = true) {
    try {
      if (!sourcePath || !targetPath) {
        logger.warn('Empty file path when copying');
        return { success: false, error: 'Empty file path' };
      }

      // Check source file existence
      if (!this.fileExists(sourcePath)) {
        logger.warn(`Source file does not exist: ${sourcePath}`);
        return { success: false, error: 'Source file does not exist' };
      }

      // Get target file directory
      const targetDir = path.dirname(targetPath);

      // Create directory if needed
      if (createDir && !this.dirExists(targetDir)) {
        const createDirResult = await this.ensureDir(targetDir);
        if (!createDirResult.success) {
          return createDirResult;
        }
      }

      // Copy file
      await fsp.copyFile(sourcePath, targetPath);
      logger.success(`File copied: ${sourcePath} -> ${targetPath}`);
      return { success: true };
    } catch (error) {
      logger.error(`Error copying file ${sourcePath} -> ${targetPath}: ${error.message}`);
      return { success: false, error: error.message };
    }
  },

  /**
   * Appends content to end of text file
   * @param {string} filePath - File path
   * @param {string} content - Content to append
   * @param {boolean} [createDir=true] - Whether to create parent directory
   * @returns {Promise<{success: boolean, error?: string}>} - Operation result
   */
  async appendToFile(filePath, content, createDir = true) {
    try {
      if (!filePath) {
        logger.warn('Empty file path when appending');
        return { success: false, error: 'Empty file path' };
      }

      // Get file directory
      const dirPath = path.dirname(filePath);

      // Create directory if needed
      if (createDir && !this.dirExists(dirPath)) {
        const createDirResult = await this.ensureDir(dirPath);
        if (!createDirResult.success) {
          return createDirResult;
        }
      }

      // Append content to file
      await fsp.appendFile(filePath, content, 'utf-8');
      logger.success(`Content appended to file: ${filePath} (${content.length} bytes)`);
      return { success: true };
    } catch (error) {
      logger.error(`Error appending to file ${filePath}: ${error.message}`);
      return { success: false, error: error.message };
    }
  },

  /**
   * Gets list of files in directory
   * @param {string} dirPath - Directory path
   * @returns {Promise<{success: boolean, files?: string[], error?: string}>} - Operation result
   */
  async listFiles(dirPath) {
    try {
      if (!dirPath) {
        logger.warn('Empty directory path when getting file list');
        return { success: false, error: 'Empty directory path', files: [] };
      }

      // Check directory existence
      if (!this.dirExists(dirPath)) {
        logger.warn(`Directory does not exist: ${dirPath}`);
        return { success: false, error: 'Directory does not exist', files: [] };
      }

      // Get directory contents
      const entries = await fsp.readdir(dirPath, { withFileTypes: true });
      
      // Filter only files
      const files = entries
        .filter(entry => entry.isFile())
        .map(entry => path.join(dirPath, entry.name));
      
      logger.debug(`Got file list in directory ${dirPath}: ${files.length} files`);
      return { success: true, files };
    } catch (error) {
      logger.error(`Error getting file list in directory ${dirPath}: ${error.message}`);
      return { success: false, error: error.message, files: [] };
    }
  },

  /**
   * Gets list of subdirectories in directory
   * @param {string} dirPath - Directory path
   * @returns {Promise<{success: boolean, directories?: string[], error?: string}>} - Operation result
   */
  async listDirectories(dirPath) {
    try {
      if (!dirPath) {
        logger.warn('Empty directory path when getting subdirectory list');
        return { success: false, error: 'Empty directory path', directories: [] };
      }

      // Check directory existence
      if (!this.dirExists(dirPath)) {
        logger.warn(`Directory does not exist: ${dirPath}`);
        return { success: false, error: 'Directory does not exist', directories: [] };
      }

      // Get directory contents
      const entries = await fsp.readdir(dirPath, { withFileTypes: true });
      
      // Filter only directories
      const directories = entries
        .filter(entry => entry.isDirectory())
        .map(entry => path.join(dirPath, entry.name));
      
      logger.debug(`Got subdirectory list in directory ${dirPath}: ${directories.length} directories`);
      return { success: true, directories };
    } catch (error) {
      logger.error(`Error getting subdirectory list in directory ${dirPath}: ${error.message}`);
      return { success: false, error: error.message, directories: [] };
    }
  }
};

// Export individual functions for convenience
export const { 
  fileExists, 
  dirExists, 
  ensureDir, 
  readTextFile, 
  writeTextFile, 
  deleteFile, 
  copyFile, 
  appendToFile, 
  listFiles, 
  listDirectories 
} = fsOperations; 