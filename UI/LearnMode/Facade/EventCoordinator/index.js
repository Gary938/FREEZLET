// Facade/EventCoordinator/index.js - Main event coordinator

// IMPORTS
import { createUITracer } from '../../Utils/uiTracer.js';
import { validateEventName, validateSubscribeParams } from './eventValidation.js';
import { executeDispatch } from './eventDispatcher.js';
import { executeSubscribe } from './eventSubscriber.js';
import { cleanupAllListeners, getCoordinatorState } from './eventLifecycle.js';

// OPERATIONS
export const createEventCoordinator = () => {
    const listeners = new Map();
    const tracer = createUITracer('eventCoordinator');
    
    return {
        // Event dispatch
        dispatch: (eventName, data = null) => {
            const validation = validateEventName(eventName, tracer);
            if (validation) return false;
            
            return executeDispatch(eventName, data, tracer);
        },
        
        // Event subscription
        subscribe: (eventName, handler) => {
            const validation = validateSubscribeParams(eventName, handler, listeners, tracer);
            if (validation) return validation;
            
            return executeSubscribe(eventName, handler, listeners, tracer);
        },
        
        // Clear all subscriptions
        cleanup: () => cleanupAllListeners(listeners, tracer),
        
        // Get coordinator state
        getState: () => getCoordinatorState(listeners)
    };
};

// Exports for backward compatibility
export { EVENT_COORDINATOR_CONFIG, HYBRID_EVENTS } from './eventTypes.js'; 