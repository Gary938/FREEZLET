// UI/Controllers/TestTable/testTableController.js
// Controller for test table (UI layer only without functionality)

import { createLogger } from '../../Utils/loggerService.js';
import { TestMergeController } from './testMergeController.js';
import testTableViewController from './testTableViewController.js';
import testTableSelectionController from './testTableSelectionController.js';
import testTableActionController from './testTableActionController.js';
import testTableEventController from './testTableEventController.js';
import { uiEventDispatcher } from '../uiEventDispatcher.js';
import { createHybridFacade } from '../../LearnMode/Facade/index.js';
import { showWriteModeSelector } from '../../LearnMode/Components/WriteModeSelector/index.js';
import { ModalController } from '../Modal/modalController.js';

// Create logger for module
const logger = createLogger('UI/Controller/TestTable');

// Constants
const UI_RESTORE_DELAY_MS = 50;

/**
 * UI controller for test table
 * Implements only UI logic without functionality
 */
export class TestTableController {
  constructor() {
    logger.debug('Creating test table controller instance');

    // Initialization flag
    this._initialized = false;

    logger.info('Test table controller created');
  }

  /**
   * Controller initialization
   * Called after all components are configured
   */
  init() {
    // Check if controller was already initialized
    if (this._initialized) {
      logger.debug('Test table controller was already initialized');
      return;
    }

    logger.debug('Initializing test table controller');

    // Step 1: Create test merge controller
    try {
      logger.info('Initializing test merge controller');
      this.mergeController = new TestMergeController();
      this.mergeController.init();
      logger.success('Test merge controller successfully initialized');
    } catch (error) {
      logger.error('Error initializing test merge controller:', error);
    }

    // Step 2: Set up event handlers
    testTableEventController.setupBaseEventListeners();
    testTableEventController.setupInitEventListener();

    // Step 3: Initialize buttons
    this.initializeButtons();

    // Mark controller as initialized
    this._initialized = true;

    logger.success('Test table controller successfully initialized');
  }

  /**
   * Initializes button states
   */
  initializeButtons() {
    logger.debug('Initializing button states');

    try {
      // Get current button references
      testTableSelectionController.updateButtonReferences();

      // Initialize test load button
      const loadBtn = document.getElementById('loadBtn');
      if (loadBtn) {
        loadBtn.addEventListener('click', testTableActionController.handleLoadTestClick.bind(testTableActionController));
        logger.debug('Added handler for test load button');
      } else {
        logger.warn('Test load button not found in DOM');
      }

      // Initialize create test button
      const createTestBtn = document.getElementById('createTestBtn');
      if (createTestBtn) {
        createTestBtn.addEventListener('click', testTableActionController.handleCreateTestClick.bind(testTableActionController));
        logger.debug('Added handler for create test button');
      } else {
        logger.warn('Create test button not found in DOM');
      }

      // Initialize test start button
      const startTestBtn = document.getElementById('startTest');
      if (startTestBtn) {
        startTestBtn.addEventListener('click', testTableActionController.handleStartTestClick.bind(testTableActionController));
        logger.debug('Added handler for test start button');
      } else {
        logger.warn('Test start button not found in DOM');
      }

      // Initialize learning mode button
      const learningBtn = document.getElementById('learningBtn');
      if (learningBtn) {
        learningBtn.addEventListener('click', this.handleLearningModeClick.bind(this));
        logger.debug('Added handler for learning mode button');
      } else {
        logger.warn('Learning mode button not found in DOM');
      }

      // Initialize Write Mode button
      const writeModeBtn = document.getElementById('writeModeBtn');
      if (writeModeBtn) {
        writeModeBtn.addEventListener('click', this.handleWriteModeClick.bind(this));
        logger.debug('Added handler for Write Mode button');
      } else {
        logger.warn('Write Mode button not found in DOM');
      }

      // Initialize test delete button
      const deleteBtn = document.getElementById('deleteTest');
      if (deleteBtn) {
        deleteBtn.addEventListener('click', testTableActionController.handleDeleteTests.bind(testTableActionController));
        logger.debug('Added handler for test delete button');
      } else {
        logger.warn('Test delete button not found in DOM');
      }

      // Initialize test merge button
      const mergeBtn = document.getElementById('mergeTests');
      if (mergeBtn && this.mergeController) {
        mergeBtn.addEventListener('click', this.mergeController.handleMergeButtonClick.bind(this.mergeController));
        logger.debug('Added handler for test merge button');
      } else {
        logger.warn('Test merge button not found in DOM or merge controller missing');
      }

      // Update button states
      testTableSelectionController.updateButtonStates();

      logger.info('Button states initialized');
    } catch (error) {
      logger.error('Error initializing buttons:', error);
    }
  }

  /**
   * Learning mode button click handler
   * @param {Event} event - Click event
   */
  async handleLearningModeClick(event) {
    try {
      logger.info('Learning mode button clicked');

      // Get selected tests
      const selectedTests = testTableSelectionController.getSelectedTests();

      if (!selectedTests || selectedTests.length === 0) {
        logger.warn('No tests selected for learning mode');
        ModalController.showNotification('Attention', 'Please select a test to start learning mode');
        return;
      }

      if (selectedTests.length > 1) {
        logger.warn('More than one test selected for learning mode');
        ModalController.showNotification('Attention', 'Please select only one test to start learning mode');
        return;
      }

      const testPath = selectedTests[0];
      logger.debug(`Starting learning mode for test: ${testPath}`);

      try {
        logger.info('Creating Hybrid Facade...');
        const facade = createHybridFacade();
        logger.info('Hybrid Facade created successfully');

        const success = await facade.startLearnMode(
          testPath,
          this._hideMainInterface.bind(this),  // callback for hiding interface
          this._showMainInterface.bind(this)   // callback for restoring interface
        );

        logger.info(`startLearnMode result: ${success}`);

        if (!success) {
          logger.error('Learning module startup error');
          ModalController.showError('Error', 'Failed to start learning mode');
        }
      } catch (createError) {
        logger.error(`Hybrid Facade creation error: ${createError.message}`, createError);

        ModalController.showError('Integration Error', `New architecture integration error: ${createError.message}`);

        // Restore UI on error
        this._showMainInterface();
      }
    } catch (error) {
      logger.error(`Error starting learning mode: ${error.message}`, error);
      ModalController.showError('Error', `An error occurred: ${error.message}`);
    }
  }

  /**
   * Write Mode button click handler
   * @param {Event} event - Click event
   */
  async handleWriteModeClick(event) {
    try {
      logger.info('Write Mode button clicked');

      // Get selected tests
      const selectedTests = testTableSelectionController.getSelectedTests();

      if (!selectedTests || selectedTests.length === 0) {
        logger.warn('No tests selected for Write Mode');
        ModalController.showNotification('Attention', 'Please select a test to start Write Mode');
        return;
      }

      if (selectedTests.length > 1) {
        logger.warn('More than one test selected for Write Mode');
        ModalController.showNotification('Attention', 'Please select only one test to start Write Mode');
        return;
      }

      const testPath = selectedTests[0];
      logger.debug(`Starting Write Mode for test: ${testPath}`);

      // Show submode selection modal
      const { showHints, cancelled } = await showWriteModeSelector();

      if (cancelled) {
        logger.info('Write Mode selection cancelled by user');
        return;
      }

      logger.info(`Write Mode selected: showHints=${showHints}`);

      try {
        logger.info('Creating Hybrid Facade for Write Mode...');
        const facade = createHybridFacade();
        logger.info('Hybrid Facade created successfully');

        const success = await facade.startLearnMode(
          testPath,
          this._hideMainInterface.bind(this),
          this._showMainInterface.bind(this),
          { mode: 'write', showHints }  // Pass options for Write Mode
        );

        logger.info(`startLearnMode (Write Mode) result: ${success}`);

        if (!success) {
          logger.error('Write Mode startup error');
          ModalController.showError('Error', 'Failed to start Write Mode');
        }
      } catch (createError) {
        logger.error(`Hybrid Facade creation error: ${createError.message}`, createError);
        ModalController.showError('Integration Error', `Integration error: ${createError.message}`);
        this._showMainInterface();
      }
    } catch (error) {
      logger.error(`Error starting Write Mode: ${error.message}`, error);
      ModalController.showError('Error', `An error occurred: ${error.message}`);
    }
  }

  /**
   * Hides main interface
   * @private
   */
  _hideMainInterface() {
    logger.debug('Hiding main interface (from test table controller)');

    const mainContent = document.getElementById('mainContent');
    const mainView = document.getElementById('mainView');
    const appWrapper = document.getElementById('appWrapper');

    if (mainContent) mainContent.style.display = 'none';
    if (mainView) mainView.style.display = 'none';
    if (appWrapper) appWrapper.style.display = 'none';
  }

  /**
   * Restores main interface and updates table data
   * @private
   */
  _showMainInterface() {
    logger.debug('Restoring main interface (from test table controller)');

    // Restore interface visibility
    const mainContent = document.getElementById('mainContent');
    const mainView = document.getElementById('mainView');
    const appWrapper = document.getElementById('appWrapper');

    if (mainContent) mainContent.style.display = 'block';
    if (mainView) mainView.style.display = 'block';
    if (appWrapper) appWrapper.style.display = 'flex';

    // Update test table after closing learning mode
    try {
      const currentCategory = testTableActionController.getCurrentCategory();
      logger.info(`Updating test table after closing learning mode, category: ${currentCategory}`);

      // Use setTimeout to update after interface fully restored
      setTimeout(async () => {
        await testTableActionController.loadTestsForCategory(currentCategory);
      }, UI_RESTORE_DELAY_MS);
    } catch (error) {
      logger.error(`Error updating test table: ${error.message}`, error);
    }
  }

  /**
   * Renders action buttons panel
   * Method for backward compatibility
   */
  renderActionButtons() {
    testTableSelectionController.renderActionButtons();
  }

  /**
   * Loads tests for specified category
   * Method for backward compatibility
   * @param {string} categoryPath - Path to category
   */
  async loadTestsForCategory(categoryPath) {
    await testTableActionController.loadTestsForCategory(categoryPath);
  }
}

// Export controller instance
export default new TestTableController(); 
