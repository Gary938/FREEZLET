// UI/Controllers/TestTable/testTableActionController.js
// Controller for handling test actions (load, delete)

import { createLogger } from '../../Utils/loggerService.js';
import { testTableBridge } from '../../Bridge/TestTable/index.js';
import { uiEventDispatcher } from '../uiEventDispatcher.js';
import { ModalController } from '../Modal/modalController.js';
import { modalService } from '../Modal/modalService.js';
import testTableViewController from './testTableViewController.js';
import testTableSelectionController from './testTableSelectionController.js';
import categoryBridge from '../../Bridge/Category/index.js';
import { t } from '@UI/i18n/index.js';

// Create logger for module
const logger = createLogger('UI/Controller/TestTable/Action');

/**
 * Test table action controller
 */
export class TestTableActionController {
  constructor() {
    logger.debug('Creating test table action controller instance');

    // Currently selected category
    this.currentCategoryPath = null;

    // Create bridge instance
    this.bridge = testTableBridge;

    logger.info('Test table action controller created');
  }

  /**
   * Sets current category
   * @param {string} path - Path to category
   */
  setCurrentCategory(path) {
    this.currentCategoryPath = path;
    logger.debug(`Current category set: ${path}`);
  }

  /**
   * Gets current category
   * @returns {string|null} - Current category path
   */
  getCurrentCategory() {
    return this.currentCategoryPath;
  }

  /**
   * Loads tests for specified category
   * @param {string} categoryPath - Path to category
   */
  async loadTestsForCategory(categoryPath) {
    try {
      logger.debug(`Loading tests for category: ${categoryPath || 'all categories'}`);

      // Update current category
      this.setCurrentCategory(categoryPath);

      // Show loading indicator
      testTableViewController.showLoading();

      // Get tests through bridge
      const result = await this.bridge.getTests(categoryPath);

      // Check result
      const tests = result.success ? result.tests : [];
      if (!result.success) {
        logger.warn(`Failed to get tests: ${result.error}`);
      }

      // Render tests in table
      testTableViewController.renderTestsInTable(tests);

      // Update button states
      testTableSelectionController.updateButtonStates();

      // Hide loading indicator
      testTableViewController.hideLoading();

      logger.info(`Loaded ${tests.length} tests for category ${categoryPath || 'all'}`);
    } catch (error) {
      logger.error(`Error loading tests: ${error.message}`, error);
      testTableViewController.renderTestsInTable([]);
      testTableViewController.hideLoading();
    }
  }
  
  /**
   * Handler for test start button click
   * @param {Event} event - Click event
   */
  async handleStartTestClick(event) {
    try {
      logger.info('Test start button clicked');

      // Get selected tests
      const selectedTests = testTableSelectionController.getSelectedTests();

      if (!selectedTests || selectedTests.length === 0) {
        logger.warn('No tests selected for start');
        ModalController.showNotification(t('modal.attention'), t('test.selectToRun'));
        return;
      }

      if (selectedTests.length > 1) {
        logger.warn('More than one test selected for start');
        ModalController.showNotification(t('modal.attention'), 'Please select only one test to run');
        return;
      }

      const testPath = selectedTests[0];
      logger.debug(`Starting test: ${testPath}`);

      // Dispatch test runner start event
      uiEventDispatcher.dispatch(uiEventDispatcher.events.TEST_RUNNER_START, {
        testPath: testPath,
        timestamp: Date.now()
      });
    } catch (error) {
      logger.error(`Error starting test: ${error.message}`, error);
      ModalController.showError(t('error.title'), `${t('error.occurred')}: ${error.message}`);
    }
  }

  /**
   * Handler for test load button click
   * @param {Event} event - Click event
   */
  async handleLoadTestClick(event) {
    try {
      logger.info('Test load button clicked');

      // Get current selected category
      if (!this.currentCategoryPath) {
        // Get last selected category through category bridge
        const result = await categoryBridge.getLastSelectedCategory();

        if (result.success && result.path) {
          this.currentCategoryPath = result.path;
        } else {
          // If no category selected, show notification
          ModalController.showNotification(t('modal.attention'), 'Please select a category before loading tests');
          logger.warn('Attempt to load tests without selected category');
          return;
        }
      }

      logger.debug(`Loading tests into category: ${this.currentCategoryPath}`);

      // Show loading indicator
      testTableViewController.showLoading();

      // Call bridge to load tests
      const result = await this.bridge.uploadTests(this.currentCategoryPath);

      // Check result
      if (result.success) {
        if (result.canceled) {
          logger.info('Test loading cancelled by user');
          // Restore test list after cancellation
          await this.loadTestsForCategory(this.currentCategoryPath);
        } else {
          logger.success(`Successfully loaded ${result.uploaded.length} tests`);

          // Update test list
          await this.loadTestsForCategory(this.currentCategoryPath);

          // Dispatch tests updated event
          uiEventDispatcher.dispatch(uiEventDispatcher.events.TESTS_UPDATED, {
            categoryPath: this.currentCategoryPath,
            testsCount: result.uploaded.length,
            timestamp: Date.now()
          });
        }
      } else {
        logger.error(`Test loading error: ${result.error}`);
        ModalController.showError(t('error.title'), `Test loading error: ${result.error}`);
      }

      // Hide loading indicator
      testTableViewController.hideLoading();

    } catch (error) {
      logger.error(`Error loading tests: ${error.message}`, error);
      ModalController.showError(t('error.title'), `${t('error.occurred')}: ${error.message}`);
      testTableViewController.hideLoading();
    }
  }
  
  /**
   * Handler for test delete button click
   * @param {Event} event - Click event
   */
  async handleDeleteTests(event) {
    try {
      logger.info('Test delete button clicked');

      // Get selected tests
      const selectedTests = testTableSelectionController.getSelectedTests();

      if (!selectedTests || selectedTests.length === 0) {
        logger.warn('No tests selected for deletion');
        return;
      }

      logger.debug(`Selected ${selectedTests.length} tests for deletion`);

      // Show confirmation modal
      const confirmed = await ModalController.showConfirmation(
        t('test.delete'),
        t('test.deleteConfirm', { count: selectedTests.length }),
        t('category.delete'),
        t('modal.cancel')
      );

      if (!confirmed) {
        logger.debug('Deletion cancelled by user');
        return;
      }

      // Delete animation (chomp) - add class to rows being deleted
      selectedTests.forEach(path => {
        const row = document.querySelector(`tr[data-test-path="${path}"]`);
        if (row) {
          row.classList.add('row-chomp');
        }
      });

      // Wait for animation to complete (0.4s)
      await new Promise(resolve => setTimeout(resolve, 400));

      // Show loading indicator
      testTableViewController.showLoading();

      // Delete tests through bridge
      const result = await this.bridge.deleteTests(selectedTests);

      // Hide loading indicator
      testTableViewController.hideLoading();

      if (result.success) {
        // Dispatch tests deleted event
        uiEventDispatcher.dispatch(uiEventDispatcher.events.TESTS_DELETED, {
          paths: result.deleted.map(item => item.path),
          timestamp: Date.now()
        });

        // Dispatch event for test table update
        uiEventDispatcher.dispatch(uiEventDispatcher.events.TEST_TABLE_UPDATED, {
          timestamp: Date.now(),
          source: 'testTableController'
        });

        // Update test table
        await this.loadTestsForCategory(this.currentCategoryPath);

        // Show success notification
        if (result.failed.length > 0) {
          ModalController.showNotification(
            t('test.deleteResult'),
            `Deleted ${result.deleted.length} tests. ${result.failed.length} tests could not be deleted.`
          );
        } else {
          ModalController.showNotification(
            t('test.deleted'),
            `Successfully deleted ${result.deleted.length} tests`
          );
        }
      } else {
        // Show error message
        ModalController.showError(
          t('test.deleteError'),
          `Failed to delete tests: ${result.error}`
        );
      }
    } catch (error) {
      logger.error(`Error processing test deletion: ${error.message}`, error);
      testTableViewController.hideLoading();
      ModalController.showError(t('error.title'), `${t('error.occurred')}: ${error.message}`);
    }
  }

  /**
   * Handler for create test button click
   * Opens modal windows for test name and content input
   * @param {Event} event - Click event
   */
  async handleCreateTestClick(event) {
    try {
      logger.info('Create test button clicked');

      // Get current selected category
      if (!this.currentCategoryPath) {
        // Get last selected category through category bridge
        const result = await categoryBridge.getLastSelectedCategory();

        if (result.success && result.path) {
          this.currentCategoryPath = result.path;
        } else {
          // If no category selected, show notification
          ModalController.showNotification(t('modal.attention'), 'Please select a category before creating a test');
          logger.warn('Attempt to create test without selected category');
          return;
        }
      }

      logger.debug(`Creating test in category: ${this.currentCategoryPath}`);

      // Step 1: Show modal for test name input
      const testName = await modalService.prompt(
        t('test.createTitle') || 'Create Test',
        t('test.enterName') || 'Enter test name',
        t('modal.next') || 'Next',
        t('modal.cancel')
      );

      // Check if user cancelled
      if (!testName || testName.trim() === '') {
        logger.debug('Test creation cancelled at name input step');
        return;
      }

      logger.debug(`Test name entered: ${testName}`);

      // Step 2: Show modal for test content input (textarea)
      const testContent = await modalService.textareaPrompt(
        t('test.enterContent') || 'Enter Test Content',
        t('test.contentPlaceholder') || 'Paste your test content here...\n\nFormat:\nQuestion?\nOption 1\nOption 2\n*Correct answer\nOption 4\n\n(empty line between questions)',
        t('modal.save') || 'Save',
        t('modal.cancel')
      );

      // Check if user cancelled
      if (!testContent || testContent.trim() === '') {
        logger.debug('Test creation cancelled at content input step');
        return;
      }

      logger.debug(`Test content entered: ${testContent.length} characters`);

      // Show loading indicator
      testTableViewController.showLoading();

      // Call bridge to create test
      const result = await this.bridge.createTest(
        this.currentCategoryPath,
        testName.trim(),
        testContent
      );

      // Hide loading indicator
      testTableViewController.hideLoading();

      if (result.success) {
        logger.success(`Test created: ${result.path} (${result.questions} questions)`);

        // Update test list
        await this.loadTestsForCategory(this.currentCategoryPath);

        // Dispatch tests updated event
        uiEventDispatcher.dispatch(uiEventDispatcher.events.TESTS_UPDATED, {
          categoryPath: this.currentCategoryPath,
          timestamp: Date.now()
        });

        // Dispatch event for test table update
        uiEventDispatcher.dispatch(uiEventDispatcher.events.TEST_TABLE_UPDATED, {
          timestamp: Date.now(),
          source: 'testCreateController'
        });

        // Show success notification
        ModalController.showNotification(
          t('test.created') || 'Test Created',
          `Test "${testName}" created successfully with ${result.questions} questions`
        );
      } else {
        logger.error(`Test creation error: ${result.error}`);
        ModalController.showError(t('error.title'), `Test creation error: ${result.error}`);
      }
    } catch (error) {
      logger.error(`Error creating test: ${error.message}`, error);
      testTableViewController.hideLoading();
      ModalController.showError(t('error.title'), `${t('error.occurred')}: ${error.message}`);
    }
  }
}

// Export controller instance
export default new TestTableActionController(); 