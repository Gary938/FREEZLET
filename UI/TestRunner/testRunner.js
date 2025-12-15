// UI/TestRunner/testRunner.js
// Test runner entry point

import { createLogger } from '@UI/Utils/loggerService.js';
import { TestRunnerCore } from './TestRunnerCore.js';

// Create logger for module
const logger = createLogger('UI/TestRunner/testRunner');

/**
 * Starts test runner UI rendering
 * @returns {Promise<void>}
 */
export async function renderTestRunnerView() {
  try {
    logger.info('Starting test runner rendering');
    await TestRunnerCore();
    logger.success('Test runner successfully started');
  } catch (error) {
    logger.error(`Error starting test runner: ${error.message}`, error);
    throw error;
  }
} 