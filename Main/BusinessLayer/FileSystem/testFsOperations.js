// Main/BusinessLayer/FileSystem/testFsOperations.js
// File system access layer for tests

import fs from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { mainLogger } from '../../loggerHub.js';

// Logger for module
const logger = {
  info: (message) => mainLogger.info('BusinessLayer:FileSystem:testOperations', message),
  warn: (message) => mainLogger.warn('BusinessLayer:FileSystem:testOperations', message),
  error: (message, data) => mainLogger.error('BusinessLayer:FileSystem:testOperations', message, data),
  debug: (message) => mainLogger.debug('BusinessLayer:FileSystem:testOperations', message),
  success: (message) => mainLogger.success('BusinessLayer:FileSystem:testOperations', message)
};

/**
 * Validates path for path traversal attacks
 * @param {string} filePath - Path to validate
 * @returns {{valid: boolean, error?: string}} - Validation result
 */
function validatePath(filePath) {
  if (!filePath || typeof filePath !== 'string') {
    return { valid: false, error: 'Path is empty or invalid' };
  }

  // Check for path traversal
  if (filePath.includes('..')) {
    return { valid: false, error: 'Path traversal detected: contains ".."' };
  }

  return { valid: true };
}

/**
 * Checks test existence in file system
 * @param {string} testPath - Full path to test file
 * @returns {Promise<{success: boolean, exists: boolean, error?: string}>} - Check result
 */
export async function checkTestExists(testPath) {
  try {
    if (!testPath) {
      logger.warn('Test path for check not specified');
      return { 
        success: false, 
        error: 'Test path for check not specified',
        exists: false
      };
    }

    const exists = existsSync(testPath);
    
    logger.debug(`Checking test existence ${testPath}: ${exists ? 'exists' : 'does not exist'}`);
    return {
      success: true,
      exists
    };
  } catch (error) {
    logger.error(`Error checking test existence: ${error.message}`);
    return {
      success: false,
      error: error.message,
      exists: false
    };
  }
}

/**
 * Reads test file content
 * @param {string} testPath - Full path to test file
 * @returns {Promise<{success: boolean, content?: string, error?: string}>} - Read result
 */
export async function readTestContent(testPath) {
  try {
    if (!testPath) {
      logger.warn('Test path for reading not specified');
      return { 
        success: false, 
        error: 'Test path for reading not specified',
        content: ''
      };
    }

    // Check file existence
    const exists = existsSync(testPath);
    if (!exists) {
      logger.warn(`Test does not exist: ${testPath}`);
      return {
        success: false,
        error: 'Test does not exist',
        content: ''
      };
    }

    // Read file contents
    const content = await fs.readFile(testPath, 'utf-8');
    
    logger.debug(`Test content read: ${testPath} (${content.length} bytes)`);
    return {
      success: true,
      content
    };
  } catch (error) {
    logger.error(`Error reading test content: ${error.message}`);
    return {
      success: false,
      error: error.message,
      content: ''
    };
  }
}

/**
 * Writes content to test file
 * @param {string} testPath - Full path to test file
 * @param {string} content - Content to write
 * @param {boolean} [createDir=true] - Whether to create directory if it doesn't exist
 * @returns {Promise<{success: boolean, path?: string, error?: string}>} - Write result
 */
export async function writeTestContent(testPath, content, createDir = true) {
  try {
    if (!testPath) {
      logger.warn('Test path for writing not specified');
      return { 
        success: false, 
        error: 'Test path for writing not specified'
      };
    }

    if (content === undefined || content === null) {
      logger.warn('Content for writing to test not specified');
      return { 
        success: false, 
        error: 'Content for writing to test not specified'
      };
    }

    // Extract directory from path
    const dirPath = path.dirname(testPath);
    
    // Create directory if it doesn't exist
    if (createDir && !existsSync(dirPath)) {
      try {
        await fs.mkdir(dirPath, { recursive: true });
        logger.info(`Directory created for test: ${dirPath}`);
      } catch (mkdirError) {
        logger.error(`Error creating directory: ${mkdirError.message}`);
        return {
          success: false,
          error: `Error creating directory: ${mkdirError.message}`
        };
      }
    }

    // Write content to file
    await fs.writeFile(testPath, content, 'utf-8');
    
    logger.success(`Test content written: ${testPath} (${content.length} bytes)`);
    return {
      success: true,
      path: testPath
    };
  } catch (error) {
    logger.error(`Error writing test: ${error.message}`);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Deletes test file from file system
 * @param {string} testPath - Full path to test file
 * @returns {Promise<{success: boolean, path?: string, error?: string}>} - Deletion result
 */
export async function deleteTestFile(testPath) {
  try {
    if (!testPath) {
      logger.warn('Test path for deletion not specified');
      return { 
        success: false, 
        error: 'Test path for deletion not specified'
      };
    }

    // Check file existence
    const exists = existsSync(testPath);
    if (!exists) {
      logger.warn(`Test for deletion does not exist: ${testPath}`);
      return {
        success: true,
        path: testPath,
        message: 'File did not exist'
      };
    }

    // Delete file
    await fs.unlink(testPath);
    
    logger.success(`Test deleted: ${testPath}`);
    return {
      success: true,
      path: testPath
    };
  } catch (error) {
    logger.error(`Error deleting test: ${error.message}`);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Merges tests into single file
 * @param {Array<string>} testPaths - Array of test paths to merge
 * @param {string} outputPath - Path to save merged test
 * @returns {Promise<{success: boolean, path?: string, questionsCount?: number, error?: string}>} - Merge result
 */
export async function mergeTests(testPaths, outputPath) {
  try {
    if (!testPaths || !Array.isArray(testPaths) || testPaths.length === 0) {
      logger.warn('Test paths for merging not specified');
      return { 
        success: false, 
        error: 'Test paths for merging not specified',
        questionsCount: 0
      };
    }

    if (!outputPath) {
      logger.warn('Path for saving merged test not specified');
      return { 
        success: false, 
        error: 'Path for saving merged test not specified',
        questionsCount: 0
      };
    }

    // Create directory for merged test if it doesn't exist
    const outputDir = path.dirname(outputPath);
    if (!existsSync(outputDir)) {
      await fs.mkdir(outputDir, { recursive: true });
      logger.info(`Directory created for merged test: ${outputDir}`);
    }

    let mergedContent = '';
    let totalQuestionsCount = 0;
    
    // Process each test
    for (const testPath of testPaths) {
      if (!existsSync(testPath)) {
        logger.warn(`Test does not exist and will be skipped: ${testPath}`);
        continue;
      }

      try {
        // Read test content
        const content = await fs.readFile(testPath, 'utf-8');
        
        // Count questions in current file
        const countResult = countQuestionsInContent(content);
        const currentFileQuestions = countResult.success ? countResult.count : 0;
        
        totalQuestionsCount += currentFileQuestions;
        
        // Add separator between tests, but only if content already exists
        if (mergedContent) {
          // Check if previous content ends with empty line
          if (!mergedContent.endsWith('\n\n')) {
            if (mergedContent.endsWith('\n')) {
              mergedContent += '\n';
            } else {
              mergedContent += '\n\n';
            }
          }
        }
        
        // Add test content with check for trailing empty line
        let processedContent = content;
        if (!processedContent.endsWith('\n\n') && !processedContent.endsWith('\n')) {
          processedContent += '\n\n';
        } else if (processedContent.endsWith('\n') && !processedContent.endsWith('\n\n')) {
          processedContent += '\n';
        }
        
        mergedContent += processedContent;
        
        logger.debug(`Test added: ${testPath} (${currentFileQuestions} questions)`);
      } catch (readError) {
        logger.warn(`Error reading test ${testPath}: ${readError.message}. Test will be skipped.`);
      }
    }

    // If no content, return error
    if (!mergedContent) {
      logger.warn('Failed to merge tests - empty content');
      return {
        success: false,
        error: 'Failed to merge tests - empty content',
        questionsCount: 0
      };
    }

    // Write merged test
    await fs.writeFile(outputPath, mergedContent, 'utf-8');
    
    // Check if counted questions match total count
    const finalCountResult = countQuestionsInContent(mergedContent);
    const finalQuestionsCount = finalCountResult.success ? finalCountResult.count : 0;
    
    // If received value differs from expected sum, log warning
    if (finalQuestionsCount !== totalQuestionsCount) {
      logger.warn(`Question count mismatch: expected ${totalQuestionsCount}, got ${finalQuestionsCount}`);
    }
    
    // Use exact question count from final file
    logger.success(`Merged test created: ${outputPath} (${finalQuestionsCount} questions)`);
    return {
      success: true,
      path: outputPath,
      questionsCount: finalQuestionsCount
    };
  } catch (error) {
    logger.error(`Error merging tests: ${error.message}`);
    return {
      success: false,
      error: error.message,
      questionsCount: 0
    };
  }
}

/**
 * Gets list of test files in directory
 * @param {string} directoryPath - Directory path
 * @returns {Promise<{success: boolean, files?: Array<string>, error?: string}>} - Operation result
 */
export async function getTestFilesInDirectory(directoryPath) {
  try {
    if (!directoryPath) {
      logger.warn('Directory path for getting files not specified');
      return { 
        success: false, 
        error: 'Directory path for getting files not specified',
        files: []
      };
    }

    // Check directory existence
    if (!existsSync(directoryPath)) {
      logger.warn(`Directory does not exist: ${directoryPath}`);
      return {
        success: false,
        error: 'Directory does not exist',
        files: []
      };
    }

    // Get all files in directory
    const allFiles = await fs.readdir(directoryPath, { withFileTypes: true });
    
    // Keep only files with .txt extension
    const testFiles = allFiles
      .filter(file => file.isFile() && file.name.endsWith('.txt') && !file.name.startsWith('.'))
      .map(file => path.join(directoryPath, file.name));
    
    logger.debug(`Found ${testFiles.length} tests in directory ${directoryPath}`);
    return {
      success: true,
      files: testFiles
    };
  } catch (error) {
    logger.error(`Error getting test list: ${error.message}`);
    return {
      success: false,
      error: error.message,
      files: []
    };
  }
}

/**
 * Loads test from source file to specified directory
 * @param {string} sourcePath - Full path to source file
 * @param {string} destinationPath - Full path to save test
 * @returns {Promise<{success: boolean, path?: string, content?: string, error?: string}>} - Operation result
 */
export async function uploadTestFile(sourcePath, destinationPath) {
  try {
    if (!sourcePath) {
      logger.warn('Source file path for upload not specified');
      return {
        success: false,
        error: 'Source file path for upload not specified'
      };
    }

    if (!destinationPath) {
      logger.warn('Destination path for test upload not specified');
      return {
        success: false,
        error: 'Destination path for test upload not specified'
      };
    }

    // Validate destination path for path traversal
    const destValidation = validatePath(destinationPath);
    if (!destValidation.valid) {
      logger.warn(`Invalid destination path: ${destValidation.error}`);
      return {
        success: false,
        error: destValidation.error
      };
    }

    // Check source file existence
    if (!existsSync(sourcePath)) {
      logger.warn(`Source file does not exist: ${sourcePath}`);
      return {
        success: false,
        error: 'Source file does not exist'
      };
    }

    // Create destination directory if it doesn't exist
    const destinationDir = path.dirname(destinationPath);
    if (!existsSync(destinationDir)) {
      try {
        await fs.mkdir(destinationDir, { recursive: true });
        logger.info(`Directory created for test: ${destinationDir}`);
      } catch (mkdirError) {
        logger.error(`Error creating directory: ${mkdirError.message}`);
        return {
          success: false,
          error: `Error creating directory: ${mkdirError.message}`
        };
      }
    }

    // Read file contents
    const content = await fs.readFile(sourcePath, 'utf-8');
    
    // Copy file to destination
    await fs.copyFile(sourcePath, destinationPath);
    
    logger.success(`Test uploaded: ${sourcePath} → ${destinationPath}`);
    return {
      success: true,
      path: destinationPath,
      content
    };
  } catch (error) {
    logger.error(`Error uploading test: ${error.message}`);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Renames test file in file system
 * @param {string} oldPath - Current full path to test file
 * @param {string} newPath - New full path for test file
 * @returns {Promise<{success: boolean, path?: string, error?: string}>} - Rename result
 */
export async function renameTestFile(oldPath, newPath) {
  try {
    if (!oldPath) {
      logger.warn('Old path for rename not specified');
      return {
        success: false,
        error: 'Old path for rename not specified'
      };
    }

    if (!newPath) {
      logger.warn('New path for rename not specified');
      return {
        success: false,
        error: 'New path for rename not specified'
      };
    }

    // Validate paths for path traversal
    const oldPathValidation = validatePath(oldPath);
    if (!oldPathValidation.valid) {
      logger.warn(`Invalid old path: ${oldPathValidation.error}`);
      return {
        success: false,
        error: oldPathValidation.error
      };
    }

    const newPathValidation = validatePath(newPath);
    if (!newPathValidation.valid) {
      logger.warn(`Invalid new path: ${newPathValidation.error}`);
      return {
        success: false,
        error: newPathValidation.error
      };
    }

    // Check if source file exists
    if (!existsSync(oldPath)) {
      logger.warn(`Source file for rename does not exist: ${oldPath}`);
      return {
        success: false,
        error: 'Source file does not exist'
      };
    }

    // Check if destination file already exists
    if (existsSync(newPath) && oldPath !== newPath) {
      logger.warn(`Destination file already exists: ${newPath}`);
      return {
        success: false,
        error: 'File with this name already exists'
      };
    }

    // Create destination directory if it doesn't exist
    const newDir = path.dirname(newPath);
    if (!existsSync(newDir)) {
      try {
        await fs.mkdir(newDir, { recursive: true });
        logger.info(`Directory created for renamed test: ${newDir}`);
      } catch (mkdirError) {
        logger.error(`Error creating directory: ${mkdirError.message}`);
        return {
          success: false,
          error: `Error creating directory: ${mkdirError.message}`
        };
      }
    }

    // Rename file
    await fs.rename(oldPath, newPath);

    logger.success(`Test file renamed: ${oldPath} → ${newPath}`);
    return {
      success: true,
      path: newPath
    };
  } catch (error) {
    logger.error(`Error renaming test file: ${error.message}`);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Counts questions in test content
 * @param {string} content - Test content
 * @returns {{success: boolean, count: number, error?: string}} - Count result
 */
export function countQuestionsInContent(content) {
  try {
    if (!content || typeof content !== 'string') {
      logger.warn('Empty or invalid test content for counting questions');
      return { 
        success: true, 
        count: 0 
      };
    }

    // Find occurrences of strings with question marker (## question)
    const questionMarkers = content.match(/##\s*question/gi);
    const markerCount = questionMarkers ? questionMarkers.length : 0;
    
    // If markers found, use their count
    if (markerCount > 0) {
      logger.debug(`Found ${markerCount} question markers`);
      return { 
        success: true, 
        count: markerCount 
      };
    }
    
    // Alternative counting algorithm by question structure
    let count = 0;
    const lines = content.split('\n');
    let currentQuestion = false;
    let inAnswers = false;
    let answerCount = 0;

    for (let i = 0; i < lines.length; i++) {
      const trimmedLine = lines[i].trim();
      
      // Skip separators and headers
      if (trimmedLine.startsWith('###') || trimmedLine.startsWith('----')) {
        continue;
      }
      
      // Empty line after answer block completion means end of question
      if (trimmedLine === '') {
        if (currentQuestion && inAnswers && answerCount > 0) {
          count++;
          logger.debug(`Found question #${count}`);
        }
        currentQuestion = false;
        inAnswers = false;
        answerCount = 0;
        continue;
      }
      
      // Start of new question (non-empty line before answer block)
      if (!currentQuestion && trimmedLine !== '' && !trimmedLine.startsWith('*')) {
        currentQuestion = true;
        inAnswers = false;
        answerCount = 0;
        continue;
      }
      
      // Determine we're in answer block (line starting with asterisk or just answer option)
      if (trimmedLine.startsWith('*') && currentQuestion) {
        inAnswers = true;
        answerCount++;
      } else if (currentQuestion && inAnswers && trimmedLine !== '') {
        // This is an answer option
        answerCount++;
      }
    }

    // Account for last question if file doesn't end with empty line
    if (currentQuestion && inAnswers && answerCount > 0) {
      count++;
      logger.debug(`Found last question #${count}`);
    }

    logger.debug(`Counted ${count} questions in test content`);
    return { 
      success: true, 
      count 
    };
  } catch (error) {
    logger.error(`Error counting questions: ${error.message}`);
    return {
      success: false,
      error: error.message,
      count: 0
    };
  }
}

// Export all functions as single object for convenience
export const testFsOperations = {
  checkTestExists,
  readTestContent,
  writeTestContent,
  deleteTestFile,
  mergeTests,
  getTestFilesInDirectory,
  uploadTestFile,
  countQuestionsInContent,
  renameTestFile
}; 