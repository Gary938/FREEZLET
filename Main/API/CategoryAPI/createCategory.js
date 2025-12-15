import { createApiLogger, logApiStart, logApiSuccess, logApiError } from '../../Logger/apiLogger.js';
import { 
  isValidCategoryName, 
  getCategoryPath
} from '../../Utils/pathUtils.js';

// Import business layer modules
import categoryRepository from '../../BusinessLayer/DB/categoryRepository.js';
import categoryFsOperations from '../../BusinessLayer/FileSystem/categoryFsOperations.js';

// Create logger for module
const logger = createApiLogger('CategoryAPI:create'); 