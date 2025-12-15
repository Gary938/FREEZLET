/**
 * Central hub for business layer
 * Exports all business logic modules
 * @module Main/businessLayerHub
 */

import { createApiLogger } from './Logger/apiLogger.js';

// Create logger for module
const logger = createApiLogger('BusinessLayerHub');

// Import business logic modules
import * as dbLayer from './BusinessLayer/DB/dbLayer.js';
import * as fsLayer from './BusinessLayer/FileSystem/fsLayer.js';
import { buildCategoryTree } from './BusinessLayer/Categories/categoryTreeBuilder.js';
import { testFsOperations } from './BusinessLayer/FileSystem/testFsOperations.js';
import testRepository from './BusinessLayer/DB/testRepository.js';
// ✅ NEW IMPORT: Core architecture
import { startTest, submitAnswer, getTestStatus, endTest } from './BusinessLayer/LearnMode/index.js';

// Log module loading
logger.info('Initializing BusinessLayerHub');

// Export business logic modules
export const businessLayer = {
  // Database
  db: {
    ...dbLayer,
    // Add test repository
    test: {
      ...testRepository
    }
  },
  
  // File system
  fs: {
    ...fsLayer,
    // Add test operations
    test: {
      ...testFsOperations
    }
  },
  
  // Categories
  categories: {
    buildCategoryTree
  },
  
  // Learn mode (new concept - single controller)
  learnMode: {
    controller: { 
      startTest, 
      submitAnswerResult: submitAnswer,  // Adapter for API compatibility
      clearCurrentTest: endTest, 
      hasActiveTest: () => getTestStatus().data?.hasActiveTest || false
    }
  }
};

export default businessLayer; 