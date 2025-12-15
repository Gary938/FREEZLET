// Controllers/HybridController/HybridController/apiBuilder.js - API creation and configuration

// IMPORTS
import { createCoreAPI } from '../../../Core/index.js';
import { executeHybridPattern } from '../PatternExecutor/index.js';
import { getCurrentCoreAPI, updateControllerAPIReference, cleanupController } from './controllerUtils.js';
import { HYBRID_CONTROLLER_CONFIG } from './controllerFactory.js';

// OPERATIONS
export const createAPIsWithIntegration = (businessData, testPath, businessBridge, tracer, options = {}) => {
    let coreAPI = createCoreAPI(businessData.data, null, options);
    const controllerAPI = createControllerAPI(testPath, businessBridge, coreAPI, tracer, options);

    // Update Core API with controller (pass options again)
    coreAPI = createCoreAPI(businessData.data, controllerAPI, options);
    updateControllerAPIReference(controllerAPI, coreAPI);

    return { coreAPI, controllerAPI };
};

export const createControllerAPI = (testPath, businessBridge, coreAPI, tracer, options = {}) => {
    const controllerAPI = createBaseControllerAPI(testPath, businessBridge, options);
    attachControllerMethods(controllerAPI, businessBridge, coreAPI, tracer);
    return controllerAPI;
};

export const createBaseControllerAPI = (testPath, businessBridge, options = {}) => ({
    info: {
        version: HYBRID_CONTROLLER_CONFIG.CONTROLLER_VERSION,
        testPath,
        initialized: true,
        businessBridgeAvailable: businessBridge.isAvailable()
    },
    businessBridge,
    options  // Write Mode options: { mode: 'select'|'write', showHints: boolean }
});

export const attachControllerMethods = (controllerAPI, businessBridge, coreAPI, tracer) => {
    controllerAPI.handleUserAction = async (actionType, payload = null) => {
        const currentCoreAPI = getCurrentCoreAPI(controllerAPI, coreAPI);
        return executeHybridPattern(actionType, payload, {
            businessBridge,
            coreAPI: currentCoreAPI,
            tracer
        });
    };
    
    controllerAPI.getState = () => getCurrentCoreAPI(controllerAPI, coreAPI).getState();
    controllerAPI.getCurrentComposition = () => getCurrentCoreAPI(controllerAPI, coreAPI).getCurrentComposition();
    controllerAPI.cleanup = () => cleanupController(getCurrentCoreAPI(controllerAPI, coreAPI), tracer);
}; 