// IsolationManager/isolationValidator.js - Isolation callback validation

// IMPORTS
import { ISOLATION_CONFIG } from './isolationConfig.js';

// OPERATIONS
export const validateCallbacks = (onBeforeStart, onAfterClose) => {
    try {
        validateCallback('onBeforeStart', onBeforeStart);
        validateCallback('onAfterClose', onAfterClose);
        
        return {
            hasCallbacks: {
                onBeforeStart: typeof onBeforeStart === 'function',
                onAfterClose: typeof onAfterClose === 'function'
            }
        };
    } catch (error) {
        return { error: new Error(`${ISOLATION_CONFIG.ERROR_CODES.CREATION_FAILED}: ${error.message}`) };
    }
};

export const validateCallback = (name, callback) => {
    if (callback === null || callback === undefined) return;
    
    if (typeof callback !== 'function') {
        throw new Error(`${ISOLATION_CONFIG.ERROR_CODES.INVALID_CALLBACK}: ${name} must be a function`);
    }
}; 