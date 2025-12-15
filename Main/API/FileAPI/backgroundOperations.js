// Main/API/FileAPI/backgroundOperations.js
// API for working with background images

import { mainLogger } from '../../loggerHub.js';
import { createApiLogger, logApiStart, logApiSuccess, logApiError } from '../../Logger/apiLogger.js';
import { backgroundService } from '../../BusinessLayer/FileSystem/backgroundService.js';

const logger = createApiLogger('FileAPI:backgroundOperations');

/**
 * Get current background state
 * @returns {Promise<Object>} Operation result with current background state {success: boolean, currentPath: string, mode: string, error?: string}
 */
export async function getBackgroundState() {
  try {
    logApiStart(logger, 'getBackgroundState');
    
    // Use service from business layer
    const result = await backgroundService.getBackgroundState();
    
    // Log result
    if (result.success) {
      logger.debug(`Got background state: ${JSON.stringify({currentPath: result.currentPath, mode: result.mode})}`);
      logApiSuccess(logger, 'getBackgroundState');
    } else {
      logApiError(logger, 'getBackgroundState', new Error(result.error));
    }
    
    return result;
  } catch (error) {
    logApiError(logger, 'getBackgroundState', error);
    return { 
      success: false, 
      currentPath: "", 
      mode: "random", 
      error: error.message 
    };
  }
}

/**
 * Save path to background image
 * @param {string} imagePath - Image path
 * @returns {Promise<Object>} Operation result {success: boolean, error?: string}
 */
export async function saveBackgroundPath(imagePath) {
  try {
    logApiStart(logger, 'saveBackgroundPath', { imagePath });
    
    // Use service from business layer
    const result = await backgroundService.saveBackgroundPath(imagePath);
    
    // Log result
    if (result.success) {
      logApiSuccess(logger, 'saveBackgroundPath');
    } else {
      logApiError(logger, 'saveBackgroundPath', new Error(result.error));
    }
    
    return result;
  } catch (error) {
    logApiError(logger, 'saveBackgroundPath', error);
    return { success: false, error: error.message };
  }
}

/**
 * Get background display mode
 * @returns {Promise<Object>} Operation result {success: boolean, mode: string, error?: string}
 */
export async function getBackgroundMode() {
  try {
    logApiStart(logger, 'getBackgroundMode');
    
    // Use service from business layer
    const result = await backgroundService.getBackgroundMode();
    
    // Log result
    if (result.success) {
      logApiSuccess(logger, 'getBackgroundMode');
    } else {
      logApiError(logger, 'getBackgroundMode', new Error(result.error));
    }
    
    return result;
  } catch (error) {
    logApiError(logger, 'getBackgroundMode', error);
    return { success: false, mode: "random", error: error.message };
  }
}

/**
 * Save background display mode
 * @param {string} mode - Background display mode ("fixed", "random", "story")
 * @returns {Promise<Object>} Operation result {success: boolean, error?: string}
 */
export async function saveBackgroundMode(mode) {
  try {
    logApiStart(logger, 'saveBackgroundMode', { mode });
    
    // Use service from business layer
    const result = await backgroundService.saveBackgroundMode(mode);
    
    // Log result
    if (result.success) {
      logApiSuccess(logger, 'saveBackgroundMode');
    } else {
      logApiError(logger, 'saveBackgroundMode', new Error(result.error));
    }
    
    return result;
  } catch (error) {
    logApiError(logger, 'saveBackgroundMode', error);
    return { success: false, error: error.message };
  }
}

/**
 * Get random background image from folder
 * @param {string} [folderPath] - Path to images folder (optional)
 * @returns {Promise<Object>} Operation result {success: boolean, path: string|null, error?: string}
 */
export async function getRandomBackground(folderPath) {
  try {
    logApiStart(logger, 'getRandomBackground', { folderPath });
    
    // Use service from business layer
    const result = await backgroundService.getRandomBackground(folderPath);
    
    // Log result
    if (result.success) {
      logApiSuccess(logger, 'getRandomBackground');
    } else {
      logApiError(logger, 'getRandomBackground', new Error(result.error));
    }
    
    return result;
  } catch (error) {
    logApiError(logger, 'getRandomBackground', error);
    return { success: false, path: null, error: error.message };
  }
}

// Export default object for backward compatibility
export default {
  getBackgroundState,
  saveBackgroundPath,
  getBackgroundMode,
  saveBackgroundMode,
  getRandomBackground
}; 