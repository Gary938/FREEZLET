// Components/Screen/screenHandlers.js - LearnMode screen event handlers

// CONFIG
export const HANDLERS_CONFIG = {
    CLOSE_EVENT_TYPE: 'LEARN_MODE_CLOSE',
    CLOSE_REASON: 'close_button'
};

// OPERATIONS
export const attachCloseButtonHandler = async (layout, eventCoordinator, tracer) => {
    // Guard clauses
    if (!layout) {
        tracer.trace('attachCloseButtonHandler:noLayout');
        return;
    }
    
    if (!layout.closeButton) {
        tracer.trace('attachCloseButtonHandler:noCloseButton');
        return;
    }
    
    layout.closeButton.addEventListener('click', () => {
        tracer.trace('closeButton:clicked');
        
        if (eventCoordinator) {
            eventCoordinator.dispatch(HANDLERS_CONFIG.CLOSE_EVENT_TYPE, { 
                reason: HANDLERS_CONFIG.CLOSE_REASON 
            });
        } else {
            tracer.trace('closeButton:noEventCoordinator');
        }
    });
    
    tracer.trace('attachCloseButtonHandler:success');
};

export const removeCloseButtonHandler = (layout, tracer) => {
    // Guard clauses
    if (!layout?.closeButton) {
        tracer.trace('removeCloseButtonHandler:noButton');
        return;
    }
    
    // Clone element to remove all handlers
    const newButton = layout.closeButton.cloneNode(true);
    layout.closeButton.parentNode.replaceChild(newButton, layout.closeButton);
    layout.closeButton = newButton;
    
    tracer.trace('removeCloseButtonHandler:success');
}; 