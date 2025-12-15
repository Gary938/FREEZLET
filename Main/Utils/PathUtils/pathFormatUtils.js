import { mainLogger } from '../../loggerHub.js';

/**
 * Gets last folder name from path
 * @param {string} filePath - Path to file or folder
 * @returns {string} - Last folder name
 */
export function getLastFolderFromPath(filePath) {
  // Standardize slashes and remove trailing slashes
  const normalizedPath = filePath.replace(/\\/g, '/').replace(/\/$/, '');
  
  // If path contains Tests/, extract only part after Tests/
  if (normalizedPath.startsWith('Tests/')) {
    const afterTests = normalizedPath.substring(6); // 'Tests/'.length = 6
    
    // If no slashes in part after 'Tests/', return that entire part
    if (!afterTests.includes('/')) {
      return afterTests;
    }
    
    // If slashes exist, split path and take first part after Tests/
    const firstFolderAfterTests = afterTests.split('/')[0];
    return firstFolderAfterTests;
  }
  
  // If path doesn't start with Tests/, just take last part of path
  const parts = normalizedPath.split('/');
  return parts[parts.length - 1];
}

/**
 * Normalizes folder path
 * @param {string} folderPath - Folder path
 * @returns {string} - Normalized path
 */
export function normalizeFolderPath(folderPath) {
  try {
    if (!folderPath) return '';

    // Standardize slashes
    const normalizedPath = folderPath.replace(/\\/g, '/').replace(/\/+$/, '');
    mainLogger.debug('pathFormatUtils', `Normalizing folder path: ${folderPath} → ${normalizedPath}`);
    return normalizedPath;
  } catch (error) {
    mainLogger.error('pathFormatUtils', `Error normalizing folder path: ${error.message}`);
    return folderPath;
  }
}

/**
 * Full path normalization with Tests/ prefix
 * @param {string|{path:string}} input - path or object with path
 * @returns {string} - normalized path Tests/...
 */
export function normalizePath(input) {
  const path = typeof input === 'object' ? input?.path : input;
  if (!path || typeof path !== 'string') return '';

  return path
    .trim()
    .replace(/\\/g, '/')        // backslash → forward
    .replace(/\/+/g, '/')       // double slashes → single
    .replace(/\/+$/, '')        // remove trailing /
    .replace(/^(?!Tests\/)(.+)/, 'Tests/$1'); // add Tests/
}

/**
 * Replaces part of path (for renaming)
 * @param {string} path - original path
 * @param {string} oldPart - old path part
 * @param {string} newPart - new path part
 * @returns {string} - path with replaced part
 */
export function replacePathPart(path, oldPart, newPart) {
  const normalizedPath = normalizePath(path);
  const normalizedOld = normalizePath(oldPart);
  const normalizedNew = normalizePath(newPart);

  if (normalizedPath.startsWith(normalizedOld)) {
    return normalizedNew + normalizedPath.slice(normalizedOld.length);
  }
  return normalizedPath;
}