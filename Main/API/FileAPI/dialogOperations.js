import { mainLogger } from '../../loggerHub.js';
import { 
  createApiLogger, 
  logApiStart, 
  logApiSuccess, 
  logApiError 
} from '../../Logger/apiLogger.js';
import { dialogService } from '../../BusinessLayer/FileSystem/dialogService.js';

// Create logger for module
const logger = createApiLogger('FileAPI:dialogOperations');

/**
 * Opens file selection dialog
 * @param {Object} options - Dialog options
 * @param {boolean} options.multiple - Allow multiple file selection
 * @param {Array<Object>} options.filters - File type filters
 * @returns {Promise<Object>} - Operation result with selected files list
 */
export async function openFile(options = {}) {
  try {
    // Log operation start
    logApiStart(logger, 'openFile', { options });
    
    // Use service from business layer
    const result = await dialogService.openFile(options);
    
    // Log operation result
    if (result.canceled) {
      logger.info('User cancelled file selection');
    } else if (result.success) {
      logApiSuccess(logger, 'openFile');
      logger.info(`Files selected: ${options.multiple ? result.files.length : 1}`);
    } else {
      logApiError(logger, 'openFile', new Error(result.error));
    }
    
    return result;
  } catch (error) {
    // Log error
    logApiError(logger, 'openFile', error);
    
    return {
      success: false,
      canceled: true,
      files: null,
      error: error.message
    };
  }
}

/**
 * Opens directory selection dialog
 * @param {Object} options - Dialog options
 * @param {boolean} options.multiple - Allow multiple directory selection
 * @param {string} options.title - Dialog window title
 * @returns {Promise<Object>} - Operation result with selected directories list
 */
export async function openDirectory(options = {}) {
  try {
    // Log operation start
    logApiStart(logger, 'openDirectory', { options });
    
    // Use service from business layer
    const result = await dialogService.openDirectory(options);
    
    // Log operation result
    if (result.canceled) {
      logger.info('User cancelled directory selection');
    } else if (result.success) {
      logApiSuccess(logger, 'openDirectory');
      logger.info(`Directories selected: ${options.multiple ? result.folders.length : 1}`);
    } else {
      logApiError(logger, 'openDirectory', new Error(result.error));
    }
    
    return result;
  } catch (error) {
    // Log error
    logApiError(logger, 'openDirectory', error);
    
    return {
      success: false,
      canceled: true,
      folders: null,
      error: error.message
    };
  }
}

/**
 * Opens file save dialog
 * @param {Object} options - Dialog options
 * @param {Array<Object>} options.filters - File type filters
 * @param {string} options.defaultPath - Default path
 * @returns {Promise<Object>} - Operation result with save path
 */
export async function saveFile(options = {}) {
  try {
    // Log operation start
    logApiStart(logger, 'saveFile', { options });
    
    // Use service from business layer
    const result = await dialogService.saveFile(options);
    
    // Log operation result
    if (result.canceled) {
      logger.info('User cancelled file save');
    } else if (result.success) {
      logApiSuccess(logger, 'saveFile');
      logger.info(`Save path selected: ${result.filePath}`);
    } else {
      logApiError(logger, 'saveFile', new Error(result.error));
    }
    
    return result;
  } catch (error) {
    // Log error
    logApiError(logger, 'saveFile', error);
    
    return {
      success: false,
      canceled: true,
      filePath: null,
      error: error.message
    };
  }
}

export default {
  openFile,
  openDirectory,
  saveFile
}; 