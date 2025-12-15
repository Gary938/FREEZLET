import { ipcMain } from 'electron';
import path from 'path';
import { db } from '../../db.js';
import { mainLogger } from '../../loggerHub.js';
import { 
  createApiLogger, 
  logApiStart, 
  logApiSuccess, 
  logApiError 
} from '../../Logger/apiLogger.js';
import { normalizePath, replacePathPart } from '../../Utils/PathUtils/pathFormatUtils.js';
import {
  folderOperations as folderOps,
  normalizeFolderPath,
  isValidFolderPath
} from '../../BusinessLayer/FileSystem/folderOperations.js';

// Create logger for module
const logger = createApiLogger('FileAPI:folderOperations');

/**
 * Creates new folder
 * @param {string} folderPath - Path to folder to create
 * @returns {Promise<Object>} - Operation result
 */
export async function createFolder(folderPath) {
  try {
    // Log operation start
    logApiStart(logger, 'createFolder', { folderPath });
    
    // Create folder via business layer
    const result = await folderOps.createFolder(folderPath);
    
    // Log result
    if (result.success) {
      logApiSuccess(logger, 'createFolder');
    } else {
      logApiError(logger, 'createFolder', new Error(result.error));
    }
    
    return result;
  } catch (error) {
    logApiError(logger, 'createFolder', error);
    return { success: false, error: error.message };
  }
}

/**
 * Renames folder
 * @param {string} oldPath - Current folder path
 * @param {string} newPath - New folder path
 * @returns {Promise<Object>} - Operation result
 */
export async function renameFolder(oldPath, newPath) {
  try {
    // Log operation start
    logApiStart(logger, 'renameFolder', { oldPath, newPath });
    
    // Validate paths
    if (!isValidFolderPath(oldPath) || !isValidFolderPath(newPath)) {
      logger.warn(`Invalid paths: oldPath=${oldPath}, newPath=${newPath}`);
      return { success: false, error: 'Folder path contains invalid characters or is empty' };
    }
    
    // Normalize paths
    const normalizedOldPath = normalizeFolderPath(oldPath);
    const normalizedNewPath = normalizeFolderPath(newPath);
    
    // Check folder existence in DB
    const existsInDB = folderExistsInDB(normalizedOldPath);
    
    // If DB has records, update paths
    let dbUpdateResult = true;
    if (existsInDB) {
      logger.info(`DB records found for path: ${normalizedOldPath}`);
      
      try {
        // Update paths in DB
        dbUpdateResult = updatePathsInDB(normalizedOldPath, normalizedNewPath);
        if (dbUpdateResult) {
          logger.info(`DB paths successfully updated: ${normalizedOldPath} → ${normalizedNewPath}`);
        } else {
          logger.error(`Failed to update DB paths`);
        }
      } catch (dbError) {
        logger.error(`DB update error: ${dbError.message}`);
        dbUpdateResult = false;
      }
    }
    
    // Check DB operation results
    if (existsInDB && !dbUpdateResult) {
      return { success: false, error: 'Failed to update paths in database' };
    }
    
    // Rename folder via business layer
    const fsResult = await folderOps.renameFolder(normalizedOldPath, normalizedNewPath);
    
    // Log result
    if (fsResult.success) {
      logApiSuccess(logger, 'renameFolder');
      return { success: true };
    } else {
      logApiError(logger, 'renameFolder', new Error(fsResult.error));
      return fsResult;
    }
  } catch (error) {
    logApiError(logger, 'renameFolder', error);
    return { success: false, error: error.message };
  }
}

/**
 * Deletes folder
 * @param {string} folderPath - Path to folder to delete
 * @returns {Promise<Object>} - Operation result
 */
export async function deleteFolder(folderPath) {
  try {
    // Log operation start
    logApiStart(logger, 'deleteFolder', { folderPath });
    
    // Validate path
    if (!isValidFolderPath(folderPath)) {
      logger.warn(`Invalid folder path: ${folderPath}`);
      return { success: false, error: 'Folder path contains invalid characters or is empty' };
    }
    
    // Normalize path
    const normalizedPath = normalizeFolderPath(folderPath);
    
    // Check folder existence in DB and delete records if needed
    const existsInDB = folderExistsInDB(normalizedPath);
    let dbDeleteResult = true;
    
    if (existsInDB) {
      logger.info(`DB records found for path: ${normalizedPath}`);
      
      try {
        // Delete records from DB
        dbDeleteResult = deletePathsFromDB(normalizedPath);
        if (dbDeleteResult) {
          logger.info(`DB records successfully deleted for path: ${normalizedPath}`);
        } else {
          logger.error(`Failed to delete DB records`);
        }
      } catch (dbError) {
        logger.error(`DB deletion error: ${dbError.message}`);
        dbDeleteResult = false;
      }
    }
    
    // Check DB operation results
    if (existsInDB && !dbDeleteResult) {
      return { success: false, error: 'Failed to delete records from database' };
    }
    
    // Delete folder via business layer
    const fsResult = await folderOps.deleteFolder(normalizedPath);
    
    // Log result
    if (fsResult.success) {
      logApiSuccess(logger, 'deleteFolder');
      return { success: true };
    } else {
      logApiError(logger, 'deleteFolder', new Error(fsResult.error));
      return fsResult;
    }
  } catch (error) {
    logApiError(logger, 'deleteFolder', error);
    return { success: false, error: error.message };
  }
}

/**
 * Checks folder existence in DB
 * @param {string} folderPath - Folder path
 * @returns {boolean} - Whether folder exists in DB
 */
function folderExistsInDB(folderPath) {
  try {
    const normalized = normalizePath(folderPath);
    const stmt = db.prepare(`
      SELECT COUNT(*) as count FROM tests
      WHERE path LIKE ? OR path = ?
    `);

    const result = stmt.get(`${normalized}/%`, normalized);
    return result.count > 0;
  } catch (error) {
    logger.error(`Error checking folder existence in DB: ${error.message}`);
    return false;
  }
}

/**
 * Updates paths in DB on rename
 * @param {string} oldPath - Old path
 * @param {string} newPath - New path
 * @returns {boolean} - Operation success
 */
function updatePathsInDB(oldPath, newPath) {
  try {
    const normalizedOld = normalizePath(oldPath);
    const normalizedNew = normalizePath(newPath);

    db.prepare('BEGIN TRANSACTION').run();

    try {
      // Get all paths that need updating
      const stmt = db.prepare(`
        SELECT path FROM tests
        WHERE path = ? OR path LIKE ?
      `);
      const rows = stmt.all(normalizedOld, `${normalizedOld}/%`);

      // Update each path
      const updateStmt = db.prepare('UPDATE tests SET path = ? WHERE path = ?');
      for (const row of rows) {
        const updatedPath = replacePathPart(row.path, normalizedOld, normalizedNew);
        updateStmt.run(updatedPath, row.path);
      }

      db.prepare('COMMIT').run();
      return true;
    } catch (error) {
      db.prepare('ROLLBACK').run();
      throw error;
    }
  } catch (error) {
    logger.error(`Error updating paths in DB: ${error.message}`);
    return false;
  }
}

/**
 * Deletes DB records by path
 * @param {string} folderPath - Folder path
 * @returns {boolean} - Operation success
 */
function deletePathsFromDB(folderPath) {
  try {
    const normalized = normalizePath(folderPath);
    const stmt = db.prepare(`
      DELETE FROM tests
      WHERE path = ? OR path LIKE ?
    `);

    stmt.run(normalized, `${normalized}/%`);
    return true;
  } catch (error) {
    logger.error(`Error deleting paths from DB: ${error.message}`);
    return false;
  }
}

/**
 * Registers IPC handlers for folder operations
 */
export function registerFolderOperationsHandlers() {
  // Handler for folder creation
  ipcMain.handle('folder:create', async (event, folderPath) => {
    return await createFolder(folderPath);
  });
  
  // Handler for folder rename
  ipcMain.handle('folder:rename', async (event, oldPath, newPath) => {
    return await renameFolder(oldPath, newPath);
  });
  
  // Handler for folder deletion
  ipcMain.handle('folder:delete', async (event, folderPath) => {
    return await deleteFolder(folderPath);
  });
  
  logger.info('IPC handlers registered for folder operations');
}

export default {
  createFolder,
  renameFolder,
  deleteFolder,
  registerFolderOperationsHandlers
}; 