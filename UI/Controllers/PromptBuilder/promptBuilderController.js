// UI/Controllers/PromptBuilder/promptBuilderController.js
// Controller for Prompt Builder button and modal

import { showPromptBuilderModal } from '../../UI/Components/PromptBuilder/index.js';
import { createLogger } from '../../Utils/loggerService.js';

const logger = createLogger('UI/PromptBuilder/Controller');

/**
 * Initializes the Prompt Builder button
 */
export function initializePromptBuilder() {
  const button = document.getElementById('promptBuilderBtn');

  if (!button) {
    logger.warn('Prompt Builder button not found in DOM');
    return;
  }

  button.addEventListener('click', handlePromptBuilderClick);
  logger.info('Prompt Builder initialized');
}

/**
 * Handles click on Prompt Builder button
 */
async function handlePromptBuilderClick() {
  try {
    logger.info('Opening Prompt Builder modal');
    await showPromptBuilderModal();
    logger.info('Prompt Builder modal closed');
  } catch (error) {
    logger.error('Error in Prompt Builder', error);
  }
}

// Export controller
export const promptBuilderController = {
  initialize: initializePromptBuilder
};
