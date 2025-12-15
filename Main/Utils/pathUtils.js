/**
 * PathUtils - hub for working with category, subcategory and test paths
 *
 * This file is a hub and contains no logic, only re-exports from modules
 */

// Export all modules
export * from './PathUtils/index.js';

// Collect all exported functions into pathUtils object for backward compatibility
import * as categoryUtils from './PathUtils/categoryUtils.js';
import * as subcategoryUtils from './PathUtils/subcategoryUtils.js';
import * as testUtils from './PathUtils/testUtils.js';
import * as pathValidationUtils from './PathUtils/pathValidationUtils.js';
import * as pathFormatUtils from './PathUtils/pathFormatUtils.js';

export const pathUtils = {
  // Functions from categoryUtils
  ...categoryUtils,
  // Functions from subcategoryUtils
  ...subcategoryUtils,
  // Functions from testUtils
  ...testUtils,
  // Functions from pathValidationUtils
  ...pathValidationUtils,
  // Functions from pathFormatUtils
  ...pathFormatUtils
};
