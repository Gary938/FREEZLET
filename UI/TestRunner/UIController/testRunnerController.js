// UI/TestRunner/UIController/testRunnerController.js
// UI controller for test runner

import { createLogger } from '@UI/Utils/loggerService.js';
import { testRunnerBridge } from '../Bridge/testRunnerBridge.js';
import { uiEventDispatcher } from '@UI/Controllers/uiEventDispatcher.js';

// Create logger for module
const logger = createLogger('UI/TestRunner/UIController/testRunnerController');

/**
 * UI controller for test runner
 */
export const testRunnerController = {
  /**
   * Current test state
   * @private
   */
  _testState: {
    testPath: null,
    questions: [],
    currentQuestionIndex: 0,
    correctCount: 0,
    totalCount: 0,
    isRunning: false
  },
  
  /**
   * Initializes test state with new questions
   * @param {Array<Object>} questions - Array of test questions
   * @returns {{success: boolean, error?: string}} - Initialization result
   */
  initTestState(questions) {
    try {
      logger.debug(`Initializing test state with ${questions?.length || 0} questions`);
      
      if (!Array.isArray(questions) || questions.length === 0) {
        logger.warn('Empty questions array provided');
        return {
          success: false,
          error: 'Empty questions array provided'
        };
      }
      
      // Save test path before updating state
      const previousTestPath = this._testState.testPath;
      
      this._testState = {
        testPath: previousTestPath, // Keep test path
        questions: questions,
        currentQuestionIndex: 0,
        correctCount: 0,
        totalCount: questions.length,
        isRunning: true
      };
      
      logger.success(`Test state initialized: ${questions.length} questions, path: ${previousTestPath}`);
      return { success: true };
    } catch (error) {
      logger.error(`Error initializing test state: ${error.message}`, error);
      return {
        success: false,
        error: error.message
      };
    }
  },
  
  /**
   * Gets current test state
   * @returns {Object} - Current test state
   */
  getTestState() {
    return { ...this._testState };
  },
  
  /**
   * Updates correct answers counter
   * @param {boolean} isCorrect - Answer correctness
   */
  updateScore(isCorrect) {
    try {
      if (isCorrect) {
        this._testState.correctCount++;
        logger.debug(`Correct answers counter incremented: ${this._testState.correctCount}`);
      }
      
      this._testState.currentQuestionIndex++;
      logger.debug(`Current question index incremented: ${this._testState.currentQuestionIndex}`);
      
      // Check if test is completed
      if (this._testState.currentQuestionIndex >= this._testState.totalCount) {
        logger.info('Test completed');
        this._testState.isRunning = false;
        
        // Dispatch test completion event
        uiEventDispatcher.dispatch(uiEventDispatcher.events.TEST_RUNNER_COMPLETE, {
          correctCount: this._testState.correctCount,
          totalCount: this._testState.totalCount,
          testPath: this._testState.testPath,
          timestamp: Date.now()
        });
      }
    } catch (error) {
      logger.error(`Error updating score: ${error.message}`, error);
    }
  },
  
  /**
   * Resets test state
   * @param {boolean} preservePath - Preserve test path on reset
   */
  resetTestState(preservePath = true) {
    // Save current test path if required
    const currentTestPath = preservePath ? this._testState.testPath : null;
    
    this._testState = {
      testPath: currentTestPath, // Keep or reset path
      questions: [],
      currentQuestionIndex: 0,
      correctCount: 0,
      totalCount: 0,
      isRunning: false
    };
    
    logger.debug(`Test state reset${preservePath ? ', path preserved' : ''}`);
  },
  
  /**
   * Starts test runner with specified test
   * @param {string} testPath - Path to test for starting
   * @returns {Promise<{success: boolean, error?: string}>} - Start result
   */
  async startTestRunner(testPath) {
    try {
      logger.info(`Starting test runner for test: ${testPath}`);
      
      if (!testPath) {
        logger.warn('Test path not specified for starting');
        return {
          success: false,
          error: 'Test path not specified for starting'
        };
      }
      
      // First validate the test
      const validationResult = await testRunnerBridge.validateTest(testPath);
      
      if (!validationResult.success) {
        logger.warn(`Test validation error: ${validationResult.error}`);
        return {
          success: false,
          error: validationResult.error
        };
      }
      
      if (!validationResult.isValid) {
        logger.warn(`Test failed validation: ${validationResult.error}`);
        return {
          success: false,
          error: validationResult.error || 'Test failed validation'
        };
      }
      
      logger.debug(`Test passed validation, questions count: ${validationResult.questionsCount}`);
      
      // Get test questions
      const questionsResult = await testRunnerBridge.getQuestions(testPath);
      
      if (!questionsResult.success) {
        logger.warn(`Error getting questions: ${questionsResult.error}`);
        return {
          success: false,
          error: questionsResult.error
        };
      }
      
      logger.debug(`Got test questions: ${questionsResult.questions.length}`);
      
      // Initialize test state with received questions
      this._testState.testPath = testPath;
      const initResult = this.initTestState(questionsResult.questions);
      
      if (!initResult.success) {
        logger.warn(`Error initializing test state: ${initResult.error}`);
        return {
          success: false,
          error: initResult.error
        };
      }
      
      // Notify about test runner start via UI Bridge
      const startResult = await testRunnerBridge.startTest(testPath);
      
      if (!startResult.success) {
        logger.warn(`Error starting test: ${startResult.error}`);
        return {
          success: false,
          error: startResult.error
        };
      }
      
      // Activate test runner UI
      await this._startTestRunnerUI();
      
      logger.success(`Test runner successfully started for test: ${testPath}`);
      return { success: true };
    } catch (error) {
      logger.error(`Error starting test runner: ${error.message}`, error);
      return {
        success: false,
        error: error.message
      };
    }
  },
  
  /**
   * Starts test runner UI
   * @private
   */
  async _startTestRunnerUI() {
    try {
      logger.debug('Activating test runner UI');
      
      // Add class to switch to test mode
      document.body.classList.add('test-mode');
      
      // Hide all main UI components
      const mainContent = document.getElementById('mainContent');
      if (mainContent) mainContent.style.display = 'none';
      
      // Hide side panel
      const sidePanel = document.querySelector('.side-panel');
      if (sidePanel) sidePanel.style.display = 'none';
      
      // Hide all other visible elements
      const appContainer = document.querySelector('.app-container');
      if (appContainer) appContainer.style.display = 'none';
      
      // Hide all top-level elements except console
      const topLevelElements = document.body.children;
      for (let i = 0; i < topLevelElements.length; i++) {
        const element = topLevelElements[i];
        if (element.id !== 'testRunnerOuterArea' && !element.classList.contains('console-wrapper')) {
          element.style.display = 'none';
        }
      }
      
      // Dynamically import test runner module
      const { renderTestRunnerView } = await import('@UI/TestRunner/testRunner.js');
      
      // Start rendering
      renderTestRunnerView();
      
      logger.info('Test runner successfully started');
    } catch (error) {
      logger.error(`Error starting test runner UI: ${error.message}`, error);
      throw error;
    }
  },
  
  /**
   * Closes test runner and returns to main interface
   * @param {boolean} preservePath - Preserve test path on close
   */
  closeTestRunner(preservePath = true) {
    try {
      logger.info('Closing test runner...');
      
      // Remove test runner DOM elements
      const outerArea = document.getElementById('testRunnerOuterArea');
      if (outerArea) outerArea.remove();
      
      // Remove test mode class
      document.body.classList.remove('test-mode');
      
      // Restore all hidden elements
      
      // Restore main UI
      const mainContent = document.getElementById('mainContent');
      if (mainContent) mainContent.style.display = 'block';
      
      // Restore side panel
      const sidePanel = document.querySelector('.side-panel');
      if (sidePanel) sidePanel.style.display = 'block';
      
      // Restore app container
      const appContainer = document.querySelector('.app-container');
      if (appContainer) appContainer.style.display = 'block';
      
      // Restore all top-level elements
      const topLevelElements = document.body.children;
      for (let i = 0; i < topLevelElements.length; i++) {
        const element = topLevelElements[i];
        if (element.id !== 'testRunnerOuterArea' && !element.classList.contains('console-wrapper')) {
          element.style.display = '';
        }
      }
      
      // Reset test state with or without path preservation
      this.resetTestState(preservePath);
      
      logger.success('Test runner successfully closed');
      return { success: true };
    } catch (error) {
      logger.error(`Error closing test runner: ${error.message}`, error);
      
      // In case of error, try to force close
      try {
        const outerArea = document.getElementById('testRunnerOuterArea');
        if (outerArea) outerArea.remove();
        
        document.body.classList.remove('test-mode');
        
        // Restore all elements
        const topLevelElements = document.body.children;
        for (let i = 0; i < topLevelElements.length; i++) {
          topLevelElements[i].style.display = '';
        }
        
        // Reset state even in case of error
        this.resetTestState(preservePath);
      } catch (e) {
        logger.error(`Critical error closing test runner: ${e.message}`, e);
      }
      
      return { success: false, error: error.message };
    }
  }
}; 