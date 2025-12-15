// UI/Controllers/TestTable/index.js
// Index file for exporting all TestTable modules

import testTableController from './testTableController.js';
import testTableViewController from './testTableViewController.js';
import testTableSelectionController from './testTableSelectionController.js';
import testTableActionController from './testTableActionController.js';
import testTableEventController from './testTableEventController.js';
import { TestMergeController } from './testMergeController.js';

// Export main controller as default export for backward compatibility
export default testTableController;

// Export all individual modules for direct access
export {
  testTableController,
  testTableViewController,
  testTableSelectionController,
  testTableActionController,
  testTableEventController,
  TestMergeController
}; 