/**
 * Combined bridge for working with categories
 * @module UI/Bridge/Category/index
 */

import { categoryTreeBridge } from './categoryTreeBridge.js';
import { categoryCreateBridge } from './categoryCreateBridge.js';
import { categoryDeleteBridge } from './categoryDeleteBridge.js';
import { categoryRenameBridge } from './categoryRenameBridge.js';
import { categoryLastSelectedBridge } from './categoryLastSelectedBridge.js';

/**
 * Combined bridge for all category operations
 */
export const categoryBridge = {
  // Methods for working with category tree
  getCategoryTreeData: categoryTreeBridge.getCategoryTreeData,
  getCategoryPaths: categoryTreeBridge.getCategoryPaths,

  // Methods for creating categories
  createCategory: categoryCreateBridge.createCategory,
  createSubcategory: categoryCreateBridge.createSubcategory,

  // Methods for deleting categories
  deleteCategory: categoryDeleteBridge.deleteCategory,

  // Methods for renaming categories (works for any nesting level)
  renameCategory: categoryRenameBridge.renameCategory,

  // Methods for working with last selected category
  getLastSelectedCategory: categoryLastSelectedBridge.getLastSelectedCategory,
  selectCategory: categoryLastSelectedBridge.selectCategory
};

export default categoryBridge; 