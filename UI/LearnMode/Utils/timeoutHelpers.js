// Utils/timeoutHelpers.js - Centralized timeout and delay logic

// IMPORTS
import { createUITracer } from './uiTracer.js';

// CONFIG
export const TIMEOUT_CONFIG = {
    DEFAULT_TIMEOUT: 5000,
    DEFAULT_DELAY: 300,
    ERROR_CODES: {
        TIMEOUT_ERROR: 'OPERATION_TIMEOUT',
        CALLBACK_ERROR: 'CALLBACK_EXECUTION_ERROR'
    }
};

// OPERATIONS
export const executeWithTimeout = async (operation, fn, timeout = TIMEOUT_CONFIG.DEFAULT_TIMEOUT, errorMessage = null) => {
    const tracer = createUITracer('timeoutHelpers');
    tracer.trace('executeWithTimeout:start', { operation, timeout });
    
    // Guard clauses
    if (!fn || typeof fn !== 'function') {
        return Promise.resolve();
    }
    
    return new Promise((resolve, reject) => {
        const timeoutId = setTimeout(() => {
            const message = errorMessage || `${TIMEOUT_CONFIG.ERROR_CODES.TIMEOUT_ERROR}: ${operation} exceeded timeout ${timeout}ms`;
            reject(new Error(message));
        }, timeout);
        
        executeCallback(fn, timeoutId, resolve, reject, tracer);
    });
};

export const createTimeoutPromise = (timeout, errorMessage = 'Operation timeout') => {
    return new Promise((_, reject) => {
        setTimeout(() => reject(new Error(errorMessage)), timeout);
    });
};

export const executeCallbackWithTimeout = async (operation, callback, timeout = TIMEOUT_CONFIG.DEFAULT_TIMEOUT) => {
    const tracer = createUITracer('timeoutHelpers');
    tracer.trace('executeCallbackWithTimeout:start', { operation, hasCallback: !!callback, timeout });
    
    if (!callback || typeof callback !== 'function') {
        return Promise.resolve();
    }
    
    const errorMessage = `${TIMEOUT_CONFIG.ERROR_CODES.TIMEOUT_ERROR}: ${operation} exceeded timeout ${timeout}ms`;
    return executeWithTimeout(operation, callback, timeout, errorMessage);
};

export const sleep = (ms = TIMEOUT_CONFIG.DEFAULT_DELAY) => {
    return new Promise(resolve => setTimeout(resolve, ms));
};

export const waitForCondition = async (conditionFn, timeout = TIMEOUT_CONFIG.DEFAULT_TIMEOUT, pollInterval = 100) => {
    const tracer = createUITracer('timeoutHelpers');
    tracer.trace('waitForCondition:start', { timeout, pollInterval });
    
    const startTime = Date.now();
    
    return new Promise((resolve, reject) => {
        const check = () => {
            try {
                if (conditionFn()) {
                    tracer.trace('waitForCondition:success', { elapsed: Date.now() - startTime });
                    resolve(true);
                    return;
                }
                
                if (Date.now() - startTime >= timeout) {
                    tracer.trace('waitForCondition:timeout', { elapsed: Date.now() - startTime });
                    reject(new Error(`Condition timeout after ${timeout}ms`));
                    return;
                }
                
                setTimeout(check, pollInterval);
            } catch (error) {
                tracer.trace('waitForCondition:error', { error: error.message });
                reject(error);
            }
        };
        
        check();
    });
};

// HELPERS
const executeCallback = (callback, timeoutId, resolve, reject, tracer) => {
    try {
        const result = callback();
        
        if (result && typeof result.then === 'function') {
            // Async callback
            result
                .then(() => {
                    clearTimeout(timeoutId);
                    tracer?.trace('executeCallback:asyncSuccess');
                    resolve();
                })
                .catch((error) => {
                    clearTimeout(timeoutId);
                    tracer?.trace('executeCallback:asyncError', { error: error.message });
                    reject(error);
                });
        } else {
            // Sync callback
            clearTimeout(timeoutId);
            tracer?.trace('executeCallback:syncSuccess');
            resolve(result);
        }
    } catch (error) {
        clearTimeout(timeoutId);
        tracer?.trace('executeCallback:syncError', { error: error.message });
        reject(error);
    }
}; 