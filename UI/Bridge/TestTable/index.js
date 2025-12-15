// UI/Bridge/TestTable/index.js
import { getTestsBridge } from './getTests.js';
import { uploadTestsBridge } from './uploadTests.js';
import { deleteTestsBridge } from './deleteTests.js';
import { createTestBridge } from './testCreateBridge.js';
import { renameTestBridge } from './testRenameBridge.js';
import { getTestContentBridge, updateTestContentBridge } from './testUpdateBridge.js';

/**
 * UI Bridge for test table
 * @module UI/Bridge/TestTable
 */

export const testTableBridge = {
  getTests: getTestsBridge,
  uploadTests: uploadTestsBridge,
  deleteTests: deleteTestsBridge,
  createTest: createTestBridge,
  renameTest: renameTestBridge,
  getTestContent: getTestContentBridge,
  updateTestContent: updateTestContentBridge
};

export default testTableBridge; 