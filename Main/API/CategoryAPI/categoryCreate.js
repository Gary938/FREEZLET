import { createApiLogger, logApiStart, logApiSuccess, logApiError } from '../../Logger/apiLogger.js';
import { 
  isValidCategoryName, 
  getCategoryPath,
  getSubcategoryPath
} from '../../Utils/pathUtils.js';

// Import business layer modules
import categoryRepository from '../../BusinessLayer/DB/categoryRepository.js';
import categoryFsOperations from '../../BusinessLayer/FileSystem/categoryFsOperations.js';

// Create logger for module
const logger = createApiLogger('CategoryAPI:create');

/**
 * Creates new category
 * @param {string} categoryName - Category name
 * @returns {Promise<Object>} - Operation result
 */
export async function createCategory(categoryName) {
  try {
    logApiStart(logger, 'createCategory', { categoryName });
    
    // 1. Validate category name
    if (!isValidCategoryName(categoryName)) {
      logger.warn(`Invalid category name: ${categoryName}`);
      return { 
        success: false, 
        error: 'Category name contains invalid characters or is empty' 
      };
    }
    
    // 2. Get category path via centralized utility
    const categoryPath = getCategoryPath(categoryName);
    
    // 3. Check category existence in DB
    if (categoryRepository.categoryExists(categoryPath)) {
      logger.warn(`Category already exists in DB: ${categoryPath}`);
      return { success: false, error: 'Category with this name already exists' };
    }
    
    // 4. Write category to DB
    const dbResult = categoryRepository.addCategory(categoryPath);
    
    if (!dbResult.success) {
      logger.error(`Error writing category to DB: ${dbResult.error}`);
      return { success: false, error: dbResult.error };
    }
    
    logger.info(`Category written to DB: ${categoryPath}`);
    
    // 5. Create physical category directory
    const fsResult = await categoryFsOperations.createDirectory(categoryPath);
    
    if (!fsResult.success) {
      logger.error(`Error creating category directory: ${fsResult.error}`);
      // Rollback DB changes if directory creation failed
      categoryRepository.removeCategory(categoryPath);
      return { success: false, error: fsResult.error };
    }
    
    logger.info(`Category directory created: ${categoryPath}`);
    
    logApiSuccess(logger, 'createCategory');
    return { success: true, path: categoryPath };
  } catch (error) {
    logApiError(logger, 'createCategory', error);
    return { success: false, error: error.message };
  }
}

/**
 * Creates subcategory in specified parent category
 * @param {string} parentCategory - Parent category (path, e.g. Tests/parent)
 * @param {string} name - Subcategory name 
 * @returns {Promise<Object>} - Operation result
 */
export async function createSubcategory(parentCategory, name) {
  try {
    logApiStart(logger, 'createSubcategory', { parentCategory, name });
    
    // 1. Validate subcategory name
    if (!isValidCategoryName(name)) {
      logger.warn(`Invalid subcategory name: ${name}`);
      return { 
        success: false, 
        error: 'Subcategory name contains invalid characters or is empty' 
      };
    }

    // 2. Extract parent category name from path
    const parentName = parentCategory.replace('Tests/', '').replace(/\/$/, '');
    logger.info(`Parent category: ${parentName}`);
    
    // 3. Form subcategory path using central utility
    const subCategoryPath = getSubcategoryPath(parentName, name);
    logger.info(`Subcategory path: ${subCategoryPath}`);
    
    // 4. Check subcategory existence in DB
    if (categoryRepository.subcategoryExists(subCategoryPath)) {
      logger.warn(`Subcategory already exists in DB: ${subCategoryPath}`);
      return { success: false, error: 'Subcategory with this name already exists' };
    }
    
    // 5. Write subcategory to DB
    const dbResult = categoryRepository.addCategory(subCategoryPath);
    
    if (!dbResult.success) {
      logger.error(`Error writing subcategory to DB: ${dbResult.error}`);
      return { success: false, error: dbResult.error };
    }
    
    logger.info(`Subcategory written to DB: ${subCategoryPath}`);
    
    // 6. Create directory for subcategory
    const fsResult = await categoryFsOperations.createDirectory(subCategoryPath);
    
    if (!fsResult.success) {
      logger.error(`Error creating subcategory directory: ${fsResult.error}`);
      // Rollback DB changes if directory creation failed
      categoryRepository.removeCategory(subCategoryPath);
      return { success: false, error: fsResult.error };
    }
    
    logger.info(`Subcategory directory created: ${subCategoryPath}`);
    
    logApiSuccess(logger, 'createSubcategory');
    return { success: true, path: subCategoryPath };
  } catch (error) {
    logApiError(logger, 'createSubcategory', error);
    return { success: false, error: error.message };
  }
} 
