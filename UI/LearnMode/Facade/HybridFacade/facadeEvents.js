// Facade/HybridFacade/facadeEvents.js - Facade event management

// CONFIG
export const EVENTS_CONFIG = {
    DOM_EVENTS: {
        CLOSE: 'hybrid:LEARN_MODE_CLOSE',
        RESTART: 'hybrid:LEARN_MODE_RESTART'
    },
    INTERNAL_EVENTS: {
        CLOSE: 'LEARN_MODE_CLOSE'
    },
    DEBOUNCE_TIMEOUT: 500 // Double-click protection
};

// OPERATIONS
export const setupDOMEventHandlers = (state, handleClose, handleRestart, tracer) => {
    // Flags to prevent double triggering
    let closeInProgress = false;
    let restartInProgress = false;
    
    state.domCloseHandler = async (event) => {
        if (closeInProgress) {
            tracer.trace('handleDOMCloseEvent:blocked', { reason: 'already_in_progress' });
            return;
        }
        
        closeInProgress = true;
        tracer.trace('handleDOMCloseEvent', { reason: event.detail?.reason });
        
        try {
            await handleClose();
        } finally {
            setTimeout(() => {
                closeInProgress = false;
            }, EVENTS_CONFIG.DEBOUNCE_TIMEOUT);
        }
    };
    
    state.domRestartHandler = async (event) => {
        if (restartInProgress) {
            tracer.trace('handleDOMRestartEvent:blocked', { reason: 'already_in_progress' });
            return;
        }
        
        restartInProgress = true;
        tracer.trace('handleDOMRestartEvent', { reason: event.detail?.reason });
        
        try {
            await handleRestart(event.detail?.reason);
        } catch (error) {
            tracer.trace('handleDOMRestartEvent:error', { error: error.message });
            throw error;
        } finally {
            setTimeout(() => {
                restartInProgress = false;
            }, EVENTS_CONFIG.DEBOUNCE_TIMEOUT);
        }
    };
    
    document.addEventListener(EVENTS_CONFIG.DOM_EVENTS.CLOSE, state.domCloseHandler);
    document.addEventListener(EVENTS_CONFIG.DOM_EVENTS.RESTART, state.domRestartHandler);
};

export const removeDOMEventListeners = (state) => {
    if (state.domCloseHandler) {
        document.removeEventListener(EVENTS_CONFIG.DOM_EVENTS.CLOSE, state.domCloseHandler);
        state.domCloseHandler = null;
    }
    
    if (state.domRestartHandler) {
        document.removeEventListener(EVENTS_CONFIG.DOM_EVENTS.RESTART, state.domRestartHandler);
        state.domRestartHandler = null;
    }
};

export const subscribeToEvents = (eventCoordinator, handleClose) => {
    eventCoordinator.subscribe(EVENTS_CONFIG.INTERNAL_EVENTS.CLOSE, () => {
        handleClose();
    });
}; 