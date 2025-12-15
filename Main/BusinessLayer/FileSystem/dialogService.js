// Main/BusinessLayer/FileSystem/dialogService.js
// Service for working with dialog windows

import { dialog } from 'electron';
import path from 'path';
import { mainLogger } from '../../loggerHub.js';

// Logger for module
const logger = {
  info: (message) => mainLogger.info('BusinessLayer:FileSystem:dialogService', message),
  warn: (message) => mainLogger.warn('BusinessLayer:FileSystem:dialogService', message),
  error: (message, data) => mainLogger.error('BusinessLayer:FileSystem:dialogService', message, data),
  debug: (message) => mainLogger.debug('BusinessLayer:FileSystem:dialogService', message),
  success: (message) => mainLogger.success('BusinessLayer:FileSystem:dialogService', message)
};

/**
 * Service for working with file system dialog windows
 */
export const dialogService = {
  /**
   * Opens file selection dialog
   * @param {Object} options - Dialog options
   * @param {boolean} options.multiple - Allow multiple file selection
   * @param {Array<Object>} options.filters - File type filters
   * @param {string} options.defaultPath - Default path
   * @param {string} options.title - Dialog window title
   * @param {Object} browserWindow - Electron window for modal dialog (optional)
   * @returns {Promise<{success: boolean, canceled: boolean, files: Object|Object[]|null, error?: string}>} - Operation result with selected files
   */
  async openFile(options = {}, browserWindow = null) {
    try {
      // Dialog setup
      const dialogOptions = {
        properties: ["openFile", ...(options.multiple ? ["multiSelections"] : [])],
        // Use passed filters or default filter
        filters: options.filters || [{ name: "Text files", extensions: ["txt"] }],
        defaultPath: options.defaultPath || undefined,
        title: options.title || undefined
      };

      logger.debug(`Opening file selection dialog with options: ${JSON.stringify(options)}`);

      // Show dialog (modal if window passed)
      const result = browserWindow
        ? await dialog.showOpenDialog(browserWindow, dialogOptions)
        : await dialog.showOpenDialog(dialogOptions);
      
      // If user cancelled selection
      if (result.canceled || result.filePaths.length === 0) {
        logger.info('User cancelled file selection');
        return { success: true, canceled: true, files: null };
      }
      
      // Format result depending on multiple selection
      let files;
      if (options.multiple) {
        files = result.filePaths.map(filePath => ({
          path: filePath,
          name: path.basename(filePath)
        }));
        
        logger.info(`Files selected: ${files.length}`);
      } else {
        const filePath = result.filePaths[0];
        files = {
          path: filePath,
          name: path.basename(filePath)
        };
        
        logger.info(`File selected: ${files.name}`);
      }
      
      return { 
        success: true, 
        canceled: false,
        files
      };
    } catch (error) {
      logger.error(`Error opening file selection dialog: ${error.message}`);

      return {
        success: false,
        canceled: false,
        files: null,
        error: error.message
      };
    }
  },

  /**
   * Opens directory selection dialog
   * @param {Object} options - Dialog options
   * @param {boolean} options.multiple - Allow multiple directory selection
   * @param {string} options.title - Dialog window title
   * @param {string} options.defaultPath - Default path
   * @param {Object} browserWindow - Electron window for modal dialog (optional)
   * @returns {Promise<{success: boolean, canceled: boolean, folders: Object|Object[]|null, error?: string}>} - Operation result with selected directories
   */
  async openDirectory(options = {}, browserWindow = null) {
    try {
      // Dialog setup
      const dialogOptions = {
        properties: ["openDirectory", ...(options.multiple ? ["multiSelections"] : [])],
        title: options.title || "Select folder",
        defaultPath: options.defaultPath || undefined
      };

      logger.debug(`Opening directory selection dialog with options: ${JSON.stringify(options)}`);

      // Show dialog (modal if window passed)
      const result = browserWindow
        ? await dialog.showOpenDialog(browserWindow, dialogOptions)
        : await dialog.showOpenDialog(dialogOptions);
      
      // If user cancelled selection
      if (result.canceled || result.filePaths.length === 0) {
        logger.info('User cancelled directory selection');
        return { success: true, canceled: true, folders: null };
      }
      
      // Format result depending on multiple selection
      let folders;
      if (options.multiple) {
        folders = result.filePaths.map(folderPath => ({
          path: folderPath,
          name: path.basename(folderPath)
        }));
        
        logger.info(`Directories selected: ${folders.length}`);
      } else {
        const folderPath = result.filePaths[0];
        folders = {
          path: folderPath,
          name: path.basename(folderPath)
        };
        
        logger.info(`Directory selected: ${folders.name}`);
      }
      
      return { 
        success: true, 
        canceled: false,
        folders
      };
    } catch (error) {
      logger.error(`Error opening directory selection dialog: ${error.message}`);

      return {
        success: false,
        canceled: false,
        folders: null,
        error: error.message
      };
    }
  },

  /**
   * Opens file save dialog
   * @param {Object} options - Dialog options
   * @param {Array<Object>} options.filters - File type filters
   * @param {string} options.defaultPath - Default path
   * @param {string} options.title - Dialog window title
   * @param {Object} browserWindow - Electron window for modal dialog (optional)
   * @returns {Promise<{success: boolean, canceled: boolean, filePath: string|null, error?: string}>} - Operation result with selected save location
   */
  async saveFile(options = {}, browserWindow = null) {
    try {
      // Dialog setup
      const dialogOptions = {
        // Use passed filters or default filter
        filters: options.filters || [{ name: "Text files", extensions: ["txt"] }],
        defaultPath: options.defaultPath || undefined,
        title: options.title || undefined
      };

      logger.debug(`Opening file save dialog with options: ${JSON.stringify(options)}`);

      // Show dialog (modal if window passed)
      const result = browserWindow
        ? await dialog.showSaveDialog(browserWindow, dialogOptions)
        : await dialog.showSaveDialog(dialogOptions);
      
      // If user cancelled selection
      if (result.canceled || !result.filePath) {
        logger.info('User cancelled file save');
        return { success: true, canceled: true, filePath: null };
      }
      
      logger.info(`Save path selected: ${result.filePath}`);
      
      return { 
        success: true, 
        canceled: false,
        filePath: result.filePath
      };
    } catch (error) {
      logger.error(`Error opening file save dialog: ${error.message}`);

      return {
        success: false,
        canceled: false,
        filePath: null,
        error: error.message
      };
    }
  }
};

// Export individual functions for convenience
export const { openFile, openDirectory, saveFile } = dialogService; 