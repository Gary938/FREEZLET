// Main/BusinessLayer/TestRunner/testParserService.js
// Service for parsing test content

import { mainLogger } from '../../loggerHub.js';

// Logger for module
const logger = {
  info: (message) => mainLogger.info('BusinessLayer:TestRunner:testParserService', message),
  warn: (message) => mainLogger.warn('BusinessLayer:TestRunner:testParserService', message),
  error: (message, data) => mainLogger.error('BusinessLayer:TestRunner:testParserService', message, data),
  debug: (message) => mainLogger.debug('BusinessLayer:TestRunner:testParserService', message),
  success: (message) => mainLogger.success('BusinessLayer:TestRunner:testParserService', message)
};

/**
 * Parses test content into question structure
 * @param {string} content - Test content
 * @returns {{success: boolean, questions?: Array<Object>, error?: string}} - Parsing result
 */
export function parseTestContent(content) {
  try {
    logger.debug(`Started parsing test content (${content?.length || 0} bytes)`);
    
    if (!content) {
      logger.warn('Empty test content passed');
      return {
        success: false,
        error: 'Empty test content passed',
        questions: []
      };
    }
    
    const questions = [];
    let currentQuestion = '';
    let options = [];
    let correctAnswer = -1;

    content.split('\n').forEach(line => {
      line = line.trim();

      if (!line) {
        if (currentQuestion && options.length > 0) {
          questions.push({
            question: currentQuestion,
            options: options,
            correctAnswer: correctAnswer !== -1 ? correctAnswer : 0
          });
          currentQuestion = '';
          options = [];
          correctAnswer = -1;
        }
        return;
      }

      if (line.includes('?') || !currentQuestion) {
        currentQuestion = line;
      } else {
        if (line.startsWith('*')) {
          correctAnswer = options.length;
          options.push(line.slice(1).trim());
        } else {
          // Ignore lines with examples (Example:)
          if (line.startsWith('Example:') || line.startsWith('example:')) {
            return;
          }
          options.push(line);
        }
      }
    });

    if (currentQuestion && options.length > 0) {
      questions.push({
        question: currentQuestion,
        options: options,
        correctAnswer: correctAnswer !== -1 ? correctAnswer : 0
      });
    }

    logger.success(`Parsing completed, found ${questions.length} questions`);
    return {
      success: true,
      questions
    };
  } catch (error) {
    logger.error(`Error parsing test content: ${error.message}`, error);
    return {
      success: false,
      error: error.message,
      questions: []
    };
  }
}

/**
 * Reuse function from business layer for question counting
 * @param {string} content - Test content
 * @returns {number} - Question count
 */
export function countQuestionsInContent(content) {
  try {
    logger.debug(`Counting questions in test content (${content?.length || 0} bytes)`);
    
    if (!content) {
      logger.warn('Empty test content passed');
      return 0;
    }
    
    const result = parseTestContent(content);
    return result.success ? result.questions.length : 0;
  } catch (error) {
    logger.error(`Error counting questions: ${error.message}`, error);
    return 0;
  }
}

/**
 * Checks question format after parsing for correctness
 * @param {Array<Object>} questions - Array of questions
 * @returns {{success: boolean, error?: string}} - Check result
 */
export function validateQuestions(questions) {
  try {
    logger.debug(`Checking correctness of ${questions?.length || 0} questions`);
    
    if (!Array.isArray(questions) || questions.length === 0) {
      logger.warn('Empty questions array');
      return {
        success: false,
        error: 'Empty questions array'
      };
    }
    
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      
      if (!q.question || q.question.trim() === '') {
        logger.warn(`Question #${i+1} has no text`);
        return {
          success: false,
          error: `Question #${i+1} has no text`
        };
      }
      
      if (!Array.isArray(q.options) || q.options.length < 2) {
        logger.warn(`Question "${q.question}" has less than 2 answer options`);
        return {
          success: false,
          error: `Question "${q.question}" has less than 2 answer options`
        };
      }
      
      if (q.correctAnswer === undefined || q.correctAnswer < 0 || q.correctAnswer >= q.options.length) {
        logger.warn(`Question "${q.question}" has incorrect correct answer index`);
        return {
          success: false,
          error: `Question "${q.question}" has incorrect correct answer index`
        };
      }
    }
    
    logger.success(`Check successful, all ${questions.length} questions are correct`);
    return { success: true };
  } catch (error) {
    logger.error(`Error checking questions: ${error.message}`, error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Export all module functions
export default {
  parseTestContent,
  countQuestionsInContent,
  validateQuestions
}; 