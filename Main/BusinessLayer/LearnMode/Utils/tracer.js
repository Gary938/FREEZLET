// Utils/tracer.js - Minimal operation tracing

import { mainLogger } from '../../../loggerHub.js';

// CONFIG
const TRACE_PREFIX = 'LearnMode';
const TRACE_LEVEL = 'trace';

// HELPERS - Safe copy without circular references
const safeClone = (obj, seen = new WeakSet()) => {
    if (obj === null || typeof obj !== 'object') {
        return obj;
    }
    
    if (seen.has(obj)) {
        return '[Circular reference]';
    }
    
    if (Array.isArray(obj)) {
        seen.add(obj);
        const result = obj.map(item => safeClone(item, seen));
        seen.delete(obj);
        return result;
    }
    
    seen.add(obj);
    const result = {};
    for (const [key, value] of Object.entries(obj)) {
        result[key] = safeClone(value, seen);
    }
    seen.delete(obj);
    return result;
};

// OPERATIONS
export const trace = (operation, data = {}) => {
    if (mainLogger[TRACE_LEVEL]) {
        const traceData = {
            operation,
            ...safeClone(data)
        };
        mainLogger[TRACE_LEVEL](TRACE_PREFIX, operation, traceData);
    }
};

export const traceStart = (operation, data = {}) => 
    trace(`${operation}:start`, data);

export const traceEnd = (operation, data = {}) => 
    trace(`${operation}:end`, data);

export const traceError = (operation, error, data = {}) => 
    trace(`${operation}:error`, { error: error.message, ...data });

// HELPERS
export const withTrace = (operation, fn) => async (...args) => {
    traceStart(operation, { args: args.length });
    try {
        const result = await fn(...args);
        traceEnd(operation, { success: true });
        return result;
    } catch (error) {
        traceError(operation, error);
        throw error;
    }
};

export const createTracer = (module) => ({
    trace: (operation, data) => trace(`${module}:${operation}`, data),
    start: (operation, data) => traceStart(`${module}:${operation}`, data),
    end: (operation, data) => traceEnd(`${module}:${operation}`, data),
    error: (operation, error, data) => traceError(`${module}:${operation}`, error, data)
}); 