import { mainLogger } from '../../loggerHub.js';

// Common invalid characters for Windows and Unix file systems
// Note: path traversal (..) is checked separately for explicit error messages
const INVALID_NAME_CHARS = /[<>:"/\\|?*]/;  // For names (no slashes allowed)
const INVALID_PATH_CHARS = /[<>:"|?*]/;      // For paths (slashes allowed, colon blocked for Windows)
const PATH_TRAVERSAL = /\.{2,}/;             // Two or more dots in sequence

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

    // Check for path traversal first (more specific error)
    if (PATH_TRAVERSAL.test(name)) {
      mainLogger.debug('pathValidationUtils', `Category name check "${name}": contains path traversal`);
      return false;
    }

    // Check for invalid characters in Windows and Unix
    if (INVALID_NAME_CHARS.test(name)) {
      mainLogger.debug('pathValidationUtils', `Category name check "${name}": contains invalid characters`);
      return false;
    }

    mainLogger.debug('pathValidationUtils', `Category name check "${name}": valid`);
    return true;
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

    // Check for path traversal first (more specific error)
    if (PATH_TRAVERSAL.test(folderPath)) {
      mainLogger.debug('pathValidationUtils', `Folder path check "${folderPath}": contains path traversal`);
      return false;
    }

    // Check for invalid characters in Windows and Unix (allows / and \ for paths)
    if (INVALID_PATH_CHARS.test(folderPath)) {
      mainLogger.debug('pathValidationUtils', `Folder path check "${folderPath}": contains invalid characters`);
      return false;
    }

    mainLogger.debug('pathValidationUtils', `Folder path check "${folderPath}": valid`);
    return true;
  } catch (error) {
    mainLogger.error('pathValidationUtils', `Error checking folder path: ${error.message}`);
    return false;
  }
} 