// UI/Controllers/TestTable/testTableViewController.js
// Controller for rendering test table and updating UI

import { createLogger } from '../../Utils/loggerService.js';
import { t } from '../../i18n/index.js';
import { setupTestMenuIconHandler, setupTestContextMenuHandler } from './testContextMenuController.js';

// Create logger for module
const logger = createLogger('UI/Controller/TestTable/View');

// Constants
const TABLE_COLUMNS = 7; // Added menu column

/**
 * Test table view controller
 * Responsible for displaying data in table and managing UI
 */
export class TestTableViewController {
  constructor() {
    logger.debug('Creating test table view controller instance');
  }

  /**
   * Shows loading indicator
   */
  showLoading() {
    const table = document.getElementById('testsTable');
    if (!table) return;

    const tbody = table.querySelector('tbody');
    if (!tbody) return;

    // Clear current content
    tbody.innerHTML = '';

    // Create row with loading indicator
    const row = document.createElement('tr');
    const cell = document.createElement('td');
    cell.colSpan = TABLE_COLUMNS;
    cell.textContent = t('table.loading');
    cell.className = 'table-loading-cell';

    row.appendChild(cell);
    tbody.appendChild(row);

    logger.debug('Loading indicator shown');
  }

  /**
   * Hides loading indicator
   */
  hideLoading() {
    // Nothing to do, indicator will be replaced by table content
    logger.debug('Loading indicator hidden');
  }

  /**
   * Renders tests in table
   * @param {Array} tests - List of tests to display
   */
  renderTestsInTable(tests) {
    logger.debug(`Rendering ${tests.length} tests in table`);

    const table = document.getElementById('testsTable');
    if (!table) {
      logger.error('Tests table not found in DOM (#testsTable)');
      return;
    }

    const tbody = table.querySelector('tbody');
    if (!tbody) {
      logger.error('Tests table body not found');
      return;
    }

    // Clear current content
    tbody.innerHTML = '';

    if (tests.length === 0) {
      // If no tests, show message
      const row = document.createElement('tr');
      const cell = document.createElement('td');
      cell.colSpan = TABLE_COLUMNS;
      cell.textContent = t('test.empty');
      cell.className = 'table-message-cell';

      row.appendChild(cell);
      tbody.appendChild(row);

      logger.info('Empty table message displayed');
      return;
    }

    // Function to get stars HTML (maximum 3 stars)
    const getStarsHTML = (stars) => {
      const maxStars = 3;
      const count = Math.min(parseInt(stars) || 0, maxStars);
      return '★'.repeat(count) + '☆'.repeat(maxStars - count);
    };

    // Render tests
    tests.forEach(test => {
      const row = document.createElement('tr');

      // Add data attribute with test path
      row.setAttribute('data-test-path', test.path);

      // Use test name as is, without removing extension
      const displayName = test.name || 'unnamed_test';

      // Create cells safely via DOM API (XSS protection)
      const checkboxCell = document.createElement('td');
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.setAttribute('data-test-id', test.id);
      checkboxCell.appendChild(checkbox);

      const nameCell = document.createElement('td');
      nameCell.className = 'test-name-cell';

      // Create name container with text and menu icon
      const nameContainer = document.createElement('div');
      nameContainer.className = 'test-name-container';

      const nameText = document.createElement('span');
      nameText.className = 'test-name-text';
      nameText.textContent = displayName;

      const menuIcon = document.createElement('span');
      menuIcon.className = 'test-menu-icon';
      menuIcon.textContent = '⚙️';
      menuIcon.title = t('contextMenu.menu') || 'Menu';

      nameContainer.appendChild(nameText);
      nameContainer.appendChild(menuIcon);
      nameCell.appendChild(nameContainer);

      // Setup menu icon click handler
      setupTestMenuIconHandler(menuIcon, test.path);

      const starsCell = document.createElement('td');
      starsCell.className = 'stars-cell';
      starsCell.textContent = getStarsHTML(test.stars || 0);

      const percentCell = document.createElement('td');
      const percentage = test.percentage || 0;
      percentCell.textContent = `${percentage}%`;
      // Percentage color coding
      if (percentage > 80) {
        percentCell.className = 'percent-high';
      } else if (percentage >= 50) {
        percentCell.className = 'percent-medium';
      } else {
        percentCell.className = 'percent-low';
      }

      const questionsCell = document.createElement('td');
      questionsCell.textContent = test.questions || 0;

      const attemptsCell = document.createElement('td');
      attemptsCell.textContent = test.attempts || 0;

      const pathCell = document.createElement('td');
      pathCell.setAttribute('data-test-path', test.path);
      pathCell.style.display = 'none';
      pathCell.textContent = test.path;

      row.appendChild(checkboxCell);
      row.appendChild(nameCell);
      row.appendChild(starsCell);
      row.appendChild(percentCell);
      row.appendChild(questionsCell);
      row.appendChild(attemptsCell);
      row.appendChild(pathCell);

      // Add class for appearance animation
      row.classList.add('row-appear');

      // Setup right-click context menu handler
      setupTestContextMenuHandler(row, test.path);

      tbody.appendChild(row);
    });

    logger.success(`Rendered ${tests.length} tests in table`);
  }
}

// Export controller instance
export default new TestTableViewController(); 