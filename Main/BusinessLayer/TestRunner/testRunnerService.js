// Main/BusinessLayer/TestRunner/testRunnerService.js
// Business layer of test runner service

import { mainLogger } from '../../loggerHub.js';
import { parseTestContent, validateQuestions } from './testParserService.js';
import { readTestContent } from '../FileSystem/testFsOperations.js';
import { getRandomBackground } from '../FileSystem/backgroundService.js';

// Logger for module
const logger = {
  info: (message) => mainLogger.info('BusinessLayer:TestRunner:testRunnerService', message),
  warn: (message) => mainLogger.warn('BusinessLayer:TestRunner:testRunnerService', message),
  error: (message, data) => mainLogger.error('BusinessLayer:TestRunner:testRunnerService', message, data),
  debug: (message) => mainLogger.debug('BusinessLayer:TestRunner:testRunnerService', message),
  success: (message) => mainLogger.success('BusinessLayer:TestRunner:testRunnerService', message)
};

/**
 * Gets test questions from specified file
 * @param {string} testPath - Full path to test file
 * @returns {Promise<{success: boolean, questions?: Array<Object>, error?: string}>} - Question retrieval result
 */
export async function getTestQuestions(testPath) {
  try {
    logger.debug(`Getting questions from test: ${testPath}`);
    
    if (!testPath) {
      logger.warn('Test path not specified');
      return {
        success: false,
        error: 'Test path not specified',
        questions: []
      };
    }
    
    // Read test file content
    const contentResult = await readTestContent(testPath);
    
    if (!contentResult.success) {
      logger.warn(`Error reading test file: ${contentResult.error}`);
      return {
        success: false,
        error: contentResult.error,
        questions: []
      };
    }
    
    // Parse test content
    const parsedResult = parseTestContent(contentResult.content);
    
    if (!parsedResult.success) {
      logger.warn(`Error parsing test: ${parsedResult.error}`);
      return {
        success: false,
        error: parsedResult.error,
        questions: []
      };
    }
    
    // Check question correctness
    const validationResult = validateQuestions(parsedResult.questions);
    
    if (!validationResult.success) {
      logger.warn(`Error validating questions: ${validationResult.error}`);
      return {
        success: false,
        error: validationResult.error,
        questions: []
      };
    }
    
    logger.success(`Successfully got test questions: ${parsedResult.questions.length} questions`);
    return {
      success: true,
      questions: parsedResult.questions
    };
  } catch (error) {
    logger.error(`Error getting test questions: ${error.message}`, error);
    return {
      success: false,
      error: error.message,
      questions: []
    };
  }
}

/**
 * Gets background for test runner
 * @param {string} [folderPath] - Optional path to backgrounds folder
 * @returns {Promise<{success: boolean, path?: string, error?: string}>} - Background retrieval result
 */
export async function getTestRunnerBackground(folderPath) {
  try {
    logger.debug(`Getting background for test runner${folderPath ? ` from folder ${folderPath}` : ''}`);
    
    // Use existing function to get random background
    const result = await getRandomBackground(folderPath);
    
    if (!result.success) {
      logger.warn(`Error getting background: ${result.error}`);
    } else {
      logger.success(`Successfully got background: ${result.path}`);
    }
    
    return result;
  } catch (error) {
    logger.error(`Error getting background for test runner: ${error.message}`, error);
    return {
      success: false,
      error: error.message,
      path: null
    };
  }
}

/**
 * Checks test file correctness for running in test runner
 * @param {string} testPath - Full path to test file
 * @returns {Promise<{success: boolean, isValid: boolean, error?: string, questionsCount?: number}>} - Validation result
 */
export async function validateTestForRunner(testPath) {
  try {
    logger.debug(`Checking test for running: ${testPath}`);
    
    if (!testPath) {
      logger.warn('Test path not specified');
      return {
        success: false,
        isValid: false,
        error: 'Test path not specified'
      };
    }
    
    // Get questions from test for checking
    const questionsResult = await getTestQuestions(testPath);
    
    if (!questionsResult.success) {
      logger.warn(`Test failed check: ${questionsResult.error}`);
      return {
        success: true,
        isValid: false,
        error: questionsResult.error,
        questionsCount: 0
      };
    }
    
    // Check question count
    if (questionsResult.questions.length === 0) {
      logger.warn('Test contains no questions');
      return {
        success: true,
        isValid: false,
        error: 'Test contains no questions',
        questionsCount: 0
      };
    }
    
    logger.success(`Test passed check: ${questionsResult.questions.length} questions`);
    return {
      success: true,
      isValid: true,
      questionsCount: questionsResult.questions.length
    };
  } catch (error) {
    logger.error(`Error checking test for running: ${error.message}`, error);
    return {
      success: false,
      isValid: false,
      error: error.message,
      questionsCount: 0
    };
  }
}

// Export all module functions
export default {
  getTestQuestions,
  getTestRunnerBackground,
  validateTestForRunner
}; 