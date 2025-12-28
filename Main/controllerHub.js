// Main/controllerHub.js
// Central hub for controllers

import { createApiLogger } from './Logger/apiLogger.js';

// Create logger for this module
const logger = createApiLogger('controllerHub');

// Import category controllers
import { categoryCreateController } from './Controllers/CategoryController/categoryCreateController.js';
import { categoryDeleteController } from './Controllers/CategoryController/categoryDeleteController.js';
import { categoryRenameController } from './Controllers/CategoryController/categoryRenameController.js';
import { categorySelectController } from './Controllers/CategoryController/categorySelectController.js';
import { categoryTreeController } from './Controllers/CategoryController/categoryTreeController.js';

// Import test controllers
import { testUploadController } from './Controllers/TestController/testUploadController.js';
import { testDeleteController } from './Controllers/TestController/testDeleteController.js';
import { testMergeController } from './Controllers/TestController/testMergeController.js';
import { testTableController } from './Controllers/TestController/testTableController.js';
import { testCreateController } from './Controllers/TestController/testCreateController.js';
import { testRenameController } from './Controllers/TestController/testRenameController.js';
import { testUpdateController } from './Controllers/TestController/testUpdateController.js';

// Import test runner controller
import { testRunnerController } from './Controllers/TestRunner/testRunnerController.js';

// Import learn mode controller
import { learnModeController } from './Controllers/LearnMode/learnModeController.js';

// Import shell controller
import { shellController } from './Controllers/ShellController/shellController.js';

// Log successful controller loading
logger.info('Initializing controllerHub');

// Export controllers
export const controllers = {
  // Category controllers
  category: {
    create: categoryCreateController,
    delete: categoryDeleteController,
    rename: categoryRenameController,

    // Move tree methods to top level for IPC compatibility
    getTreeData: categoryTreeController.buildCategoryTreeData.bind(categoryTreeController),
    getTreePaths: categoryTreeController.getCategoryPaths.bind(categoryTreeController),
    
    // Move category selection methods to top level
    getLastSelected: categorySelectController.getLastSelectedCategory,
    selectCategory: categorySelectController.selectCategory,
    
    // Save references to original controllers for accessing other methods
    tree: categoryTreeController
  },
  
  // Test controllers
  test: {
    table: testTableController,
    upload: testUploadController,
    delete: testDeleteController,
    merge: testMergeController,
    create: testCreateController,
    rename: testRenameController,
    update: testUpdateController
  },
  
  // Test runner controller
  testRunner: testRunnerController,
  
  // Learn mode controller
  learnMode: learnModeController,

  // Shell controller
  shell: shellController
};

// Log successful loading
logger.success('controllerHub loaded successfully');

export default controllers; 