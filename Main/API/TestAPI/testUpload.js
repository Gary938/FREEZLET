// Main/API/TestAPI/testUpload.js
// API for test upload

import path from 'path';
import { createApiLogger, logApiStart, logApiSuccess, logApiError } from '../../Logger/apiLogger.js';
import { 
  normalizeFolderPath,
  getLastFolderFromPath,
  categoryExistsInDB
} from '../../Utils/pathUtils.js';

// Import business layer via central hub
import businessLayer from '../../businessLayerHub.js';

// Create logger for module
const logger = createApiLogger('TestAPI:testUpload');

/**
 * Uploads test from source file to category
 * @param {string} sourcePath - Source file path
 * @param {string} categoryPath - Category path (starts with Tests/)
 * @returns {Promise<Object>} - Operation result
 */
export async function uploadTest(sourcePath, categoryPath) {
  try {
    logApiStart(logger, 'uploadTest', { sourcePath, categoryPath });
    
    // 1. Parameter check
    if (!sourcePath) {
      logApiError(logger, 'uploadTest', new Error('Source file path not specified'));
      return { success: false, error: 'Source file path not specified' };
    }
    
    if (!categoryPath) {
      logApiError(logger, 'uploadTest', new Error('Category path not specified'));
      return { success: false, error: 'Category path not specified' };
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
      logApiError(logger, 'uploadTest', new Error('Category does not exist'));
      return { success: false, error: 'Category does not exist' };
    }
    
    // 5. Get file name from path
    const fileName = path.basename(sourcePath);
    logger.debug(`File name: ${fileName}`);
    
    // 6. Form standardized destination path
    const destinationPath = `${normalizedCategoryPath}/${fileName}`;
    const osSpecificDestPath = destinationPath.split('/').join(path.sep);
    logger.debug(`Destination path: ${destinationPath}`);
    
    // 7. Upload file using business layer via hub
    const fsResult = await businessLayer.fs.test.uploadTestFile(sourcePath, osSpecificDestPath);
    
    if (!fsResult.success) {
      logApiError(logger, 'uploadTest', new Error(fsResult.error));
      return { success: false, error: fsResult.error };
    }
    
    // 8. Count questions in content
    const contentResult = businessLayer.fs.test.countQuestionsInContent(fsResult.content);
    const questionsCount = contentResult.success ? contentResult.count : 0;
    logger.info(`Found ${questionsCount} questions in file`);
    
    // 9. Upload test info to DB via hub
    const dbResult = await businessLayer.db.test.uploadTest(destinationPath, fileName, questionsCount);
    
    if (!dbResult.success) {
      logApiError(logger, 'uploadTest', new Error(dbResult.error));
      return { success: false, error: dbResult.error };
    }
    
    logApiSuccess(logger, 'uploadTest');
    return { 
      success: true, 
      path: destinationPath,
      questions: questionsCount
    };
  } catch (error) {
    logApiError(logger, 'uploadTest', error);
    return { success: false, error: error.message };
  }
}

/**
 * Uploads multiple tests from source files to category
 * @param {string} categoryPath - Category path (starts with Tests/)
 * @param {Array<{path: string, name: string}>} files - Array with file information
 * @returns {Promise<Object>} - Operation result
 */
export async function uploadMultipleTests(categoryPath, files) {
  try {
    logApiStart(logger, 'uploadMultipleTests', { categoryPath, fileCount: files ? files.length : 0 });
    
    // 1. Parameter check
    if (!categoryPath) {
      logApiError(logger, 'uploadMultipleTests', new Error('Category path not specified'));
      return { success: false, error: 'Category path not specified' };
    }
    
    if (!files || !Array.isArray(files) || files.length === 0) {
      logApiError(logger, 'uploadMultipleTests', new Error('File list for upload not specified'));
      return { 
        success: false,
        error: 'File list for upload not specified',
        uploaded: [],
        failed: []
      };
    }
    
    // 2. Normalize category path
    const normalizedCategoryPath = normalizeFolderPath(categoryPath);
    logger.debug(`Normalized category path for batch upload: ${normalizedCategoryPath}`);
    
    const results = {
      success: true,
      uploaded: [],
      failed: [],
      error: null
    };
    
    // 3. Process each file
    for (const file of files) {
      const result = await uploadTest(file.path, normalizedCategoryPath);
      
      if (result.success) {
        results.uploaded.push({
          name: file.name,
          path: result.path,
          questions: result.questions
        });
      } else {
        results.failed.push({
          name: file.name,
          error: result.error
        });
      }
    }
    
    // 4. Determine overall operation status
    if (results.failed.length > 0 && results.uploaded.length > 0) {
      results.error = `Failed to upload ${results.failed.length} of ${files.length} tests`;
    } 
    else if (results.failed.length > 0 && results.uploaded.length === 0) {
      results.success = false;
      results.error = 'Failed to upload any test';
      logApiError(logger, 'uploadMultipleTests', new Error(results.error));
      return results;
    }
    
    logger.info(`Upload completed: ${results.uploaded.length} successful, ${results.failed.length} with errors`);
    logApiSuccess(logger, 'uploadMultipleTests');
    return results;
  } catch (error) {
    logApiError(logger, 'uploadMultipleTests', error);
    return { 
      success: false, 
      uploaded: [],
      failed: [],
      error: error.message 
    };
  }
} 
