// Main/API/TestAPI/testCreate.js
// API for creating tests from content

import path from 'path';
import { createApiLogger, logApiStart, logApiSuccess, logApiError } from '../../Logger/apiLogger.js';
import {
  normalizeFolderPath,
  getLastFolderFromPath,
  categoryExistsInDB
} from '../../Utils/pathUtils.js';
import { getBasePath } from '../../Utils/appPaths.js';

// Import business layer via central hub
import businessLayer from '../../businessLayerHub.js';

// Create logger for module
const logger = createApiLogger('TestAPI:testCreate');

/**
 * Creates test from content string
 * @param {string} categoryPath - Category path (starts with Tests/)
 * @param {string} testName - Test file name (without .txt extension)
 * @param {string} content - Test content (questions in TXT format)
 * @returns {Promise<Object>} - Operation result
 */
export async function createTestFromContent(categoryPath, testName, content) {
  try {
    logApiStart(logger, 'createTestFromContent', { categoryPath, testName, contentLength: content?.length });

    // 1. Parameter validation
    if (!categoryPath) {
      logApiError(logger, 'createTestFromContent', new Error('Category path not specified'));
      return { success: false, error: 'Category path not specified' };
    }

    if (!testName) {
      logApiError(logger, 'createTestFromContent', new Error('Test name not specified'));
      return { success: false, error: 'Test name not specified' };
    }

    if (!content || typeof content !== 'string' || content.trim() === '') {
      logApiError(logger, 'createTestFromContent', new Error('Test content not specified or empty'));
      return { success: false, error: 'Test content not specified or empty' };
    }

    // 2. Normalize category path
    const normalizedCategoryPath = normalizeFolderPath(categoryPath);
    logger.debug(`Normalized category path: ${normalizedCategoryPath}`);

    // 3. Get category name
    const categoryName = getLastFolderFromPath(normalizedCategoryPath);
    logger.debug(`Category name: ${categoryName}`);

    // 4. Check category existence in DB
    if (!categoryExistsInDB(categoryName)) {
      logger.warn(`Category does not exist: ${categoryName}`);
      logApiError(logger, 'createTestFromContent', new Error('Category does not exist'));
      return { success: false, error: 'Category does not exist' };
    }

    // 5. Sanitize test name and add .txt extension if needed
    let sanitizedName = testName.trim();
    if (!sanitizedName.endsWith('.txt')) {
      sanitizedName += '.txt';
    }
    logger.debug(`Sanitized test name: ${sanitizedName}`);

    // 6. Form standardized destination path
    const destinationPath = `${normalizedCategoryPath}/${sanitizedName}`;
    // Convert relative path to absolute using getBasePath()
    const osSpecificDestPath = path.join(getBasePath(), destinationPath.split('/').join(path.sep));
    logger.debug(`Destination path: ${destinationPath}, absolute: ${osSpecificDestPath}`);

    // 7. Count questions in content
    const contentResult = businessLayer.fs.test.countQuestionsInContent(content);
    const questionsCount = contentResult.success ? contentResult.count : 0;
    logger.info(`Found ${questionsCount} questions in content`);

    // 8. DB FIRST: Upload test info to DB via hub
    const dbResult = await businessLayer.db.test.uploadTest(destinationPath, sanitizedName, questionsCount);

    if (!dbResult.success) {
      logApiError(logger, 'createTestFromContent', new Error(dbResult.error));
      return { success: false, error: dbResult.error };
    }
    logger.debug('Test record added to DB successfully');

    // 9. FS SECOND: Write content to file using business layer via hub
    const fsResult = await businessLayer.fs.test.writeTestContent(osSpecificDestPath, content);

    if (!fsResult.success) {
      // Rollback DB record on FS failure
      logger.warn('FS write failed, rolling back DB record...');
      try {
        await businessLayer.db.test.deleteTest(destinationPath);
        logger.debug('DB record rolled back successfully');
      } catch (rollbackError) {
        logger.error(`Failed to rollback DB record: ${rollbackError.message}`);
      }

      logApiError(logger, 'createTestFromContent', new Error(fsResult.error));
      return { success: false, error: fsResult.error };
    }

    logApiSuccess(logger, 'createTestFromContent');
    return {
      success: true,
      path: destinationPath,
      questions: questionsCount
    };
  } catch (error) {
    logApiError(logger, 'createTestFromContent', error);
    return { success: false, error: error.message };
  }
}
