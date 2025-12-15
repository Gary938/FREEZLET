// IsolationManager/index.js - Centralized export of UI isolation

// IMPORTS
import { createUITracer } from '../../Utils/uiTracer.js';
import { ISOLATION_CONFIG } from './isolationConfig.js';
import { validateCallbacks } from './isolationValidator.js';
import { createIsolationAPI } from './isolationAPI.js';

// OPERATIONS
export const createIsolationManager = (onBeforeStart, onAfterClose) => {
    const tracer = createUITracer('isolationManager');
    
    // Parameter validation
    const validation = validateCallbacks(onBeforeStart, onAfterClose);
    if (validation.error) throw validation.error;
    
    tracer.trace('isolationManager:created', { 
        hasCallbacks: validation.hasCallbacks 
    });
    
    return createIsolationAPI(onBeforeStart, onAfterClose, tracer);
};

// EXPORTS
export { ISOLATION_CONFIG } from './isolationConfig.js';
export { validateCallbacks, validateCallback } from './isolationValidator.js';
export { createIsolationAPI } from './isolationAPI.js';
export { executeUIOperation } from './isolationOperations.js'; 