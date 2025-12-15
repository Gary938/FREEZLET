// Controllers/HybridController/HybridController/controllerFactory.js - Controller factory

// IMPORTS
import { createUITracer } from '../../../Utils/uiTracer.js';
import { initializeBusinessLayer } from './businessInitializer.js';
import { createAPIsWithIntegration } from './apiBuilder.js';

// CONFIG
export const HYBRID_CONTROLLER_CONFIG = {
    INITIALIZATION_TIMEOUT: 5000,
    ACTION_TIMEOUT: 3000,
    MAX_RETRIES: 2,
    CONTROLLER_VERSION: '2.0.0-hybrid'
};

// OPERATIONS
export const createHybridController = async (testPath, options = {}) => {
    const tracer = createUITracer('hybridController');

    // Guard clauses
    if (!testPath || typeof testPath !== 'string') {
        throw new Error('INVALID_TEST_PATH: Test path is required');
    }

    try {
        const { businessBridge, businessData } = await initializeBusinessLayer(testPath);
        const { coreAPI, controllerAPI } = createAPIsWithIntegration(businessData, testPath, businessBridge, tracer, options);

        tracer.trace('initializeController:success', { ready: true, mode: options.mode });
        return controllerAPI;

    } catch (error) {
        tracer.trace('initializeController:error', { error: error.message });
        throw error;
    }
}; 