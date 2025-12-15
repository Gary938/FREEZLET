import { modalService } from '../Controllers/Modal/modalService.js';
import { createLogger } from '../Utils/loggerService.js';

const logger = createLogger('UI/Bridge:modal');

/**
 * Bridge for modal windows between UI and business layers
 * - UI layers call modalService methods directly
 * - Business layers should use this bridge
 */
export const modalBridge = {
  /**
   * Shows an information message
   * @param {string} message - Message
   * @param {string} [title] - Title
   * @returns {Promise<boolean>} - User interaction result
   */
  async showAlert(message, title) {
    try {
      logger.info(`Request to display info message: "${message}" (${title})`);
      return await modalService.alert(message, title);
    } catch (error) {
      logger.error(`Error displaying info message: ${error.message}`);
      return false;
    }
  },

  /**
   * Shows a confirmation modal window
   * @param {string} message - Message
   * @param {string} [title] - Title
   * @param {string} [confirmText] - Confirm button text
   * @param {string} [cancelText] - Cancel button text
   * @returns {Promise<boolean>} - true if user confirmed; null if cancelled
   */
  async showConfirm(message, title, confirmText, cancelText) {
    try {
      logger.info(`Request to display confirmation dialog: "${message}" (${title})`);
      return await modalService.confirm(message, title, confirmText, cancelText);
    } catch (error) {
      logger.error(`Error displaying confirmation dialog: ${error.message}`);
      return false;
    }
  },

  /**
   * Shows a modal window with input field
   * @param {string} title - Title
   * @param {string} [placeholder] - Input field placeholder
   * @param {string} [confirmText] - Confirm button text
   * @param {string} [cancelText] - Cancel button text
   * @returns {Promise<string|null>} - Entered value or null if user cancelled
   */
  async showPrompt(title, placeholder, confirmText, cancelText) {
    try {
      logger.info(`Request to display input dialog: "${title}"`);
      return await modalService.prompt(title, placeholder, confirmText, cancelText);
    } catch (error) {
      logger.error(`Error displaying input dialog: ${error.message}`);
      return null;
    }
  }
};