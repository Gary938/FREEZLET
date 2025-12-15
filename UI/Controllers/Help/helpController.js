// UI/Controllers/Help/helpController.js
// Help system controller - coordinates help button and modal

import { initializeHelpButton } from '../../UI/Components/Help/helpButton.js';

// Initialize help system
export function initializeHelpController() {
  try {
    initializeHelpButton();
    console.log('[HelpController] Initialized successfully');
  } catch (error) {
    console.error('[HelpController] Initialization failed:', error);
  }
}
