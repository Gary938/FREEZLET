// UI/UI/Components/TestTable/testTableMain.js
// Main component for initializing test table UI

import { initializeTestTableUI } from './TestTableUI.js';
import testTableController from '../../../Controllers/TestTable/index.js';
import { createLogger } from '../../../Utils/loggerService.js';
import { uiEventDispatcher } from '../../../Controllers/uiEventDispatcher.js';

// Create logger for module
const logger = createLogger('UI/TestTableMain');

/**
 * Initializes all test table components and links them together
 * @returns {Object} - Component public API
 */
export function initializeTestTable() {
  logger.info('Starting test table components initialization');

  try {
    // Check and activate mainView
    const mainView = document.getElementById('mainView');
    if (mainView) {
      mainView.style.display = 'block';
      logger.debug('Activated #mainView container for table display');
    } else {
      logger.error('Container #mainView not found');
    }

    // Create component instances
    logger.debug('Creating component instances');
    const testTableUI = initializeTestTableUI();

    // Render only table structure without data
    logger.debug('Initializing table');
    testTableUI.init();

    // Initialize components
    logger.debug('Rendering action buttons');
    testTableController.renderActionButtons();

    // Ensure table and container are visible (duplication for reliability)
    ensureVisibility();

    // Function to check visibility of all elements
    function ensureVisibility() {
      const mainView = document.getElementById('mainView');
      const table = document.getElementById('testsTable');

      if (mainView) {
        mainView.style.display = 'block';
        mainView.classList.remove('app-view'); // Remove class that might hide the view
      }

      if (table) {
        table.style.display = 'table';
        table.style.width = '100%';
      }

      logger.debug('Checked visibility of all containers and table');
    }

    // Method for updating table data
    async function refreshTableData(categoryPath = '') {
      try {
        logger.info(`Updating table data for category: ${categoryPath}`);

        // Load tests for specified category via controller
        await testTableController.loadTestsForCategory(categoryPath);

        // Ensure table is visible after data update
        ensureVisibility();

        logger.success('Test table data successfully updated');
      } catch (error) {
        logger.error(`Error updating table data: ${error.message}`, error);
      }
    }

    // Create public component interface
    const publicAPI = {
      refreshData: refreshTableData
    };

    // Initialize controller (now after creating public interface)
    logger.debug('Initializing test table controller');
    testTableController.init();

    // Dispatch UI initialized event to load data via controller
    logger.debug('Dispatching UI_INITIALIZED event');
    uiEventDispatcher.dispatch(uiEventDispatcher.events.UI_INITIALIZED, {
      timestamp: Date.now(),
      source: 'testTableMain'
    });

    logger.success('Test table components successfully initialized');

    // Return public interface
    return publicAPI;
  } catch (error) {
    logger.error('Error initializing test table components', error);
    return {
      refreshData: () => logger.error('Components not initialized, update impossible')
    };
  }
}
