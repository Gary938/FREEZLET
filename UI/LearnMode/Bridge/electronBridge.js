// Bridge/electronBridge.js - Safe wrapper over window.electron.learnMode API

// IMPORTS
import { createUITracer } from '../Utils/uiTracer.js';
import { createTimeoutPromise } from '../Utils/timeoutHelpers.js';

// CONFIG
export const BRIDGE_CONFIG = {
    API_TIMEOUT: 10000,          // Timeout for API calls
    RETRY_ATTEMPTS: 3,           // Number of retry attempts on error
    RETRY_DELAY: 1000           // Delay between retry attempts
};

// OPERATIONS
export const createElectronBridge = () => {
    const tracer = createUITracer('electronBridge');
    tracer.trace('createElectronBridge', { 
        hasElectron: !!window.electron?.learnMode 
    });
    
    // Guard clauses for API availability check
    if (!window.electron?.learnMode) {
        tracer.trace('electronBridge:unavailable', { api: 'window.electron.learnMode' });
        return createFallbackAPI();
    }
    
    const learnModeAPI = window.electron.learnMode;
    
    return {
        isAvailable: () => !!window.electron?.learnMode,
        checkAvailability: () => !!window.electron?.learnMode,
        
        startTest: async (testPath) => {
            return timeoutWrapper('startTest', () => learnModeAPI.startTest(testPath));
        },
        
        submitAnswerResult: async (result) => {
            return timeoutWrapper('submitAnswerResult', () => learnModeAPI.submitAnswerResult(result));
        },
        
        clearCurrentTest: async () => {
            return timeoutWrapper('clearCurrentTest', () => learnModeAPI.clearCurrentTest());
        },
        
        hasActiveTest: async () => {
            return timeoutWrapper('hasActiveTest', () => learnModeAPI.hasActiveTest());
        }
    };
};

// CONFIG for export to other modules
export const ELECTRON_BRIDGE_CONFIG = BRIDGE_CONFIG;

// HELPERS
const timeoutWrapper = async (methodName, apiCall) => {
    const tracer = createUITracer('electronBridge');
    tracer.trace(`${methodName}:start`);
    
    try {
        const result = await Promise.race([
            apiCall(),
            createTimeoutPromise(BRIDGE_CONFIG.API_TIMEOUT, 'API_TIMEOUT')
        ]);
        
        tracer.trace(`${methodName}:success`, { hasData: !!result });
        return result;
    } catch (error) {
        tracer.trace(`${methodName}:error`, { error: error.message });
        return createErrorResponse(methodName, error);
    }
};

const createFallbackAPI = () => {
    const tracer = createUITracer('electronBridge');
    tracer.trace('createFallbackAPI', { reason: 'electron API unavailable' });
    
    return {
        isAvailable: () => false,
        checkAvailability: () => false,
        startTest: async () => createErrorResponse('startTest', new Error('ELECTRON_API_UNAVAILABLE')),
        submitAnswerResult: async () => createErrorResponse('submitAnswerResult', new Error('ELECTRON_API_UNAVAILABLE')),
        clearCurrentTest: async () => createErrorResponse('clearCurrentTest', new Error('ELECTRON_API_UNAVAILABLE')),
        hasActiveTest: async () => createErrorResponse('hasActiveTest', new Error('ELECTRON_API_UNAVAILABLE'))
    };
};

const createErrorResponse = (method, error) => ({
    success: false,
    error: {
        code: 'BRIDGE_ERROR',
        method,
        message: error.message,
        timestamp: Date.now()
    }
}); 