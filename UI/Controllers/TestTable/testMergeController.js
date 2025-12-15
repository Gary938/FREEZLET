import { createLogger } from '../../Utils/loggerService.js';
import { uiEventDispatcher } from '../uiEventDispatcher.js';
import { TestMergeBridge } from '../../Bridge/TestMergeBridge.js';
import { ModalController } from '../Modal/modalController.js';
import testTableSelectionController from './testTableSelectionController.js';
import { t } from '../../i18n/index.js';

const logger = createLogger('UI/Controllers/TestTable/testMergeController');

/**
 * Controller for merging tests in UI
 */
export class TestMergeController {
  /**
   * Test merge controller constructor
   */
  constructor() {
    // Initialize bridge for Main process interaction
    this.bridge = new TestMergeBridge();

    // Controller initialization flag
    this._initialized = false;

    logger.debug('Test merge controller created');
  }

  /**
   * Initializes controller and binds event handlers
   */
  init() {
    // Check if controller was already initialized
    if (this._initialized) {
      logger.debug('Test merge controller was already initialized');
      return;
    }

    logger.debug('Initializing test merge controller');

    // Click handler is already added in testTableController, so we don't add it here
    // This prevents handler duplication

    // Mark controller as initialized
    this._initialized = true;
    logger.success('Test merge controller successfully initialized');
  }

  /**
   * Merge tests button click handler
   */
  async handleMergeButtonClick() {
    try {
      logger.debug('Merge tests button clicked');

      // Get merge tests button reference
      const mergeButton = document.querySelector('#mergeTests');

      // Disable merge button during processing
      if (mergeButton) {
        mergeButton.disabled = true;
      }

      // Get selected tests via shared selection controller
      const selectedTests = testTableSelectionController.getSelectedTests();

      if (!selectedTests || selectedTests.length < 2) {
        // Show warning modal
        ModalController.showNotification(t('modal.attention'), t('merge.selectMinimum'));

        // Re-enable button and exit
        if (mergeButton) {
          mergeButton.disabled = false;
        }
        return;
      }

      // Show confirmation modal
      const confirmed = await ModalController.showConfirmation(
        t('merge.title'),
        t('merge.confirmMessage', { count: selectedTests.length }),
        t('merge.confirm'),
        t('modal.cancel')
      );

      if (!confirmed) {
        logger.debug('User cancelled test merge');

        // Re-enable button and exit
        if (mergeButton) {
          mergeButton.disabled = false;
        }
        return;
      }

      logger.info(`Request to merge ${selectedTests.length} tests`);

      // Call bridge to merge tests
      const result = await this.bridge.mergeTests(selectedTests);

      // Re-enable button
      if (mergeButton) {
        mergeButton.disabled = false;
      }

      if (!result.success) {
        ModalController.showError(t('error.title'), t('merge.error', { error: result.error }));
        return;
      }

      // Show success message
      ModalController.showNotification(
        t('merge.success'),
        t('merge.successMessage', { fileName: result.fileName, count: result.questionsCount || '?' })
      );

      // Dispatch successful merge event
      uiEventDispatcher.dispatch(uiEventDispatcher.events.TESTS_MERGED, {
        fileName: result.fileName,
        path: result.path,
        timestamp: Date.now()
      });
    } catch (error) {
      logger.error('Error merging tests:', error);
      ModalController.showError(t('error.title'), t('merge.errorOccurred', { error: error.message }));

      // Re-enable button on error
      const mergeButton = document.querySelector('#mergeTests');
      if (mergeButton) {
        mergeButton.disabled = false;
      }
    }
  }
} 