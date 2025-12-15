// IsolationManager/isolationOperations.js - UI isolation operations

// IMPORTS
import { ISOLATION_CONFIG } from './isolationConfig.js';
import { executeCallbackWithTimeout, sleep } from '../../Utils/timeoutHelpers.js';

// OPERATIONS
export const executeUIOperation = async (operation, callback, currentState, setState, tracer) => {
    const isHide = operation === 'hide';
    
    // Guard clauses for state check
    if (isHide && currentState) {
        tracer.trace(`${operation}:alreadyHidden`);
        return true;
    }
    
    if (!isHide && !currentState) {
        tracer.trace(`${operation}:alreadyVisible`);
        return true;
    }
    
    try {
        await executeCallbackWithTimeout(operation, callback, ISOLATION_CONFIG.TIMEOUT);
        await sleep(ISOLATION_CONFIG.ANIMATION_DELAY);
        setState(isHide);
        
        tracer.trace(`${operation}:success`, { isUIHidden: isHide });
        return true;
    } catch (error) {
        tracer.traceError(operation, error);
        return false;
    }
}; 