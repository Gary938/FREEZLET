// UI/Controllers/Help/helpController.js
// Help system controller - coordinates help button and modal

import { initializeHelpButton } from '../../UI/Components/Help/helpButton.js';
import { createLogger } from '../../Utils/loggerService.js';

const logger = createLogger('UI/Controllers/Help/helpController');

// Initialize help system
export function initializeHelpController() {
  try {
    initializeHelpButton();
    logger.info('Initialized successfully');
  } catch (error) {
    logger.error('Initialization failed:', error);
  }
}
