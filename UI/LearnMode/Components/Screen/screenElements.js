// Components/Screen/screenElements.js - Screen UI elements

// IMPORTS
import { createUITracer } from '../../Utils/uiTracer.js';
import { createScreenError } from '../../Utils/errorElements.js';

// CONFIG
export const ELEMENTS_CONFIG = {
    LOADING_ID: 'learnModeLoading',
    EXAMPLE_CLASS: 'learn-mode-example-display',
    EXAMPLE_TEXT_CLASS: 'example-text'
};

// OPERATIONS
export const createLoadingElement = (text = 'Loading...') => {
    const tracer = createUITracer('screenElements');
    tracer.trace('createLoading', { text });
    
    const loadingElement = document.createElement('div');
    loadingElement.id = ELEMENTS_CONFIG.LOADING_ID;
    loadingElement.textContent = text;
    
    return loadingElement;
};

export const createErrorElement = (message) => {
    const tracer = createUITracer('screenElements');
    tracer.trace('createError', { hasMessage: !!message });
    
    return createScreenError(message);
};

export const createExampleElement = (exampleText) => {
    // Guard clauses
    if (!exampleText) return null;
    
    const tracer = createUITracer('screenElements');
    tracer.trace('createExample', { hasText: !!exampleText });
    
    const container = document.createElement('div');
    container.className = ELEMENTS_CONFIG.EXAMPLE_CLASS;
    
    // ❌ REMOVED: "Example:" title - show only example text
    const text = document.createElement('div');
    text.className = ELEMENTS_CONFIG.EXAMPLE_TEXT_CLASS;
    text.textContent = exampleText;
    
    container.appendChild(text);
    
    return container;
};

export const renderElementToQuestionArea = (element) => {
    const tracer = createUITracer('screenElements');
    tracer.trace('renderElement', { hasElement: !!element });
    
    // Guard clauses
    if (!element) return false;
    
    const questionArea = document.getElementById('hybridQuestionArea');
    if (!questionArea) return false;
    
    questionArea.innerHTML = '';
    questionArea.appendChild(element);
    return true;
};

// HELPERS
export const clearQuestionArea = () => {
    const questionArea = document.getElementById('hybridQuestionArea');
    if (questionArea) {
        questionArea.innerHTML = '';
    }
    return true;
};

export const showLoading = (text = 'Loading...') => {
    const loadingElement = createLoadingElement(text);
    return renderElementToQuestionArea(loadingElement);
};

export const showError = (message) => {
    const errorElement = createErrorElement(message);
    return renderElementToQuestionArea(errorElement);
};

export const showExample = (exampleText) => {
    const exampleElement = createExampleElement(exampleText);
    return renderElementToQuestionArea(exampleElement);
}; 