// Main/API/TestAPI/testUpdate.js
// API for updating test content

import path from 'path';
import { createApiLogger, logApiStart, logApiSuccess, logApiError } from '../../Logger/apiLogger.js';
import { getBasePath } from '../../Utils/appPaths.js';

// Import business layer via central hub
import businessLayer from '../../businessLayerHub.js';

// Create logger for module
const logger = createApiLogger('TestAPI:testUpdate');

/**
 * Gets test content
 * @param {string} testPath - Test path (starts with Tests/)
 * @returns {Promise<Object>} - Operation result with content
 */
export async function getTestContent(testPath) {
  try {
    logApiStart(logger, 'getTestContent', { testPath });

    // 1. Parameter validation
    if (!testPath) {
      logApiError(logger, 'getTestContent', new Error('Test path not specified'));
      return { success: false, error: 'Test path not specified' };
    }

    // 2. Convert to OS-specific absolute path
    const osPath = path.join(getBasePath(), testPath.split('/').join(path.sep));

    // 3. Read content using business layer
    const result = await businessLayer.fs.test.readTestContent(osPath);

    if (!result.success) {
      logApiError(logger, 'getTestContent', new Error(result.error));
      return { success: false, error: result.error };
    }

    logApiSuccess(logger, 'getTestContent');
    return {
      success: true,
      content: result.content
    };
  } catch (error) {
    logApiError(logger, 'getTestContent', error);
    return { success: false, error: error.message };
  }
}

/**
 * Updates test content
 * @param {string} testPath - Test path (starts with Tests/)
 * @param {string} content - New test content
 * @returns {Promise<Object>} - Operation result
 */
export async function updateTestContent(testPath, content) {
  try {
    logApiStart(logger, 'updateTestContent', { testPath, contentLength: content?.length });

    // 1. Parameter validation
    if (!testPath) {
      logApiError(logger, 'updateTestContent', new Error('Test path not specified'));
      return { success: false, error: 'Test path not specified' };
    }

    if (content === undefined || content === null) {
      logApiError(logger, 'updateTestContent', new Error('Content not specified'));
      return { success: false, error: 'Content not specified' };
    }

    // 2. Convert to OS-specific absolute path
    const osPath = path.join(getBasePath(), testPath.split('/').join(path.sep));

    // 3. Count questions in new content
    const countResult = businessLayer.fs.test.countQuestionsInContent(content);
    const questionsCount = countResult.success ? countResult.count : 0;
    logger.info(`Found ${questionsCount} questions in new content`);

    // 4. DB FIRST: Update questions count in database
    const dbResult = businessLayer.db.test.updateTest(testPath, { questions: questionsCount });

    if (!dbResult.success) {
      logApiError(logger, 'updateTestContent', new Error(dbResult.error));
      return { success: false, error: dbResult.error };
    }
    logger.debug('Test record updated in DB successfully');

    // 5. FS SECOND: Write new content to file
    const fsResult = await businessLayer.fs.test.writeTestContent(osPath, content);

    if (!fsResult.success) {
      logApiError(logger, 'updateTestContent', new Error(fsResult.error));
      return { success: false, error: fsResult.error };
    }

    logApiSuccess(logger, 'updateTestContent');
    return {
      success: true,
      path: testPath,
      questions: questionsCount
    };
  } catch (error) {
    logApiError(logger, 'updateTestContent', error);
    return { success: false, error: error.message };
  }
}
