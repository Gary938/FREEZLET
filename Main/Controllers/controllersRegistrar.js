/**
 * Main/Controllers/controllersRegistrar.js
 * Controller registrar for routing IPC calls from preload.mjs
 * Serves as bridge between renderer and controllers
 */

import { ipcMain, BrowserWindow } from 'electron';
import { createApiLogger } from '../Logger/apiLogger.js';
import { controllers } from '../controllerHub.js';

// Create logger for this module
const logger = createApiLogger('Controllers:Registrar');

// Log module loading
logger.info('Initializing controller registrar');

/**
 * Parameter types for basic technical validation
 * @enum {string}
 */
export const ParamType = {
  STRING: 'string',
  NUMBER: 'number',
  BOOLEAN: 'boolean',
  OBJECT: 'object',
  ARRAY: 'array',
  ANY: 'any'
};

/**
 * Performs basic technical validation of value by type
 * @param {*} value - Value to check
 * @param {string} type - Type from ParamType
 * @param {boolean} [allowEmpty=true] - Are empty values allowed (for strings, arrays, objects)
 * @returns {boolean} - Validation result
 */
function validateParamType(value, type, allowEmpty = true) {
  if (value === undefined || value === null) {
    return false;
  }
  
  if (type === ParamType.ANY) {
    return true;
  }
  
  if (type === ParamType.ARRAY) {
    return Array.isArray(value) && (allowEmpty || value.length > 0);
  }
  
  if (type === ParamType.OBJECT) {
    return typeof value === 'object' && !Array.isArray(value) && (allowEmpty || Object.keys(value).length > 0);
  }
  
  if (type === ParamType.STRING) {
    return typeof value === 'string' && (allowEmpty || value.trim() !== '');
  }
  
  // For other types just check typeof
  return typeof value === type;
}

/**
 * Registers handler for controller with basic technical validation
 * @param {string} controller - Controller name
 * @param {string} method - Method name
 * @param {Function} handler - Handler
 * @param {Object} [options] - Additional options
 * @param {Object[]} [options.params] - Parameter schema for validation
 */
function registerHandler(controller, method, handler, options = {}) {
  const channel = `controller:${controller}:${method}`;
  const { params = [] } = options;
  
  ipcMain.handle(channel, async (event, ...args) => {
    try {
      logger.info(`Calling ${channel}`);
      
      // Basic technical parameter validation
      if (params.length > 0) {
        for (let i = 0; i < params.length; i++) {
          const param = params[i];
          const value = args[i];
          
          // Skip optional parameters if not provided
          if (!param.required && (value === undefined || value === null)) {
            continue;
          }
          
          // Check parameter type
          if (param.required && (value === undefined || value === null)) {
            logger.warn(`Validation error in ${channel}: required parameter ${param.name || i} not provided`);
            return { 
              success: false, 
              error: `Required parameter ${param.name || i} not provided`,
              validation: true
            };
          }
          
          // If parameter provided, check its type
          if (value !== undefined && value !== null && param.type) {
            const isValid = validateParamType(value, param.type, param.allowEmpty !== false);
            if (!isValid) {
              logger.warn(`Validation error in ${channel}: parameter ${param.name || i} has wrong type`);
              return { 
                success: false, 
                error: `Parameter ${param.name || i} must be of type ${param.type}`,
                validation: true
              };
            }
          }
        }
      }
      
      // Call handler - further business validation happens inside controller
      const result = await handler(...args);
      return result;
    } catch (error) {
      logger.error(`Error in ${channel}`, error);
      return {
        success: false,
        error: error.message
      };
    }
  });
}

/**
 * Registers all public controller methods
 * @param {string} controllerName - Controller name
 * @param {Object} controller - Controller object
 * @param {Object} options - Additional options
 * @returns {string[]} - List of registered methods
 */
function registerControllerMethods(controllerName, controller, options = {}) {
  const { 
    exclude = [], // methods that should not be registered
    withBind = true, // whether to bind methods to controller
    paramSchemas = {} // parameter schemas for methods
  } = options;
  
  // Get all object methods
  const methods = [];
  
  // Object's own properties
  Object.keys(controller).forEach(name => {
    if (typeof controller[name] === 'function' && !name.startsWith('_') && !exclude.includes(name)) {
      methods.push(name);
      const handlerFn = withBind ? controller[name].bind(controller) : controller[name];
      registerHandler(controllerName, name, handlerFn, {
        params: paramSchemas[name] || []
      });
    }
  });
  
  // If object has prototype - get methods from prototype
  const proto = Object.getPrototypeOf(controller);
  if (proto && proto !== Object.prototype) {
    Object.getOwnPropertyNames(proto).forEach(name => {
      if (name !== 'constructor' && !name.startsWith('_') && !exclude.includes(name) && 
          typeof controller[name] === 'function' && !methods.includes(name)) {
        methods.push(name);
        const handlerFn = withBind ? controller[name].bind(controller) : controller[name];
        registerHandler(controllerName, name, handlerFn, {
          params: paramSchemas[name] || []
        });
      }
    });
  }
  
  logger.info(`Controller ${controllerName} registered (${methods.length} methods)`);
  return methods;
}

/**
 * Creates handler requiring BrowserWindow access
 * @param {Function} handler - Original handler
 * @returns {Function} - Handler with window access
 */
function withBrowserWindow(handler) {
  return async (...args) => {
    try {
      const mainWindow = BrowserWindow.getFocusedWindow();
      return await handler(mainWindow, ...args);
    } catch (error) {
      logger.error(`Error in handler with window: ${error.message}`, error);
      return { success: false, error: error.message };
    }
  };
}

/**
 * Universal function for registering controller
 * @param {string} name - Controller name
 * @param {Object} controllerConfig - Controller configuration
 * @param {Object} [options] - Additional options
 */
function registerController(name, controllerConfig, options = {}) {
  // If setup function provided, call it
  if (typeof controllerConfig === 'function') {
    controllerConfig(name);
    return;
  }
  
  // If controller object provided, register its methods
  if (typeof controllerConfig === 'object' && controllerConfig !== null) {
    registerControllerMethods(name, controllerConfig, { withBind: true, ...options });
    return;
  }
  
  logger.warn(`Unknown configuration type for controller ${name}`);
}

/**
 * Registers handlers for specified controller methods
 * @param {string} controllerName - Controller name
 * @param {Object} methodMap - Method -> handler map
 * @param {Object} [options] - Additional options
 * @param {Object} [options.paramSchemas] - Parameter schemas for methods
 */
function registerControllerMethods2(controllerName, methodMap, options = {}) {
  const { paramSchemas = {} } = options;
  
  Object.entries(methodMap).forEach(([method, handler]) => {
    if (typeof handler === 'function') {
      registerHandler(controllerName, method, handler, {
        params: paramSchemas[method] || []
      });
    }
  });
}

// Define parameter schemas for controllers
const categoryParamSchemas = {
  // Schema for category creation method
  create: [
    { name: 'categoryName', type: ParamType.STRING, required: true, allowEmpty: false }
  ],
  // Schema for subcategory creation method
  createSub: [
    { name: 'parentCategory', type: ParamType.STRING, required: true, allowEmpty: false },
    { name: 'subcategoryName', type: ParamType.STRING, required: true, allowEmpty: false }
  ],
  // Schema for category deletion method
  delete: [
    { name: 'categoryPath', type: ParamType.STRING, required: true, allowEmpty: false }
  ],
  // Schema for category rename method
  rename: [
    { name: 'categoryPath', type: ParamType.STRING, required: true, allowEmpty: false },
    { name: 'newName', type: ParamType.STRING, required: true, allowEmpty: false }
  ],
  // Schema for category selection method
  selectCategory: [
    { name: 'categoryPath', type: ParamType.STRING, required: true, allowEmpty: false }
  ]
};

// Schemas for category tree methods
const categoryTreeParamSchemas = {
  getTreeData: [],
  getTreePaths: [],
  getLastSelected: []
  // selectCategory uses schema from categoryParamSchemas
};

// Parameter schemas for learn mode controller (new concept)
const learnModeParamSchemas = {
  startTest: [
    { name: 'testPath', type: ParamType.STRING, required: true, allowEmpty: false }
  ],
  submitAnswerResult: [
    { name: 'result', type: ParamType.STRING, required: true, allowEmpty: false }
  ],
  clearCurrentTest: [],
  hasActiveTest: [],
  setBackgroundMode: [
    { name: 'mode', type: ParamType.STRING, required: true, allowEmpty: false }
  ],
  getBackgroundState: [],
  // MyBackground methods
  loadMyBackground: [], // browserWindow passed via withBrowserWindow
  getMyBackgrounds: [],
  selectMyBackground: [
    { name: 'imagePath', type: ParamType.STRING, required: true, allowEmpty: false }
  ],
  getMyBackgroundSettings: [],
  setMyBackgroundRandomMode: [
    { name: 'enabled', type: ParamType.BOOLEAN, required: true }
  ],
  deleteMyBackgrounds: [
    { name: 'imagePaths', type: ParamType.ARRAY, required: true }
  ]
};

// Function to initialize all handlers
export async function setupControllersIPC() {
  // Register test controllers
  registerControllerMethods('test', controllers.test.table);
  registerControllerMethods('test', controllers.test.delete);
  registerControllerMethods('test', controllers.test.merge);
  registerControllerMethods('test', controllers.test.create);
  registerControllerMethods('test', controllers.test.rename);
  registerControllerMethods('test', controllers.test.update);
  registerHandler('test', 'upload', withBrowserWindow(controllers.test.upload.uploadTests));
  
  // Register category controllers with validation parameters
  registerControllerMethods('category', controllers.category.create, {
    paramSchemas: categoryParamSchemas
  });
  registerControllerMethods('category', controllers.category.delete, {
    paramSchemas: categoryParamSchemas
  });
  registerControllerMethods('category', controllers.category.rename, {
    paramSchemas: categoryParamSchemas
  });
  
  // Register methods for category tree
  registerControllerMethods2('category', {
    getTreeData: controllers.category.getTreeData,
    getTreePaths: controllers.category.getTreePaths,
    getLastSelected: controllers.category.getLastSelected,
    selectCategory: controllers.category.selectCategory
  }, {
    paramSchemas: {
      ...categoryTreeParamSchemas,
      selectCategory: categoryParamSchemas.selectCategory
    }
  });
  
  // Register test runner controller
  registerController('testRunner', controllers.testRunner);
  
  // Register learn mode controller with validation parameters
  // Exclude loadMyBackground - it needs withBrowserWindow
  registerControllerMethods('learnMode', controllers.learnMode, {
    paramSchemas: learnModeParamSchemas,
    exclude: ['loadMyBackground']
  });

  // Register loadMyBackground with BrowserWindow access
  registerHandler('learnMode', 'loadMyBackground',
    withBrowserWindow(controllers.learnMode.loadMyBackground.bind(controllers.learnMode))
  );

  // Register shell controller for opening external URLs
  registerControllerMethods('shell', controllers.shell);

  logger.success('Controllers successfully registered');
}

export default { setupControllersIPC, ParamType }; 