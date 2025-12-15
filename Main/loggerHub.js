/**
 * Main/loggerHub.js
 * Central hub for logging system
 * 
 * This file exports all logging functions from the modular structure
 * and provides backward compatibility for code using the old API.
 */

// Re-export everything from new Logger structure
export * from './Logger/index.js';

// Export mainLogger by default for backward compatibility
import { mainLogger } from './Logger/index.js';
export default mainLogger; 