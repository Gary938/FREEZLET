// Components/Results/resultsButtons.js - Results control buttons

// IMPORTS
import { createUITracer } from '../../Utils/uiTracer.js';

// CONFIG
export const BUTTONS_CONFIG = {
    FINAL_BUTTONS_CLASS: 'final-buttons-container',
    FINAL_BUTTON_CLASS: 'final-button',
    BUTTON_IDS: {
        TRY_AGAIN: 'btn-try-again',
        NEXT_STAGE: 'btn-next-stage',
        CLOSE: 'btn-close-learning'
    }
};

// OPERATIONS
export const createFinalButtons = (passed, nextStage, currentStage) => {
    const tracer = createUITracer('resultsButtons');
    tracer.trace('createButtons', { passed, nextStage, currentStage });
    
    const buttonsContainer = document.createElement('div');
    buttonsContainer.className = BUTTONS_CONFIG.FINAL_BUTTONS_CLASS;
    
    if (passed) {
        // Next Stage + Close
        const nextStageButton = createButton(BUTTONS_CONFIG.BUTTON_IDS.NEXT_STAGE, 'Next Stage');
        const closeButton = createButton(BUTTONS_CONFIG.BUTTON_IDS.CLOSE, 'Close');
        
        buttonsContainer.appendChild(nextStageButton);
        buttonsContainer.appendChild(closeButton);
    } else {
        // Try Again + Close
        const tryAgainButton = createButton(BUTTONS_CONFIG.BUTTON_IDS.TRY_AGAIN, 'Try Again');
        const closeButton = createButton(BUTTONS_CONFIG.BUTTON_IDS.CLOSE, 'Close');
        
        buttonsContainer.appendChild(tryAgainButton);
        buttonsContainer.appendChild(closeButton);
    }
    
    return buttonsContainer;
};

export const attachResultsHandlers = (container, handlers) => {
    const tracer = createUITracer('resultsButtons');
    tracer.trace('attachHandlers', { hasContainer: !!container, hasHandlers: !!handlers });
    
    if (!container || !handlers) return false;
    
    // Clear old handlers before adding new ones
    Object.entries(BUTTONS_CONFIG.BUTTON_IDS).forEach(([key, buttonId]) => {
        const button = container.querySelector(`#${buttonId}`);
        const handler = handlers[key.toLowerCase()];
        
        if (button && handler) {
            const newButton = button.cloneNode(true);
            button.parentNode.replaceChild(newButton, button);
            newButton.addEventListener('click', handler);
        }
    });
    
    return true;
};

// HELPERS
const createButton = (id, text) => {
    const button = document.createElement('button');
    button.id = id;
    button.textContent = text;
    button.className = BUTTONS_CONFIG.FINAL_BUTTON_CLASS;
    return button;
}; 