// Components/Screen/Transitions/transitionHandlers.js - Event handling

// IMPORTS
import { createUITracer } from '../../../Utils/uiTracer.js';

// CONFIG
export const HANDLERS_CONFIG = {
    NEXT_BLOCK_BTN_ID: 'nextBlockBtn'
};

// OPERATIONS
export const attachNextBlockHandler = (handlerFunction) => {
    const tracer = createUITracer('transitionHandlers');
    
    if (!handlerFunction) {
        tracer.trace('attachHandler', { success: false, error: 'No handler provided' });
        return false;
    }
    
    const nextBlockBtn = document.getElementById(HANDLERS_CONFIG.NEXT_BLOCK_BTN_ID);
    
    if (!nextBlockBtn) {
        tracer.trace('attachHandler', { success: false, error: 'Button not found' });
        return false;
    }
    
    const wrappedHandler = () => {
        tracer.trace('buttonClicked', { buttonId: HANDLERS_CONFIG.NEXT_BLOCK_BTN_ID });
        handlerFunction();
    };
    
    nextBlockBtn.addEventListener('click', wrappedHandler);
    tracer.trace('attachHandler', { success: true, buttonAttached: true });
    
    return true;
};

export const removeNextBlockHandler = () => {
    const nextBlockBtn = document.getElementById(HANDLERS_CONFIG.NEXT_BLOCK_BTN_ID);
    
    if (!nextBlockBtn) return false;
    
    const newBtn = nextBlockBtn.cloneNode(true);
    nextBlockBtn.parentNode.replaceChild(newBtn, nextBlockBtn);
    
    return true;
}; 