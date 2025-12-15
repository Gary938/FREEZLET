// Utils/uiTracer.js - Adapted tracer for renderer process

// IMPORTS
import { createLogger } from '../../Utils/loggerService.js';

// CONFIG
export const UI_TRACER_CONFIG = {
    MODULE_PREFIX: 'UI/LearnMode',
    TRACE_LEVEL: 'debug',
    CONSOLE_TRACE: false, // Only errors to console
    ERROR_CODES: {
        NO_COMPONENT: 'NO_COMPONENT_NAME',
        TRACE_FAILED: 'TRACE_OPERATION_FAILED'
    }
};

// OPERATIONS
export const createUITracer = (componentName) => {
    // Guard clauses
    if (!componentName) {
        console.error('[UITracer] Component name required');
        return createEmptyTracer();
    }

    const logger = createLogger(`${UI_TRACER_CONFIG.MODULE_PREFIX}/${componentName}`);
    
    const trace = (operation, data = {}) => {
        const traceData = createTraceData(operation, data);
        sendTraceToMain(logger, 'debug', operation, traceData);
        // DO NOT output trace to browser console
    };
    
    return {
        trace,
        
        traceStart: (operation, data = {}) => 
            trace(`${operation}:start`, data),
            
        traceEnd: (operation, data = {}) => 
            trace(`${operation}:end`, data),
            
        traceError: (operation, error, data = {}) => {
            const errorData = { error: error.message, ...data };
            sendTraceToMain(logger, 'error', `${operation}:error`, errorData);
            // ONLY output errors to browser console
            console.error(`[${componentName}] ${operation}:error`, error);
        }
    };
};

// HELPERS
const createTraceData = (operation, data) => ({ operation, ...data });

const sendTraceToMain = (logger, level, operation, data) => {
    logger[level](operation, data);
};

// sendTraceToConsole no longer used - logs only to main process
// Browser console is used only for errors

const createEmptyTracer = () => ({
    trace: () => {},
    traceStart: () => {},
    traceEnd: () => {},
    traceError: () => {}
}); 