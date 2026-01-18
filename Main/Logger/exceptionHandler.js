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
    // Ignore EPIPE errors - they occur when stdout/stderr is closed (no terminal)
    // Logging EPIPE would cause infinite loop: console.error → EPIPE → logger.error → console.error → EPIPE...
    if (error.code === 'EPIPE' || error.message?.includes('EPIPE')) {
      return;
    }

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