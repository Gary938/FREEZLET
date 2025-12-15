import { contextBridge, ipcRenderer } from "electron";

// ==============================
// 🔌 PRELOAD BRIDGE API
// ==============================

// Logging
const logHandler = {
  log: (level, namespace, message, data) => {
    ipcRenderer.send('log-message', { level, namespace, message, data });
  }
};

// API for working with controllers
const electronAPI = {
  // Method for IPC invocation
  invoke: (channel, ...args) => {
    // Allow only safe channels
    const allowedChannels = [
      // Channels for category tree (standardized)
      'controller:category:getTreeData',
      'controller:category:getTreePaths',

      // Channels for working with categories
      'controller:category:delete',
      'controller:category:create',
      'controller:category:createSub',
      'controller:category:rename',
      'controller:category:getLastSelected',
      'controller:category:selectCategory',

      // Channels for working with tests
      'controller:test:getTests',
      'controller:test:upload',
      'controller:test:delete',
      'controller:test:deleteMultiple',
      'controller:test:merge',
      'controller:test:create',
      'controller:test:rename',
      'controller:test:getContent',
      'controller:test:updateContent',

      // Unified channels for test runner
      'controller:testRunner:getQuestions',
      'controller:testRunner:getBackground',
      'controller:testRunner:validateTest',
      'controller:testRunner:startTest',

      // Channels for learn mode (new concept)
      'controller:learnMode:startTest',
      'controller:learnMode:submitAnswerResult',
      'controller:learnMode:clearCurrentTest',
      'controller:learnMode:hasActiveTest',
      'controller:learnMode:setBackgroundMode',
      'controller:learnMode:getBackgroundState',
      // MyBackground channels
      'controller:learnMode:loadMyBackground',
      'controller:learnMode:getMyBackgrounds',
      'controller:learnMode:selectMyBackground',
      'controller:learnMode:getMyBackgroundSettings',
      'controller:learnMode:setMyBackgroundRandomMode',
      'controller:learnMode:deleteMyBackgrounds'
    ];

    if (allowedChannels.includes(channel)) {
      return ipcRenderer.invoke(channel, ...args);
    }

    console.error(`Channel ${channel} is not allowed for use`);
    return Promise.reject(new Error(`Channel ${channel} is not allowed for use`));
  }
};

// API for working with categories via controllers
const categoriesAPI = {
  // Get category tree data
  getTreeData: () => {
    return ipcRenderer.invoke('controller:category:getTreeData');
  },

  // Get category paths
  getTreePaths: () => {
    return ipcRenderer.invoke('controller:category:getTreePaths');
  },

  // Create top-level category via controller
  create: (categoryName) => {
    return ipcRenderer.invoke('controller:category:create', categoryName);
  },

  // Create subcategory via controller
  createSub: (parentCategory, subcategoryName) => {
    return ipcRenderer.invoke('controller:category:createSub', parentCategory, subcategoryName);
  },

  // Delete category via controller
  delete: (categoryPath) => {
    return ipcRenderer.invoke('controller:category:delete', categoryPath);
  },

  // Rename category via controller (works for any nesting level)
  rename: (categoryPath, newName) => {
    return ipcRenderer.invoke('controller:category:rename', categoryPath, newName);
  },

  // Get last selected category
  getLastSelected: () => {
    return ipcRenderer.invoke('controller:category:getLastSelected');
  },

  // Set selected category
  selectCategory: (categoryPath) => {
    return ipcRenderer.invoke('controller:category:selectCategory', categoryPath);
  }
};

// API for working with tests via controllers
const testsAPI = {
  // Get tests by category or all tests
  getTests: (categoryPath = null) => {
    return ipcRenderer.invoke('controller:test:getTests', categoryPath);
  },

  // Upload tests to category
  upload: (categoryPath) => {
    return ipcRenderer.invoke('controller:test:upload', categoryPath);
  },

  // Delete single test
  delete: (testPath) => {
    return ipcRenderer.invoke('controller:test:delete', testPath);
  },

  // Delete multiple tests
  deleteMultiple: (testPaths) => {
    return ipcRenderer.invoke('controller:test:deleteMultiple', testPaths);
  },

  // Merge multiple tests
  merge: (testPaths) => {
    return ipcRenderer.invoke('controller:test:merge', testPaths);
  },

  // Create test from content
  create: (categoryPath, testName, content) => {
    return ipcRenderer.invoke('controller:test:create', categoryPath, testName, content);
  },

  // Rename test
  rename: (testPath, newName) => {
    return ipcRenderer.invoke('controller:test:rename', testPath, newName);
  },

  // Get test content
  getContent: (testPath) => {
    return ipcRenderer.invoke('controller:test:getContent', testPath);
  },

  // Update test content
  updateContent: (testPath, content) => {
    return ipcRenderer.invoke('controller:test:updateContent', testPath, content);
  }
};

// API for test runner
const testRunnerAPI = {
  // Get test questions
  getQuestions: (testPath) => {
    return ipcRenderer.invoke('controller:testRunner:getQuestions', testPath);
  },

  // Get background for test runner
  getBackground: (folderPath) => {
    return ipcRenderer.invoke('controller:testRunner:getBackground', folderPath);
  },

  // Validate test before running
  validateTest: (testPath) => {
    return ipcRenderer.invoke('controller:testRunner:validateTest', testPath);
  },

  // Start test
  startTest: (testPath) => {
    return ipcRenderer.invoke('controller:testRunner:startTest', testPath);
  }
};

// API for learn mode (new UI interaction concept)
const learnModeAPI = {
  /**
   * Starts new test
   * @param {string} testPath - Path to test file
   * @returns {Promise<Object>} First question with correct answer
   */
  startTest: (testPath) => {
    return ipcRenderer.invoke('controller:learnMode:startTest', testPath);
  },

  /**
   * Submits answer result from UI
   * @param {string} result - "correct" (first attempt) or "incorrect" (had errors)
   * @returns {Promise<Object>} Next step (question/block/results)
   */
  submitAnswerResult: (result) => {
    return ipcRenderer.invoke('controller:learnMode:submitAnswerResult', result);
  },

  /**
   * Clears current test state
   * @returns {Promise<Object>} Operation result
   */
  clearCurrentTest: () => {
    return ipcRenderer.invoke('controller:learnMode:clearCurrentTest');
  },

  /**
   * Checks if there is an active test
   * @returns {Promise<Object>} Check result
   */
  hasActiveTest: () => {
    return ipcRenderer.invoke('controller:learnMode:hasActiveTest');
  },

  /**
   * Sets background mode for learn mode
   * @param {string} mode - Background mode ('story' or 'random')
   * @returns {Promise<Object>} Operation result with path to first slide
   */
  setBackgroundMode: (mode) => {
    return ipcRenderer.invoke('controller:learnMode:setBackgroundMode', mode);
  },

  /**
   * Gets current background state
   * @returns {Promise<Object>} Result with current background state
   */
  getBackgroundState: () => {
    return ipcRenderer.invoke('controller:learnMode:getBackgroundState');
  },

  /**
   * Loads custom background via file dialog
   * @returns {Promise<Object>} Result with background path
   */
  loadMyBackground: () => {
    return ipcRenderer.invoke('controller:learnMode:loadMyBackground');
  },

  /**
   * Gets list of custom backgrounds
   * @returns {Promise<Object>} List of images
   */
  getMyBackgrounds: () => {
    return ipcRenderer.invoke('controller:learnMode:getMyBackgrounds');
  },

  /**
   * Selects custom background from gallery
   * @param {string} imagePath - Path to image
   * @returns {Promise<Object>} Result with selected background
   */
  selectMyBackground: (imagePath) => {
    return ipcRenderer.invoke('controller:learnMode:selectMyBackground', imagePath);
  },

  /**
   * Gets MyBackground settings (random mode on/off)
   * @returns {Promise<Object>} Settings object
   */
  getMyBackgroundSettings: () => {
    return ipcRenderer.invoke('controller:learnMode:getMyBackgroundSettings');
  },

  /**
   * Sets MyBackground random mode
   * @param {boolean} enabled - Enable or disable random mode
   * @returns {Promise<Object>} Operation result
   */
  setMyBackgroundRandomMode: (enabled) => {
    return ipcRenderer.invoke('controller:learnMode:setMyBackgroundRandomMode', enabled);
  },

  /**
   * Deletes selected custom backgrounds
   * @param {string[]} imagePaths - Array of image paths to delete
   * @returns {Promise<Object>} Result with deleted and failed arrays
   */
  deleteMyBackgrounds: (imagePaths) => {
    return ipcRenderer.invoke('controller:learnMode:deleteMyBackgrounds', imagePaths);
  }
};

// Export API
contextBridge.exposeInMainWorld("electron", {
  logger: logHandler,
  categories: categoriesAPI,
  tests: testsAPI,
  testRunner: testRunnerAPI,
  learnMode: learnModeAPI
});

// Export API for controllers
contextBridge.exposeInMainWorld("electronAPI", electronAPI);

console.log('✅ Preload API initialized successfully');
