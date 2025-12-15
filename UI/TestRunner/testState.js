// UI/TestRunner/testState.js
// Test state storage for test runner

import { createLogger } from '@UI/Utils/loggerService.js';
import { testRunnerController } from './UIController/testRunnerController.js';

// Create logger for module
const logger = createLogger('UI/TestRunner/testState');

/**
 * Gets current test state from controller
 * @returns {Object} - Current test state
 */
export function getTestState() {
  logger.debug('Current test state requested');
  return testRunnerController.getTestState();
}

/**
 * Updates correct answers counter
 * @param {boolean} isCorrect - Answer correctness
 */
export function updateScore(isCorrect) {
  logger.debug(`Updating score, answer ${isCorrect ? 'correct' : 'incorrect'}`);
  return testRunnerController.updateScore(isCorrect);
}

/**
 * Closes test runner
 */
export function closeTestRunner() {
  logger.debug('Test runner close requested');
  
  // Add error handling
  try {
    // Call closeTestRunner from controller
    const result = testRunnerController.closeTestRunner();
    
    // Additionally ensure interface returned to initial state
    document.body.classList.remove("showing-result", "test-mode");
    
    // Remove test runner outer area if it exists
    const outerArea = document.getElementById('testRunnerOuterArea');
    if (outerArea) {
      outerArea.remove();
    }
    
    // Restore visibility of all top-level elements
    const topLevelElements = document.body.children;
    for (let i = 0; i < topLevelElements.length; i++) {
      const element = topLevelElements[i];
      if (element.id !== 'testRunnerOuterArea' && !element.classList.contains('console-wrapper')) {
        element.style.display = '';
      }
    }
    
    return result;
  } catch (error) {
    logger.error(`Error closing test runner: ${error.message}`, error);
    
    // In case of error, try to perform critical actions directly
    document.body.classList.remove("showing-result", "test-mode");
    const outerArea = document.getElementById('testRunnerOuterArea');
    if (outerArea) {
      outerArea.remove();
    }
    
    return { success: false, error: error.message };
  }
} 