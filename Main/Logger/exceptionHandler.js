/**
 * Main/Logger/exceptionHandler.js
 * Handling uncaught exceptions and rejected Promises
 */

/**
 * Set up uncaught exception interception
 * @param {Object} logger Logger instance
 */
export function setupExceptionHandling(logger) {
  process.on('uncaughtException', (error) => {
    logger.error('System', `Uncaught exception: ${error.message}`, {
      name: error.name,
      stack: error.stack,
      cause: error.cause
    });
  });

  process.on('unhandledRejection', (reason, promise) => {
    const errorData = reason instanceof Error
      ? { name: reason.name, message: reason.message, stack: reason.stack }
      : { reason: String(reason) };

    logger.error('System', `Unhandled Promise rejection`, errorData);
  });

  logger.info('System', 'Uncaught exception handling activated');
} 