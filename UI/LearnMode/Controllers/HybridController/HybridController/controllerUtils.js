// Controllers/HybridController/HybridController/controllerUtils.js - Controller utilities

// OPERATIONS
export const getCurrentCoreAPI = (controllerAPI, fallbackCoreAPI) => {
    return controllerAPI._coreAPI || fallbackCoreAPI;
};

export const updateControllerAPIReference = (controllerAPI, coreAPI) => {
    controllerAPI._coreAPI = coreAPI;
};

export const cleanupController = (coreAPI, tracer) => {
    try {
        if (coreAPI?.cleanup) {
            coreAPI.cleanup();
        }
        tracer.trace('cleanup:success');
    } catch (error) {
        tracer.trace('cleanup:error', { error: error.message });
    }
}; 