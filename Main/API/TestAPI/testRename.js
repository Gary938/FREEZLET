// Main/API/TestAPI/testRename.js
// API for renaming tests

import path from 'path';
import { createApiLogger, logApiStart, logApiSuccess, logApiError } from '../../Logger/apiLogger.js';
import { getBasePath } from '../../Utils/appPaths.js';

// Import business layer via central hub
import businessLayer from '../../businessLayerHub.js';

// Create logger for module
const logger = createApiLogger('TestAPI:testRename');

/**
 * Renames test (updates DB and file system)
 * @param {string} testPath - Current test path (starts with Tests/)
 * @param {string} newName - New test name (without .txt extension)
 * @returns {Promise<Object>} - Operation result
 */
export async function renameTest(testPath, newName) {
  try {
    logApiStart(logger, 'renameTest', { testPath, newName });

    // 1. Parameter validation
    if (!testPath) {
      logApiError(logger, 'renameTest', new Error('Test path not specified'));
      return { success: false, error: 'Test path not specified' };
    }

    if (!newName) {
      logApiError(logger, 'renameTest', new Error('New name not specified'));
      return { success: false, error: 'New name not specified' };
    }

    // Check for path traversal attempts
    if (testPath.includes('..')) {
      logApiError(logger, 'renameTest', new Error('Invalid path: contains ".."'));
      return { success: false, error: 'Invalid path' };
    }

    // 2. Sanitize new name and add .txt extension if needed
    let sanitizedName = newName.trim();
    if (!sanitizedName.endsWith('.txt')) {
      sanitizedName += '.txt';
    }
    logger.debug(`Sanitized new name: ${sanitizedName}`);

    // 3. Get directory path from current test path
    const dirPath = path.dirname(testPath);

    // 4. Form new path
    const newPath = `${dirPath}/${sanitizedName}`;
    logger.debug(`New path: ${newPath}`);

    // 5. Check if new path is same as old (nothing to do)
    if (testPath === newPath) {
      logger.info('New name same as old, no changes needed');
      return { success: true, path: testPath };
    }

    // 6. DB FIRST: Rename test in database
    const dbResult = businessLayer.db.test.renameTest(testPath, newPath, sanitizedName);

    if (!dbResult.success) {
      logApiError(logger, 'renameTest', new Error(dbResult.error));
      return { success: false, error: dbResult.error };
    }
    logger.debug('Test renamed in DB successfully');

    // 7. FS SECOND: Rename file in file system
    const oldOsPath = path.join(getBasePath(), testPath.split('/').join(path.sep));
    const newOsPath = path.join(getBasePath(), newPath.split('/').join(path.sep));

    const fsResult = await businessLayer.fs.test.renameTestFile(oldOsPath, newOsPath);

    if (!fsResult.success) {
      // Rollback DB change on FS failure
      logger.warn('FS rename failed, rolling back DB change...');
      try {
        // Get old name from testPath
        const oldName = path.basename(testPath);
        businessLayer.db.test.renameTest(newPath, testPath, oldName);
        logger.debug('DB change rolled back successfully');
      } catch (rollbackError) {
        logger.error(`Failed to rollback DB change: ${rollbackError.message}`);
      }

      logApiError(logger, 'renameTest', new Error(fsResult.error));
      return { success: false, error: fsResult.error };
    }

    logApiSuccess(logger, 'renameTest');
    return {
      success: true,
      oldPath: testPath,
      newPath: newPath
    };
  } catch (error) {
    logApiError(logger, 'renameTest', error);
    return { success: false, error: error.message };
  }
}
