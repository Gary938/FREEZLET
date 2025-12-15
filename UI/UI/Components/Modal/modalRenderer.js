import { createLogger } from '../../../Utils/loggerService.js';
import { t } from '../../../i18n/index.js';

const logger = createLogger('UI/Modal/Renderer');

/**
 * Creates DOM structure for modal window
 * @param {Object} options - Modal window options
 * @returns {HTMLElement} - Modal window DOM element
 */
export function createModalElement(options) {
  try {
    const { title, message, input, textarea, placeholder, cancelText, confirmText } = options;

    // Create modal window container
    const modal = document.createElement('div');
    modal.className = 'modal';

    // Add wide class for textarea modals
    if (textarea) {
      modal.classList.add('modal-wide');
    }

    // Create title
    const titleElement = document.createElement('h2');
    titleElement.className = 'modal-title';
    titleElement.textContent = title || t('modal.info');
    modal.appendChild(titleElement);

    // Create content (message or input field)
    if (message) {
      const messageElement = document.createElement('p');
      messageElement.className = 'modal-message';
      messageElement.textContent = message;
      modal.appendChild(messageElement);
    }

    if (input) {
      const inputElement = document.createElement('input');
      inputElement.className = 'modal-input';
      inputElement.type = 'text';
      inputElement.placeholder = placeholder || '';
      modal.appendChild(inputElement);
    }

    // Create textarea for multi-line input
    if (textarea) {
      const textareaElement = document.createElement('textarea');
      textareaElement.className = 'modal-textarea';
      textareaElement.value = placeholder || '';
      textareaElement.rows = 15;
      modal.appendChild(textareaElement);
    }

    // Create buttons
    const buttonsContainer = document.createElement('div');
    buttonsContainer.className = 'modal-buttons';

    if (cancelText) {
      const cancelButton = document.createElement('button');
      cancelButton.className = 'modal-button modal-cancel';
      cancelButton.textContent = cancelText;
      buttonsContainer.appendChild(cancelButton);
    }

    const confirmButton = document.createElement('button');
    confirmButton.className = 'modal-button modal-confirm';
    confirmButton.textContent = confirmText || t('modal.ok');
    buttonsContainer.appendChild(confirmButton);

    modal.appendChild(buttonsContainer);

    logger.debug('Modal window DOM element created');
    return modal;
  } catch (error) {
    logger.error('Error creating modal window', error);
    throw error;
  }
}

/**
 * Adds modal window to DOM
 * @param {HTMLElement} modalElement - Modal window DOM element
 * @returns {HTMLElement} - Modal window container
 */
export function renderModal(modalElement) {
  try {
    // Create overlay (background dimming)
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';

    // Create modal window container
    const container = document.createElement('div');
    container.className = 'modal-container';

    // Add modal window to container
    container.appendChild(modalElement);

    // Add container to overlay
    overlay.appendChild(container);

    // Add overlay to DOM
    document.body.appendChild(overlay);

    // Appearance animation
    setTimeout(() => {
      overlay.classList.add('active');
    }, 10);

    logger.debug('Modal window rendered in DOM');
    return overlay;
  } catch (error) {
    logger.error('Error rendering modal window', error);
    throw error;
  }
}

/**
 * Removes modal window from DOM
 * @param {HTMLElement} overlay - Modal window container
 */
export function removeModal(overlay) {
  try {
    // Disappearance animation
    overlay.classList.remove('active');

    // Remove from DOM after animation
    setTimeout(() => {
      if (overlay.parentNode) {
        document.body.removeChild(overlay);
      }
    }, 300);

    logger.debug('Modal window removed from DOM');
  } catch (error) {
    logger.error('Error removing modal window', error);
    // Try to force remove
    try {
      if (overlay.parentNode) {
        document.body.removeChild(overlay);
      }
    } catch (e) {
      logger.error('Critical error removing modal window', e);
    }
  }
}
