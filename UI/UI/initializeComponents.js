// UI/UI/initializeComponents.js
// User interface component initialization

import { initializeTestTable } from './Components/TestTable/testTableMain.js';
import { createLogger } from '@UI/Utils/loggerService.js';
import { uiEventDispatcher } from '@UI/Controllers/uiEventDispatcher.js';
import { testRunnerController } from '@UI/TestRunner/UIController/testRunnerController.js';

// Create logger for module
const logger = createLogger('UI/initializeComponents');

/**
 * Initializes test runner event subscriptions
 */
function initializeTestRunnerListeners() {
  logger.debug('Initializing test runner event handlers');
  
  // Subscribe to test runner start event
  uiEventDispatcher.subscribe(
    uiEventDispatcher.events.TEST_RUNNER_START,
    async (event) => {
      try {
        logger.info('Test runner start event received');
        const testPath = event.detail.testPath;
        
        // Start test runner via controller
        const result = await testRunnerController.startTestRunner(testPath);
        
        if (!result.success) {
          logger.error(`Test runner start error: ${result.error}`);
          alert(`Failed to start test: ${result.error}`);
        }
      } catch (error) {
        logger.error('Error handling test runner start event', error);
        alert(`Error starting test: ${error.message}`);
      }
    }
  );
  
  // Subscribe to test runner close event
  uiEventDispatcher.subscribe(
    uiEventDispatcher.events.TEST_RUNNER_CLOSE,
    () => {
      logger.info('Test runner close event received');
      
      // Call controller to close test runner
      try {
        // Add small delay before calling close
        setTimeout(() => {
          testRunnerController.closeTestRunner();
        }, 20);
      } catch (error) {
        logger.error(`Error closing test runner via controller: ${error.message}`, error);
      }
      
      // Additional logic can be added here,
      // for example, update test table
    }
  );
  
  // Subscribe to test completion event
  uiEventDispatcher.subscribe(
    uiEventDispatcher.events.TEST_RUNNER_COMPLETE,
    (event) => {
      logger.info('Test runner completion event received');
      const { correctCount, totalCount, testPath } = event.detail;
      
      logger.debug(`Test results: ${correctCount}/${totalCount} correct answers`);
    }
  );
  
  logger.success('Test runner event handlers initialized');
}

/**
 * Initializes all application UI components
 */
export function initializeUI() {
  logger.info('Starting UI component initialization');
  
  try {
    // Initialize test table
    logger.debug('Initializing test table components');
    const testTable = initializeTestTable();
    
    // Update table data (empty stubs)
    logger.debug('Updating test table data (stub)');
    testTable.refreshData();
    
    // Initialize test runner event listeners
    initializeTestRunnerListeners();
    
    logger.success('UI components successfully initialized');
    return true;
  } catch (error) {
    logger.error(`UI initialization error: ${error.message}`, error);
    return false;
  }
} 