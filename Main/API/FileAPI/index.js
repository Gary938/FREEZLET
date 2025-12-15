// Main/API/FileAPI/index.js
// Export all API functions for file operations

/**
 * Folder operations:
 * - createFolder - create folder
 * - renameFolder - rename folder
 * - deleteFolder - delete folder
 */
export * from './folderOperations.js';

/**
 * File operations:
 * - fileExists - check file existence
 * - readTextFile - read text file
 * - writeTextFile - write text file
 * - deleteFile - delete file
 * - copyFile - copy file
 * - appendToFile - append text to file
 * - writeMergedTestFile - write merged test
 */
export * from './fileOperations.js';

/**
 * Directory operations:
 * - listDirs - get folders list
 * - listFiles - get files list
 * - readDir - read directory contents
 * - listImages - get images list
 */
export * from './dirOperations.js';

/**
 * Dialog operations:
 * - openFile - open file selection dialog
 */
export * from './dialogOperations.js';

/**
 * Background image operations:
 * - getBackgroundState - get current background state
 * - saveBackgroundPath - save background image path
 * - getBackgroundMode - get background display mode
 * - saveBackgroundMode - save background display mode
 * - getRandomBackground - get random background image
 */
export * from './backgroundOperations.js';

// Other file operation API exports added here

// In the future there will be other exports, for example:
// export * from './fileOperations.js';

// Here will be exports of individual API modules for file operations
// Example:
// export * from './fileOperations.js';
// export * from './dirOperations.js';
// export * from './folderStructure.js'; 
