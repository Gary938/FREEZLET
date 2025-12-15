// UI/Controllers/TestTable/testTableSelectionController.js
// Controller for managing test selection and button states

import { createLogger } from '../../Utils/loggerService.js';

// Create logger for module
const logger = createLogger('UI/Controller/TestTable/Selection');

/**
 * Test selection and button state management controller
 */
export class TestTableSelectionController {
  constructor() {
    logger.debug('Creating test selection controller instance');

    // Button references are lazily initialized
    this._actionButtons = null;
  }

  /**
   * Lazy getter for action buttons
   * @returns {Object} - Object with buttons
   */
  get actionButtons() {
    if (!this._actionButtons) {
      this._actionButtons = this.findButtons();
    }
    return this._actionButtons;
  }

  /**
   * Finds buttons in DOM
   * @returns {Object} - Object with buttons
   */
  findButtons() {
    logger.debug('Finding buttons in DOM');

    return {
      loadBtn: document.getElementById('loadBtn'),
      deleteTest: document.getElementById('deleteTest'),
      mergeTests: document.getElementById('mergeTests'),
      startTest: document.getElementById('startTest'),
      learningBtn: document.getElementById('learningBtn'),
      writeModeBtn: document.getElementById('writeModeBtn')
    };
  }

  /**
   * Updates button references (resets cache)
   */
  updateButtonReferences() {
    logger.debug('Updating button references');
    this._actionButtons = null; // Reset cache, next getter call will update
    logger.debug('Button references updated');
  }

  /**
   * Renders action buttons panel
   */
  renderActionButtons() {
    logger.debug('Checking action buttons panel');

    // Check for container
    const container = document.querySelector('.action-buttons');
    if (!container) {
      logger.error('Button container not found, cannot update buttons');
      return;
    }

    // Check for buttons
    const buttons = container.querySelectorAll('button');
    if (buttons.length === 0) {
      logger.warn('No buttons in .action-buttons container');
      return;
    }

    logger.info(`Found ${buttons.length} buttons in container`);

    // Update button references
    this.updateButtonReferences();

    // Update button states based on current selection
    this.updateButtonStates();

    logger.success('Button references updated');
  }

  /**
   * Updates button states based on number of selected tests
   */
  updateButtonStates() {
    try {
      // Find selected checkboxes
      const checkboxes = document.querySelectorAll('input[type="checkbox"][data-test-id]:checked');
      const selectedCount = checkboxes.length;
      const hasSelection = selectedCount > 0;

      logger.debug(`Updating button states (selected tests: ${selectedCount})`);

      // Load tests button is always active
      if (this.actionButtons.loadBtn) {
        this.actionButtons.loadBtn.disabled = false;
      }

      // Delete tests button is active if at least one test is selected
      if (this.actionButtons.deleteTest) {
        this.actionButtons.deleteTest.disabled = !hasSelection;
      }

      // Merge tests button is active if 2 or more tests are selected
      if (this.actionButtons.mergeTests) {
        this.actionButtons.mergeTests.disabled = selectedCount < 2;
      }

      // Start Test and Learning Mode buttons are active only if exactly 1 test is selected
      if (this.actionButtons.startTest) {
        this.actionButtons.startTest.disabled = selectedCount !== 1;
      }

      if (this.actionButtons.learningBtn) {
        this.actionButtons.learningBtn.disabled = selectedCount !== 1;

        // Add/remove "pick-me" class for attention animation
        if (selectedCount === 1) {
          this.actionButtons.learningBtn.classList.add('pick-me');
        } else {
          this.actionButtons.learningBtn.classList.remove('pick-me');
        }
      }

      // Write Mode is active only if exactly 1 test is selected (like Learning Mode)
      if (this.actionButtons.writeModeBtn) {
        this.actionButtons.writeModeBtn.disabled = selectedCount !== 1;

        // Add/remove "write-me" class for blinking cursor animation
        if (selectedCount === 1) {
          this.actionButtons.writeModeBtn.classList.add('write-me');
        } else {
          this.actionButtons.writeModeBtn.classList.remove('write-me');
        }
      }

      logger.debug('Button states updated');
    } catch (error) {
      logger.error('Error updating button states:', error);
    }
  }

  /**
   * Gets list of selected tests
   * @returns {Array<string>} - Array of paths to selected tests
   */
  getSelectedTests() {
    const checkboxes = document.querySelectorAll('input[type="checkbox"][data-test-id]:checked');
    return Array.from(checkboxes).map(checkbox => {
      const row = checkbox.closest('tr');
      const testPathCell = row.querySelector('td[data-test-path]');
      return testPathCell ? testPathCell.getAttribute('data-test-path') : null;
    }).filter(path => path !== null);
  }
}

// Export controller instance
export default new TestTableSelectionController(); 