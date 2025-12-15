/**
 * Central UI event dispatcher
 * Provides communication between UI components and UI controllers
 * according to six-layer architecture
 * @module UI/Controllers/uiEventDispatcher
 */

import { createLogger } from '../Utils/loggerService.js';

// Create logger for module
const logger = createLogger('UI/Controllers/uiEventDispatcher');

/**
 * UI event dispatcher
 * Provides centralized mechanism for sending and receiving events
 * between UI components and UI controllers
 */
export const uiEventDispatcher = {
  /**
   * Dispatches UI event
   * @param {string} eventName - Event name
   * @param {Object} data - Event data
   */
  dispatch(eventName, data) {
    try {
      logger.debug(`Dispatching event "${eventName}"`);
      const event = new CustomEvent(eventName, {
        detail: data,
        bubbles: true,
        cancelable: true
      });
      document.dispatchEvent(event);
      logger.debug(`Event "${eventName}" dispatched`);
    } catch (error) {
      logger.error(`Error dispatching event "${eventName}"`, error);
    }
  },

  /**
   * Subscribes to UI event
   * @param {string} eventName - Event name
   * @param {Function} handler - Event handler
   * @returns {Function} - Unsubscribe function
   */
  subscribe(eventName, handler) {
    try {
      logger.debug(`Subscribing to event "${eventName}"`);

      // Create wrapper for event handler to ensure proper logging
      const wrappedHandler = (event) => {
        try {
          handler(event);
        } catch (error) {
          logger.error(`Error in event handler "${eventName}"`, error);
        }
      };

      // Add handler
      document.addEventListener(eventName, wrappedHandler);

      // Return unsubscribe function
      return () => {
        logger.debug(`Unsubscribing from event "${eventName}"`);
        document.removeEventListener(eventName, wrappedHandler);
      };
    } catch (error) {
      logger.error(`Error subscribing to event "${eventName}"`, error);
      // Return empty unsubscribe function on error
      return () => {};
    }
  },

  /**
   * Unsubscribes from UI event
   * @param {string} eventName - Event name
   * @param {Function} handler - Event handler
   */
  unsubscribe(eventName, handler) {
    try {
      logger.debug(`Unsubscribing from event "${eventName}"`);
      document.removeEventListener(eventName, handler);
    } catch (error) {
      logger.error(`Error unsubscribing from event "${eventName}"`, error);
    }
  },

  /**
   * Defines constants for most commonly used events
   */
  events: {
    // Category events
    CATEGORY_CREATED: 'category:created',
    CATEGORY_UPDATED: 'category:updated',
    CATEGORY_DELETED: 'category:deleted',
    CATEGORY_TREE_UPDATED: 'category:tree:updated',
    CATEGORY_SELECTED: 'category:selected',

    // Test events
    TESTS_UPDATED: 'tests:updated',
    TESTS_MERGED: 'tests:merged',
    TESTS_DELETED: 'tests:deleted',
    TEST_TABLE_UPDATED: 'test:table:updated',

    // UI events
    UI_INITIALIZED: 'ui:initialized',

    // Test runner events
    TEST_RUNNER_START: 'test-runner:start',
    TEST_RUNNER_COMPLETE: 'test-runner:complete',
    TEST_RUNNER_CLOSE: 'test-runner:close',
    TEST_RUNNER_QUESTION_ANSWERED: 'test-runner:question:answered',
    TEST_RUNNER_PROGRESS_UPDATED: 'test-runner:progress:updated'
  }
};

export default uiEventDispatcher; 