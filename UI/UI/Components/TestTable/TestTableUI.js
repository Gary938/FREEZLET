// UI/UI/Components/TestTable/TestTableUI.js
// Component for displaying test table without functionality

import { createLogger } from '@UI/Utils/loggerService.js';
import { t } from '@UI/i18n/index.js';

// Create logger for module
const logger = createLogger('UI/TestTable');

// Constants
const TABLE_COLUMNS = 6;

/**
 * Initializes test table in UI without functionality
 * @returns {Object} - Component interface
 */
export function initializeTestTableUI() {
  logger.debug('Initializing test table component');

  /**
   * Checks if table exists in DOM
   * @returns {boolean} - Check result
   */
  function checkTableExists() {
    const table = document.getElementById('testsTable');
    const tbody = table ? table.querySelector('tbody') : null;

    if (!table) {
      logger.error('Table #testsTable not found in DOM');
      return false;
    }

    if (!tbody) {
      logger.error('Table body tbody not found in #testsTable');
      return false;
    }

    logger.debug('Table #testsTable found');
    return true;
  }

  /**
   * Renders message that data is not loaded
   */
  function renderEmptyMessage() {
    const tbody = document.querySelector('#testsTable tbody');
    if (!tbody) {
      logger.error('Tests table tbody element not found');
      return;
    }

    logger.info('Rendering empty table without data');

    tbody.innerHTML = '';

    // Create one row with message
    const row = document.createElement('tr');
    const messageCell = document.createElement('td');
    messageCell.colSpan = TABLE_COLUMNS;
    messageCell.textContent = t('table.noData');
    messageCell.className = 'table-message-cell';
    row.appendChild(messageCell);
    tbody.appendChild(row);

    logger.debug('Empty table message displayed');
  }

  // Public interface
  return {
    init: () => {
      try {
        logger.info('Initializing test table component');

        // Check if table exists
        if (!checkTableExists()) {
          logger.error('Table structure missing from DOM');
          return;
        }

        // Display message about missing data
        renderEmptyMessage();

        logger.success('Test table component successfully initialized');
      } catch (error) {
        logger.error('Error initializing test table component', error);
      }
    }
  };
}
