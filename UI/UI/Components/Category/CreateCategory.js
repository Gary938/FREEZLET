/**
 * Component for displaying new category creation button
 * @module UI/UI/Components/Category/CreateCategory
 */

import { handleCreateCategoryClick } from '../../../Controllers/Category/categoryCreateController.js';
import { createLogger } from '../../../Utils/loggerService.js';

// Create logger for module
const logger = createLogger('UI/Components/CreateCategory');

/**
 * Class for managing category creation button
 */
export class CreateCategoryButton {
  /**
   * Creates category creation button component instance
   * @param {HTMLElement} container - DOM element where button will be added
   */
  constructor(container) {
    if (!container) {
      logger.error('Container not specified for category creation button');
      throw new Error('Container not specified for category creation button');
    }

    this.container = container;
    this.buttonElement = null;

    logger.debug('Category creation button component instance created');
  }

  /**
   * Initializes category creation button
   */
  initialize() {
    try {
      logger.debug('Initializing category creation button');

      // Find existing button instead of creating new one
      this.buttonElement = document.getElementById('newCategoryBtn');

      // If button not found, do nothing
      if (!this.buttonElement) {
        logger.warn('Button #newCategoryBtn not found');
        return;
      }

      // Add click handler to UI controller
      this.buttonElement.addEventListener('click', async () => {
        logger.debug('Category creation button clicked');

        // Call controller to handle click
        const result = await handleCreateCategoryClick();

        if (!result.success && !result.canceled) {
          // Show error to user if operation was not cancelled
          alert(`Error: ${result.error}`);
        }
      });

      logger.info('Category creation button successfully initialized');
    } catch (error) {
      logger.error(`Error initializing category creation button: ${error.message}`);
    }
  }
}

export default CreateCategoryButton;
