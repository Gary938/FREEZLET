// Main/BusinessLayer/DB/testRepository.js
// Database access layer for tests (re-export from new modules)

// Import new modules into which repository was split
import testBasicOperations from './testBasicOperations.js';
import testProgressOperations from './testProgressOperations.js';
import testMergeOperations from './testMergeOperations.js';
import testCategoryOperations from './testCategoryOperations.js';
import testValidationOperations from './testValidationOperations.js';

// Combine all operations into one common object for backward compatibility
export const testRepository = {
  ...testBasicOperations,
  ...testProgressOperations,
  ...testMergeOperations,
  ...testCategoryOperations,
  ...testValidationOperations
};

// Export default for backward compatibility
export default testRepository; 