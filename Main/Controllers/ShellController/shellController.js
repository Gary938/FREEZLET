/**
 * Main/Controllers/ShellController/shellController.js
 * Controller for opening external URLs in browser
 */

import { shell } from 'electron';
import { createApiLogger } from '../../Logger/apiLogger.js';

const logger = createApiLogger('Shell:Controller');

// Whitelist of allowed domains for security
const ALLOWED_DOMAINS = [
  'chatgpt.com',
  'claude.ai',
  'gemini.google.com',
  'grok.com'
];

/**
 * Shell controller for external URL operations
 */
export const shellController = {
  /**
   * Opens URL in default browser
   * @param {string} url - URL to open
   * @returns {Promise<Object>} Result with success status
   */
  async openExternal(url) {
    try {
      logger.info(`Opening external URL: ${url}`);

      // Validate URL format
      const urlObj = new URL(url);

      // Security check - only allow whitelisted domains
      const isAllowed = ALLOWED_DOMAINS.some(domain =>
        urlObj.hostname === domain || urlObj.hostname.endsWith('.' + domain)
      );

      if (!isAllowed) {
        logger.warn(`Domain not allowed: ${urlObj.hostname}`);
        return { success: false, error: 'Domain not allowed' };
      }

      // Open in default browser
      await shell.openExternal(url);

      logger.success(`URL opened successfully: ${url}`);
      return { success: true };

    } catch (error) {
      logger.error('Failed to open external URL', error);
      return { success: false, error: error.message };
    }
  }
};

export default shellController;
