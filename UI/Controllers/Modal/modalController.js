import { createModalElement, renderModal, removeModal } from '../../UI/Components/Modal/modalRenderer.js';
import { createLogger } from '../../Utils/loggerService.js';

const logger = createLogger('UI/Modal/Controller');

// Global storage for tracking active modal windows
const modalState = {
  activeModals: []
};

/**
 * Shows modal window and returns user interaction result
 * @param {Object} options - Modal window parameters
 * @returns {Promise<any>} - User interaction result
 */
export function showModal(options) {
  return new Promise((resolve, reject) => {
    try {
      logger.info(`Opening modal window: ${options.title}`);

      // Create modal window
      const modalElement = createModalElement(options);

      // Add modal window to DOM
      const overlay = renderModal(modalElement);

      // Add to active modals list
      modalState.activeModals.push(overlay);

      // Find interaction elements
      const confirmButton = modalElement.querySelector('.modal-confirm');
      const cancelButton = modalElement.querySelector('.modal-cancel');
      const inputElement = modalElement.querySelector('.modal-input');
      const textareaElement = modalElement.querySelector('.modal-textarea');

      // Determine which input element to use
      const activeInputElement = textareaElement || inputElement;

      // Confirm handler
      const handleConfirm = () => {
        const result = activeInputElement ? activeInputElement.value : true;
        logger.info(`Modal window confirmed: ${typeof result === 'string' ? result.substring(0, 50) + '...' : result}`);
        cleanup();
        resolve(result);
      };

      // Cancel handler
      const handleCancel = () => {
        logger.info('Modal window cancelled');
        cleanup();
        resolve(null);
      };

      // Overlay click handler
      const handleOverlayClick = (event) => {
        if (event.target === overlay) {
          handleCancel();
        }
      };

      // Escape key handler (Enter only for single-line input, not for textarea)
      const handleKeyDown = (event) => {
        if (event.key === 'Escape') {
          handleCancel();
        } else if (event.key === 'Enter' && inputElement && !textareaElement) {
          // Enter confirms only for single-line input, not for textarea
          handleConfirm();
        }
      };

      // Add event handlers
      confirmButton.addEventListener('click', handleConfirm);
      if (cancelButton) {
        cancelButton.addEventListener('click', handleCancel);
      }
      overlay.addEventListener('click', handleOverlayClick);
      document.addEventListener('keydown', handleKeyDown);

      // Focus active input element if present
      if (activeInputElement) {
        setTimeout(() => {
          activeInputElement.focus();
        }, 100);
      }

      // Cleanup function
      const cleanup = () => {
        // Remove event handlers
        confirmButton.removeEventListener('click', handleConfirm);
        if (cancelButton) {
          cancelButton.removeEventListener('click', handleCancel);
        }
        overlay.removeEventListener('click', handleOverlayClick);
        document.removeEventListener('keydown', handleKeyDown);

        // Remove modal from active modals list
        const index = modalState.activeModals.indexOf(overlay);
        if (index !== -1) {
          modalState.activeModals.splice(index, 1);
        }

        // Remove modal from DOM
        removeModal(overlay);
      };

    } catch (error) {
      logger.error('Error showing modal window', error);
      reject(error);
    }
  });
}

/**
 * Shows confirmation dialog
 * @param {string} title - Dialog title
 * @param {string} message - Dialog message
 * @param {string} confirmText - Confirm button text
 * @param {string} cancelText - Cancel button text
 * @returns {Promise<boolean>} - true if user confirmed, false otherwise
 */
export function showConfirmation(title, message, confirmText = 'Confirm', cancelText = 'Cancel') {
  return showModal({
    title,
    content: message,
    confirmText,
    cancelText
  }).then(result => !!result);
}

/**
 * Shows information message
 * @param {string} title - Message title
 * @param {string} message - Message text
 * @param {string} buttonText - "OK" button text
 * @returns {Promise<void>}
 */
export function showNotification(title, message, buttonText = 'OK') {
  return showModal({
    title,
    content: message,
    confirmText: buttonText,
    showCancel: false
  });
}

/**
 * Shows error message
 * @param {string} title - Message title
 * @param {string} message - Error message text
 * @param {string} buttonText - "OK" button text
 * @returns {Promise<void>}
 */
export function showError(title, message, buttonText = 'OK') {
  return showModal({
    title,
    content: message,
    confirmText: buttonText,
    showCancel: false,
    isError: true
  });
}

// Export main methods for working with modal windows
export const ModalController = {
  showModal,
  showConfirmation,
  showNotification,
  showError
}; 