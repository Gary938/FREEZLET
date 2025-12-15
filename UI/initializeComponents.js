// UI/initializeComponents.js
// Initialize components and event handlers

import { createLogger } from '@UI/Utils/loggerService.js';
import { uiEventDispatcher } from '@UI/Controllers/uiEventDispatcher.js';
import { testRunnerController } from '@UI/TestRunner/UIController/testRunnerController.js';

// Create logger for module
const logger = createLogger('UI/initializeComponents');

// Subscribe to test runner start event
uiEventDispatcher.subscribe(
  uiEventDispatcher.events.TEST_RUNNER_START,
  async (event) => {
    try {
      logger.info('Test runner start event received');
      const testPath = event.detail.testPath;
      const isRestart = event.detail.restart === true;
      
      if (!testPath) {
        logger.error('Test path not specified for launch');
        alert('Failed to start test: test path not specified');
        return;
      }
      
      logger.debug(`Starting test: ${testPath}, restart: ${isRestart}`);
      
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
    
    // Additional logic can be added here, 
    // for example update main interface after closing test runner
    try {
      // Call close method in controller
      try {
        setTimeout(() => {
          testRunnerController.closeTestRunner();
        }, 20);
      } catch (controllerError) {
        logger.error('Controller error when closing test runner', controllerError);
      }
      
      // Check if test runner elements remain
      const outerArea = document.getElementById('outerArea');
      if (outerArea) {
        logger.debug('Removing remaining test runner elements');
        outerArea.remove();
      }
      
      // Remove test mode classes
      document.body.classList.remove('showing-result', 'test-mode');
      
      // Restore main content visibility
      const mainContent = document.getElementById('mainContent');
      if (mainContent) {
        mainContent.style.display = 'block';
      }
    } catch (error) {
      logger.error('Error handling test runner close event', error);
    }
  }
); 