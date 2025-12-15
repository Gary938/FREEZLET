/**
 * Category rename operations at file system level
 * @module BusinessLayer/FileSystem/categoryRenameOperations
 */

import fs from 'fs/promises';
import { existsSync } from 'fs';
import { getBusinessLogger } from '../../Logger/businessLogger.js';

// Create logger for module
const logger = getBusinessLogger('BusinessLayer:FS:categoryRenameOperations');

/**
 * Renames directory (used for both categories and subcategories)
 * @param {string} oldPath - Old directory path (received from API)
 * @param {string} newPath - New directory path (received from API)
 * @returns {Promise<Object>} - Operation result
 */
export async function renameDirectory(oldPath, newPath) {
  try {
    logger.debug('Renaming directory', { oldPath, newPath });
    
    // Check old directory existence
    if (!existsSync(oldPath)) {
      logger.warn(`Directory does not exist: ${oldPath}`);
      return { success: false, error: `Directory does not exist: ${oldPath}` };
    }
    
    // Rename directory
    await fs.rename(oldPath, newPath);
    
    logger.info(`Successfully renamed directory: ${oldPath} -> ${newPath}`);
    return { success: true };
  } catch (error) {
    logger.error(`Error renaming directory: ${error.message}`, error);
    return { success: false, error: error.message };
  }
}

// Backward compatibility for existing code using functions separately
export const renameCategoryDirectory = renameDirectory;
export const renameSubcategoryDirectory = renameDirectory;

export default {
  renameDirectory,
  renameCategoryDirectory,
  renameSubcategoryDirectory
}; 