/**
 * Forms standard path to subcategory
 * @param {string} parentCategory - Parent category name
 * @param {string} subcategoryName - Subcategory name
 * @returns {string} - Path to subcategory
 */
export function getSubcategoryPath(parentCategory, subcategoryName) {
  // Check if parent category starts with Tests/ to avoid duplication
  const normalizedParent = parentCategory.startsWith('Tests/') ? parentCategory : `Tests/${parentCategory}`;
  return `${normalizedParent}/${subcategoryName}`;
}
