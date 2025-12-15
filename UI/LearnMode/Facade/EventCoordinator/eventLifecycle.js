// Facade/EventCoordinator/eventLifecycle.js - Coordinator lifecycle management

// IMPORTS
import { EVENT_COORDINATOR_CONFIG } from './eventTypes.js';

// OPERATIONS
export const cleanupAllListeners = (listeners, tracer) => {
    tracer.trace('cleanup', { totalListeners: listeners.size });
    
    try {
        for (const [eventName, { handler, fullEventName }] of listeners) {
            document.removeEventListener(fullEventName, handler);
        }
        
        listeners.clear();
        tracer.trace('cleanup', { success: true });
        
    } catch (error) {
        tracer.trace('cleanup', { error: error.message });
    }
};

export const getCoordinatorState = (listeners) => {
    const state = {
        activeListeners: listeners.size,
        maxListeners: EVENT_COORDINATOR_CONFIG.MAX_LISTENERS,
        eventNames: Array.from(listeners.keys())
    };
    
    return state;
}; 