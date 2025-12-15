import { mainLogger } from '../../loggerHub.js';
import { testRepository } from '../../BusinessLayer/DB/testRepository.js';
import { createApiLogger, logApiStart, logApiSuccess, logApiError } from '../../Logger/apiLogger.js';

// Create logger for module
const logger = createApiLogger('TestAPI:checkbox');

/**
 * API for test checkboxes
 */
export const testCheckboxAPI = {
  /**
   * Gets paths of selected tests by their IDs
   * @param {string[]} testIds - Array of test identifiers
   * @returns {Promise<{success: boolean, paths: string[], error: string|null}>} - Path retrieval result
   */
  async getSelectedPaths(testIds) {
    logApiStart(logger, 'getSelectedPaths', { testIds: Array.isArray(testIds) ? `${testIds.length} items` : 'invalid format' });
    
    try {
      const result = testRepository.getSelectedTestPaths(testIds);
      
      if (result.success) {
        logApiSuccess(logger, `getSelectedPaths: got ${result.paths.length} paths`);
      } else {
        logApiError(logger, 'getSelectedPaths', new Error(result.error));
      }
      
      return result;
    } catch (error) {
      logApiError(logger, 'getSelectedPaths', error);
      return { success: false, paths: [], error: error.message };
    }
  },

  /**
   * Validates and formats selected test paths
   * @param {string[]} paths - Array of test paths
   * @returns {Promise<{success: boolean, formattedPaths: string[], error: string|null}>} - Validation result
   */
  async validatePaths(paths) {
    logApiStart(logger, 'validatePaths', { pathCount: Array.isArray(paths) ? paths.length : 'invalid format' });
    
    try {
      const result = testRepository.validateAndFormatTestPaths(paths);
      
      if (result.success) {
        logApiSuccess(logger, `validatePaths: validated ${result.formattedPaths.length} paths`);
      } else {
        logApiError(logger, 'validatePaths', new Error(result.error));
      }
      
      return result;
    } catch (error) {
      logApiError(logger, 'validatePaths', error);
      return { success: false, formattedPaths: [], error: error.message };
    }
  },

  /**
   * Validates test selection
   * @param {string[]} testPaths - Array of test paths
   * @returns {Promise<{success: boolean, validCount: number, isValid: boolean, error: string|null}>} - Check result
   */
  async validateSelection(testPaths) {
    logApiStart(logger, 'validateSelection', { pathCount: Array.isArray(testPaths) ? testPaths.length : 'invalid format' });
    
    try {
      const result = testRepository.validateTestSelection(testPaths);
      
      if (result.success) {
        logApiSuccess(logger, `validateSelection: ${result.validCount} valid tests`);
      } else {
        logApiError(logger, 'validateSelection', new Error(result.error));
      }
      
      return result;
    } catch (error) {
      logApiError(logger, 'validateSelection', error);
      return { success: false, validCount: 0, isValid: false, error: error.message };
    }
  },

  /**
   * Checks file existence in DB
   * @param {string} filePath - File path
   * @returns {Promise<{success: boolean, exists: boolean, error: string|null}>} - File existence check result
   */
  async checkFileExists(filePath) {
    logApiStart(logger, 'checkFileExists', { filePath });
    
    try {
      const exists = testRepository.fileExistsInDB(filePath);
      logApiSuccess(logger, `checkFileExists: file ${exists ? 'exists' : 'does not exist'}`);
      return { 
        success: true, 
        exists: exists 
      };
    } catch (error) {
      logApiError(logger, 'checkFileExists', error);
      return { 
        success: false, 
        exists: false, 
        error: error.message 
      };
    }
  }
};

// Export individual methods for convenience
export const getSelectedPaths = testCheckboxAPI.getSelectedPaths;
export const validatePaths = testCheckboxAPI.validatePaths;
export const validateSelection = testCheckboxAPI.validateSelection;
export const checkFileExists = testCheckboxAPI.checkFileExists; 