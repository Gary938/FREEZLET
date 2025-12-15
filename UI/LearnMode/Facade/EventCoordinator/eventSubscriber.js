// Facade/EventCoordinator/eventSubscriber.js - Event subscription

// IMPORTS
import { EVENT_COORDINATOR_CONFIG } from './eventTypes.js';
import { createEventHandler } from './eventDispatcher.js';

// OPERATIONS
export const executeSubscribe = (eventName, handler, listeners, tracer) => {
    try {
        const fullEventName = `${EVENT_COORDINATOR_CONFIG.EVENT_PREFIX}:${eventName}`;
        const wrappedHandler = createEventHandler(eventName, handler, tracer);
        
        document.addEventListener(fullEventName, wrappedHandler);
        listeners.set(eventName, { handler: wrappedHandler, fullEventName });
        
        tracer.trace('subscribe', { 
            eventName, 
            success: true,
            totalListeners: listeners.size 
        });
        
        return () => unsubscribe(eventName, listeners, tracer);
        
    } catch (error) {
        tracer.trace('subscribe', { eventName, error: error.message });
        return () => {};
    }
};

export const unsubscribe = (eventName, listeners, tracer) => {
    // Guard clause - subscription existence check
    if (!listeners.has(eventName)) {
        tracer.trace('unsubscribe', { eventName, notFound: true });
        return;
    }
    
    try {
        const { handler, fullEventName } = listeners.get(eventName);
        document.removeEventListener(fullEventName, handler);
        listeners.delete(eventName);
        
        tracer.trace('unsubscribe', { 
            eventName, 
            success: true,
            remainingListeners: listeners.size 
        });
        
    } catch (error) {
        tracer.trace('unsubscribe', { eventName, error: error.message });
    }
}; 