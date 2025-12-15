/**
 * Centralized initialization of all UI controllers
 * @module UI/Controllers/initControllers
 */

import { createLogger } from '../Utils/loggerService.js';
import { categoryTreeController } from './Category/categoryTreeController.js';
import { categoryCreateController } from './Category/categoryCreateController.js';
import { uiEventDispatcher } from './uiEventDispatcher.js';

// Create logger for module
const logger = createLogger('UI/Init');

/**
 * Initializes all UI controllers in correct order
 * @returns {Promise<boolean>} - Initialization result
 */
export async function initUIControllers() {
  try {
    logger.info('Starting UI controllers initialization');

    // 1. Dispatch initialization start event
    uiEventDispatcher.dispatch(uiEventDispatcher.events.UI_INITIALIZED, {
      state: 'starting',
      timestamp: Date.now()
    });

    // 2. Initialize category tree controller
    logger.debug('Initializing category tree controller');
    if (typeof categoryTreeController.init === 'function') {
      await categoryTreeController.init();
    }

    // 3. Initialize category create controller
    logger.debug('Initializing category create controller');
    if (typeof categoryCreateController.init === 'function') {
      await categoryCreateController.init();
    }

    // 4. Initialize other controllers
    // ... add as needed

    // 5. Dispatch initialization complete event
    uiEventDispatcher.dispatch(uiEventDispatcher.events.UI_INITIALIZED, {
      state: 'completed',
      timestamp: Date.now()
    });

    logger.info('UI controllers successfully initialized');
    return true;
  } catch (error) {
    logger.error('UI controllers initialization error', error);
    console.error('UI controllers initialization error:', error);

    // Dispatch initialization error event
    uiEventDispatcher.dispatch(uiEventDispatcher.events.UI_INITIALIZED, {
      state: 'error',
      error: error.message,
      timestamp: Date.now()
    });

    return false;
  }
}

export default initUIControllers; 