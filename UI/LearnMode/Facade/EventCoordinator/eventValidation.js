// Facade/EventCoordinator/eventValidation.js - Event parameter validation

// IMPORTS
import { EVENT_COORDINATOR_CONFIG } from './eventTypes.js';

// OPERATIONS
export const validateEventName = (eventName, tracer) => {
    // Guard clause
    if (!eventName || typeof eventName !== 'string') {
        tracer.trace('dispatch', { error: 'INVALID_EVENT_NAME', eventName });
        return true;
    }
    return false;
};

export const validateSubscribeParams = (eventName, handler, listeners, tracer) => {
    // Guard clauses - event name validation
    if (!eventName || typeof eventName !== 'string') {
        tracer.trace('subscribe', { error: 'INVALID_EVENT_NAME', eventName });
        return () => {};
    }
    
    // Guard clauses - handler function validation
    if (!handler || typeof handler !== 'function') {
        tracer.trace('subscribe', { error: 'INVALID_HANDLER', eventName });
        return () => {};
    }
    
    // Guard clauses - listeners limit check
    if (listeners.size >= EVENT_COORDINATOR_CONFIG.MAX_LISTENERS) {
        tracer.trace('subscribe', { error: 'MAX_LISTENERS_EXCEEDED', eventName });
        return () => {};
    }
    
    return null;
}; 