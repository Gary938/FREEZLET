import { app } from 'electron';
import { mainLogger } from '../../loggerHub.js';
import { uploadMultipleTests } from '../../API/TestAPI/testUpload.js';
import { dialogService } from '../../BusinessLayer/FileSystem/dialogService.js';

// Logger for module
const logger = {
  info: (message) => mainLogger.info('Controllers:TestController:testUploadController', message),
  warn: (message) => mainLogger.warn('Controllers:TestController:testUploadController', message),
  error: (message, error) => mainLogger.error('Controllers:TestController:testUploadController', message, error),
  debug: (message) => mainLogger.debug('Controllers:TestController:testUploadController', message),
  success: (message) => mainLogger.success('Controllers:TestController:testUploadController', message)
};

/**
 * Test upload controller
 */
export const testUploadController = {
  /**
   * Opens dialog to select tests and uploads them to specified category
   * @param {Object} mainWindow - Main application window
   * @param {string} categoryPath - Path to category
   * @returns {Promise<Object>} - Upload operation result
   */
  async uploadTests(mainWindow, categoryPath) {
    try {
      logger.debug(`Request to upload tests to category: ${categoryPath}`);
      
      // Parameter check
      if (!mainWindow) {
        logger.error('Main application window not provided');
        return { success: false, error: 'Main application window not provided' };
      }
      
      if (!categoryPath) {
        logger.error('Category path for test upload not specified');
        return { success: false, error: 'Category path for test upload not specified' };
      }
      
      // Open file selection dialog via dialogService
      const dialogResult = await dialogService.openFile({
        title: 'Select tests to upload',
        defaultPath: app.getPath('downloads'),
        multiple: true,
        filters: [
          { name: 'Text files', extensions: ['txt'] },
          { name: 'All files', extensions: ['*'] }
        ]
      }, mainWindow);

      // Check dialog result
      if (!dialogResult.success) {
        logger.error(`Dialog error: ${dialogResult.error}`);
        return { success: false, error: dialogResult.error };
      }

      if (dialogResult.canceled) {
        logger.info('User cancelled file selection');
        return { success: true, canceled: true };
      }

      // Get files from dialogService result
      const files = Array.isArray(dialogResult.files) ? dialogResult.files : [dialogResult.files];
      
      logger.info(`Selected ${files.length} files for upload`);
      
      // Call API to upload tests
      const uploadResult = await uploadMultipleTests(categoryPath, files);
      
      // Return operation result
      if (uploadResult.success) {
        logger.success(`Tests uploaded: ${uploadResult.uploaded.length}`);
        return uploadResult;
      } else {
        logger.error(`Test upload error: ${uploadResult.error}`);
        return uploadResult;
      }
    } catch (error) {
      logger.error('Error uploading tests', error);
      return { success: false, error: error.message };
    }
  }
}; 