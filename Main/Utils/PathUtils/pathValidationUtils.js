import { mainLogger } from '../../loggerHub.js';

/**
 * Checks if category name is properly formed
 * @param {string} name - Name to check
 * @returns {boolean} - Check result
 */
export function isValidCategoryName(name) {
  try {
    if (!name || typeof name !== 'string' || name.trim() === '') {
      mainLogger.debug('pathValidationUtils', `Category name check: empty name`);
      return false;
    }
    
    // Check for invalid characters in Windows and Unix
    const invalidChars = /[<>:"/\\|?*]/;
    const isValid = !invalidChars.test(name);
    
    mainLogger.debug('pathValidationUtils', `Category name check "${name}": ${isValid ? 'valid' : 'invalid'}`);
    return isValid;
  } catch (error) {
    mainLogger.error('pathValidationUtils', `Error checking category name: ${error.message}`);
    return false;
  }
}

/**
 * Checks if folder path is valid
 * @param {string} folderPath - Folder path
 * @returns {boolean} - Check result
 */
export function isValidFolderPath(folderPath) {
  try {
    if (!folderPath || typeof folderPath !== 'string' || folderPath.trim() === '') {
      mainLogger.debug('pathValidationUtils', `Folder path check: empty path`);
      return false;
    }
    
    // Check for invalid characters in Windows and Unix
    const invalidChars = /[<>:"|?*]/;
    const isValid = !invalidChars.test(folderPath);
    
    mainLogger.debug('pathValidationUtils', `Folder path check "${folderPath}": ${isValid ? 'valid' : 'invalid'}`);
    return isValid;
  } catch (error) {
    mainLogger.error('pathValidationUtils', `Error checking folder path: ${error.message}`);
    return false;
  }
} 