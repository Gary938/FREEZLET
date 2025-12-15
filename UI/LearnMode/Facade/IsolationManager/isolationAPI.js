// IsolationManager/isolationAPI.js - UI isolation API interface

// IMPORTS
import { executeUIOperation } from './isolationOperations.js';

// OPERATIONS
export const createIsolationAPI = (onBeforeStart, onAfterClose, tracer) => {
    let isUIHidden = false;
    
    return {
        hideMainUI: () => executeUIOperation('hide', onBeforeStart, isUIHidden, (hidden) => isUIHidden = hidden, tracer),
        
        showMainUI: () => executeUIOperation('show', onAfterClose, isUIHidden, (hidden) => isUIHidden = hidden, tracer),
        
        getState: () => ({ isUIHidden })
    };
}; 