// Facade/EventCoordinator/eventDispatcher.js - Event dispatching

// IMPORTS
import { EVENT_COORDINATOR_CONFIG } from './eventTypes.js';

// OPERATIONS
export const executeDispatch = (eventName, data, tracer) => {
    try {
        const customEvent = new CustomEvent(`${EVENT_COORDINATOR_CONFIG.EVENT_PREFIX}:${eventName}`, {
            detail: data,
            bubbles: true,
            cancelable: true
        });
        
        document.dispatchEvent(customEvent);
        tracer.trace('dispatch', { eventName, success: true, hasData: !!data });
        
        return true;
        
    } catch (error) {
        tracer.trace('dispatch', { eventName, error: error.message });
        return false;
    }
};

export const createEventHandler = (eventName, originalHandler, tracer) => {
    return (event) => {
        try {
            originalHandler(event.detail);
            tracer.trace('eventHandler', { eventName, success: true });
            
        } catch (error) {
            tracer.trace('eventHandler', { 
                eventName, 
                error: error.message 
            });
        }
    };
}; 