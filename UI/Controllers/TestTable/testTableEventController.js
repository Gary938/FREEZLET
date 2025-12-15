// UI/Controllers/TestTable/testTableEventController.js
// Controller for handling test table events

import { createLogger } from '../../Utils/loggerService.js';
import { uiEventDispatcher } from '../uiEventDispatcher.js';
import testTableActionController from './testTableActionController.js';
import testTableSelectionController from './testTableSelectionController.js';
import categoryBridge from '../../Bridge/Category/index.js';

// Create logger for module
const logger = createLogger('UI/Controller/TestTable/Event');

/**
 * Test table event controller
 */
export class TestTableEventController {
  constructor() {
    logger.debug('Creating test table event controller instance');

    // Store event unsubscribers
    this.unsubscribers = [];

    logger.info('Test table event controller created');
  }

  /**
   * Sets up base event listeners (without UI_INITIALIZED)
   */
  setupBaseEventListeners() {
    logger.debug('Setting up base event listeners');

    // Subscribe to category selected event
    this.unsubscribers.push(
      uiEventDispatcher.subscribe(
        uiEventDispatcher.events.CATEGORY_SELECTED,
        this.handleCategorySelected.bind(this)
      )
    );

    // Subscribe to tests merged event
    this.unsubscribers.push(
      uiEventDispatcher.subscribe(
        uiEventDispatcher.events.TESTS_MERGED,
        this.handleTestsMerged.bind(this)
      )
    );

    // Subscribe to tests updated event (rename, edit, etc.)
    this.unsubscribers.push(
      uiEventDispatcher.subscribe(
        uiEventDispatcher.events.TESTS_UPDATED,
        this.handleTestsUpdated.bind(this)
      )
    );

    // Handler for test selection (checkboxes)
    const checkboxChangeHandler = (event) => {
      // Check if checkbox changed
      if (event.target.type === 'checkbox') {
        logger.debug('Test selection changed');

        // Update button states
        testTableSelectionController.updateButtonStates();
      }
    };

    document.addEventListener('change', checkboxChangeHandler);

    // Store handler reference for unsubscribing
    this.checkboxChangeHandler = checkboxChangeHandler;

    logger.info('Base event listeners set up');
  }

  /**
   * Sets up UI initialization event listener
   */
  setupInitEventListener() {
    logger.debug('Setting up UI initialization event listener');

    // Subscribe to UI initialization
    this.unsubscribers.push(
      uiEventDispatcher.subscribe(
        uiEventDispatcher.events.UI_INITIALIZED,
        async () => {
          logger.debug('UI initialized, loading tests for last selected category');

          try {
            // Get last selected category through category bridge
            const result = await categoryBridge.getLastSelectedCategory();

            if (result.success && result.path) {
              logger.info(`Loading tests for last selected category: ${result.path}`);
              testTableActionController.setCurrentCategory(result.path);
              await testTableActionController.loadTestsForCategory(result.path);
            } else {
              // If no last category, show empty table
              logger.info('No last selected category, clearing table');
              testTableActionController.loadTestsForCategory(null);
            }
          } catch (error) {
            logger.error('Error loading tests for last category:', error);
            testTableActionController.loadTestsForCategory(null);
          }
        }
      )
    );

    logger.info('UI initialization event listener set up');
  }

  /**
   * Handler for category selected event
   * @param {CustomEvent} event - Category selected event
   */
  async handleCategorySelected(event) {
    try {
      const { path } = event.detail;

      const currentCategory = testTableActionController.getCurrentCategory();
      if (path === currentCategory) {
        logger.debug(`Category ${path} already selected, skipping update`);
        return;
      }

      logger.info(`Category selected: ${path}`);

      // Load tests for selected category
      await testTableActionController.loadTestsForCategory(path);
    } catch (error) {
      logger.error(`Error handling category selection: ${error.message}`, error);
    }
  }

  /**
   * Handler for tests merged event
   * @param {CustomEvent} event - Tests merged event
   */
  async handleTestsMerged(event) {
    try {
      logger.info('Tests merged event received');

      // Update test table for current category
      const currentCategory = testTableActionController.getCurrentCategory();
      if (currentCategory) {
        await testTableActionController.loadTestsForCategory(currentCategory);
      }
    } catch (error) {
      logger.error('Error handling tests merged event:', error);
    }
  }

  /**
   * Handler for tests updated event (rename, edit, etc.)
   * @param {CustomEvent} event - Tests updated event
   */
  async handleTestsUpdated(event) {
    try {
      const { action } = event.detail || {};
      logger.info(`Tests updated event received, action: ${action}`);

      // Reload tests for current category
      const currentCategory = testTableActionController.getCurrentCategory();
      if (currentCategory) {
        await testTableActionController.loadTestsForCategory(currentCategory);
      }
    } catch (error) {
      logger.error('Error handling tests updated event:', error);
    }
  }

  /**
   * Cleans up all event subscriptions
   * Called when component is destroyed
   */
  cleanup() {
    logger.debug('Cleaning up test table event controller listeners');

    // Unsubscribe from all uiEventDispatcher events
    this.unsubscribers.forEach(unsubscribe => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    });
    this.unsubscribers = [];

    // Remove checkbox change handler from document
    if (this.checkboxChangeHandler) {
      document.removeEventListener('change', this.checkboxChangeHandler);
      this.checkboxChangeHandler = null;
    }

    logger.info('Test table event controller listeners cleaned up');
  }
}

// Export controller instance
export default new TestTableEventController(); 