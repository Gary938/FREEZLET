import { showModal } from './modalController.js';
import { createLogger } from '../../Utils/loggerService.js';
import { t } from '@UI/i18n/index.js';

const logger = createLogger('UI/Modal/Service');

/**
 * Modal service - wrapper over controller providing
 * high-level methods for other controllers
 */
export const modalService = {
  /**
   * Shows information message
   * @param {string} message - Message
   * @param {string} [title] - Title
   * @returns {Promise<boolean>} - User interaction result
   */
  alert(message, title = t('modal.info')) {
    logger.debug(`Displaying message: ${message}`);
    return showModal({
      title,
      message,
      confirmText: t('modal.ok')
    });
  },

  /**
   * Shows confirmation modal
   * @param {string} message - Message
   * @param {string} [title] - Title
   * @param {string} [confirmText] - Confirm button text
   * @param {string} [cancelText] - Cancel button text
   * @returns {Promise<boolean>} - true if confirmed; null if cancelled
   */
  confirm(message, title = t('modal.confirm'), confirmText = t('modal.yes'), cancelText = t('modal.no')) {
    logger.debug(`Confirmation request: ${message}`);
    return showModal({
      title,
      message,
      confirmText,
      cancelText
    });
  },

  /**
   * Shows modal with input field
   * @param {string} title - Title
   * @param {string} [placeholder] - Input placeholder
   * @param {string} [confirmText] - Confirm button text
   * @param {string} [cancelText] - Cancel button text
   * @returns {Promise<string|null>} - Entered value or null if cancelled
   */
  prompt(title, placeholder = '', confirmText = t('modal.ok'), cancelText = t('modal.cancel')) {
    logger.debug(`Input request: ${title}`);
    return showModal({
      title,
      input: true,
      placeholder,
      confirmText,
      cancelText
    });
  },

  /**
   * Shows modal with textarea for multi-line input
   * @param {string} title - Title
   * @param {string} [placeholder] - Textarea placeholder
   * @param {string} [confirmText] - Confirm button text
   * @param {string} [cancelText] - Cancel button text
   * @returns {Promise<string|null>} - Entered value or null if cancelled
   */
  textareaPrompt(title, placeholder = '', confirmText = t('modal.ok'), cancelText = t('modal.cancel')) {
    logger.debug(`Textarea input request: ${title}`);
    return showModal({
      title,
      textarea: true,
      placeholder,
      confirmText,
      cancelText
    });
  }
}; 