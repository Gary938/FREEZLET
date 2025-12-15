// Utils/errorElements.js - Centralized error element creation

// IMPORTS
import { createUITracer } from './uiTracer.js';

// CONFIG
export const ERROR_ELEMENTS_CONFIG = {
    DEFAULT_MESSAGE: 'An error occurred',
    DEFAULT_TITLE: 'Error',
    CLASSES: {
        CONTAINER: 'error-message',
        TITLE: 'error-title',
        MESSAGE: 'error-message-text',
        BUTTON: 'error-button'
    },
    BUTTON_TEXT: 'Close'
};

// OPERATIONS
export const createErrorElement = (options = {}) => {
    const tracer = createUITracer('errorElements');
    
    const {
        message = ERROR_ELEMENTS_CONFIG.DEFAULT_MESSAGE,
        title = ERROR_ELEMENTS_CONFIG.DEFAULT_TITLE,
        containerClass = ERROR_ELEMENTS_CONFIG.CLASSES.CONTAINER,
        titleClass = ERROR_ELEMENTS_CONFIG.CLASSES.TITLE,
        messageClass = ERROR_ELEMENTS_CONFIG.CLASSES.MESSAGE,
        showButton = false,
        buttonText = ERROR_ELEMENTS_CONFIG.BUTTON_TEXT,
        buttonId = null
    } = options;
    
    tracer.trace('createErrorElement', { 
        hasMessage: !!message,
        hasTitle: !!title,
        showButton
    });
    
    const errorElement = document.createElement('div');
    errorElement.className = containerClass;
    
    // Create title
    const titleElement = document.createElement('h3');
    titleElement.className = titleClass;
    titleElement.textContent = title;
    errorElement.appendChild(titleElement);
    
    // Create message
    const messageElement = document.createElement('p');
    messageElement.className = messageClass;
    messageElement.textContent = message;
    errorElement.appendChild(messageElement);
    
    // Add button if needed
    if (showButton) {
        const button = createErrorButton(buttonText, buttonId);
        errorElement.appendChild(button);
    }
    
    return errorElement;
};

export const createScreenError = (message) => {
    return createErrorElement({
        message,
        containerClass: 'error-message',
        titleClass: 'error-title', 
        messageClass: 'error-message-text'
    });
};

export const createResultsError = (message) => {
    return createErrorElement({
        message,
        title: 'Error',
        containerClass: 'final-error-container',
        titleClass: 'error-title',
        messageClass: 'error-message-text',
        showButton: true,
        buttonText: 'Close',
        buttonId: 'closeResultsError'
    });
};

// HELPERS
const createErrorButton = (text, id) => {
    const button = document.createElement('button');
    button.textContent = text;
    button.className = ERROR_ELEMENTS_CONFIG.CLASSES.BUTTON;
    
    if (id) {
        button.id = id;
    }
    
    return button;
}; 