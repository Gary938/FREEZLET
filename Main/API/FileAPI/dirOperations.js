import { mainLogger } from '../../loggerHub.js';
import { 
  createApiLogger, 
  logApiStart, 
  logApiSuccess, 
  logApiError 
} from '../../Logger/apiLogger.js';
import { dirOperations } from '../../BusinessLayer/FileSystem/dirOperations.js';

// Create logger for module
const logger = createApiLogger('FileAPI:dirOperations');

/**
 * Gets list of directories in specified directory
 * @param {string} dirPath - Directory path
 * @returns {Promise<Object>} - Operation result with directories list
 */
export async function listDirs(dirPath) {
  try {
    // Log operation start
    logApiStart(logger, 'listDirs', { dirPath });
    
    // Call business layer method
    const result = await dirOperations.listDirs(dirPath);
    
    if (result.success) {
      // Log success
      logApiSuccess(logger, 'listDirs');
      logger.info(`Got ${result.dirs.length} directories from ${dirPath}`);
    } else {
      // Log warning
      logger.warn(`Failed to get directories list: ${result.error}`);
    }
    
    return result;
  } catch (error) {
    // Log error
    logApiError(logger, 'listDirs', error);
    
    return {
      success: false,
      dirs: [],
      error: error.message
    };
  }
}

/**
 * Gets list of files in specified directory
 * @param {string} dirPath - Directory path
 * @returns {Promise<Object>} - Operation result with files list
 */
export async function listFiles(dirPath) {
  try {
    // Log operation start
    logApiStart(logger, 'listFiles', { dirPath });
    
    // Call business layer method
    const result = await dirOperations.listFiles(dirPath);
    
    if (result.success) {
      // Log success
      logApiSuccess(logger, 'listFiles');
      logger.info(`Got ${result.files.length} files from ${dirPath}`);
    } else {
      // Log warning
      logger.warn(`Failed to get files list: ${result.error}`);
    }
    
    return result;
  } catch (error) {
    // Log error
    logApiError(logger, 'listFiles', error);
    
    return {
      success: false,
      files: [],
      error: error.message
    };
  }
}

/**
 * Gets list of all files and directories in specified directory
 * @param {string} dirPath - Directory path
 * @returns {Promise<Object>} - Operation result with entries list
 */
export async function readDir(dirPath) {
  try {
    // Log operation start
    logApiStart(logger, 'readDir', { dirPath });
    
    // Call business layer method
    const result = await dirOperations.readDir(dirPath);
    
    if (result.success) {
      // Log success
      logApiSuccess(logger, 'readDir');
      logger.info(`Got ${result.entries.length} entries from ${dirPath}`);
    } else {
      // Log warning
      logger.warn(`Failed to get directory contents: ${result.error}`);
    }
    
    return result;
  } catch (error) {
    // Log error
    logApiError(logger, 'readDir', error);
    
    return {
      success: false,
      entries: [],
      error: error.message
    };
  }
}

/**
 * Gets list of images in specified directory
 * @param {string} dirPath - Directory path
 * @returns {Promise<Object>} - Operation result with images list
 */
export async function listImages(dirPath) {
  try {
    // Log operation start
    logApiStart(logger, 'listImages', { dirPath });
    
    // Call business layer method
    const result = await dirOperations.listImages(dirPath);
    
    if (result.success) {
      // Log success
      logApiSuccess(logger, 'listImages');
      logger.info(`Got ${result.images.length} images from ${dirPath}`);
    } else {
      // Log warning
      logger.warn(`Failed to get images list: ${result.error}`);
    }
    
    return result;
  } catch (error) {
    // Log error
    logApiError(logger, 'listImages', error);
    
    return {
      success: false,
      images: [],
      error: error.message
    };
  }
}

export default {
  listDirs,
  listFiles,
  readDir,
  listImages
}; 