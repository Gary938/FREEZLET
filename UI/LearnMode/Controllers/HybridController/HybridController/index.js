// Controllers/HybridController/HybridController/index.js - Centralized export of HybridController modules

// IMPORTS
import { createHybridController, HYBRID_CONTROLLER_CONFIG } from './controllerFactory.js';
import { initializeBusinessLayer, initializeBusinessBridge, startBusinessTest } from './businessInitializer.js';
import { createAPIsWithIntegration, createControllerAPI, createBaseControllerAPI, attachControllerMethods } from './apiBuilder.js';
import { getCurrentCoreAPI, updateControllerAPIReference, cleanupController } from './controllerUtils.js';

// OPERATIONS - Main exports
export {
    createHybridController,
    HYBRID_CONTROLLER_CONFIG
} from './controllerFactory.js';

// OPERATIONS - Internal exports for testing
export {
    initializeBusinessLayer,
    initializeBusinessBridge,
    startBusinessTest
} from './businessInitializer.js';

export {
    createAPIsWithIntegration,
    createControllerAPI,
    createBaseControllerAPI,
    attachControllerMethods
} from './apiBuilder.js';

export {
    getCurrentCoreAPI,
    updateControllerAPIReference,
    cleanupController
} from './controllerUtils.js'; 