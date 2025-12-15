// Utils/domValidator.js - DOM element validation

// IMPORTS
import { createUITracer } from './uiTracer.js';

// CONFIG
export const VALIDATION_CONFIG = {
    REQUIRED_ELEMENTS: ['outerArea', 'hybridQuestionArea'],
    TIMEOUT_MS: 5000,
    ELEMENT_VALIDATORS: {
        outerArea: { tagName: 'DIV', required: true },
        hybridQuestionArea: { tagName: 'DIV', required: true },
        closeLearnMode: { tagName: 'BUTTON', required: false }
    }
};

// OPERATIONS
export const validateDOMStructure = (domElements) => {
    const tracer = createUITracer('domValidator');
    tracer.trace('validateDOM', { elements: Object.keys(domElements || {}) });
    
    // Guard clauses
    if (!domElements) return createValidationError('NO_DOM_ELEMENTS');
    
    const missing = VALIDATION_CONFIG.REQUIRED_ELEMENTS
        .filter(element => !domElements[element]);
    
    if (missing.length > 0) {
        return createValidationError('MISSING_DOM_ELEMENTS', missing.join(', '));
    }
    
    return createValidationSuccess({ validated: true });
};

export const validateElementExists = (selector) => {
    // Guard clauses
    if (!selector) return createValidationError('NO_SELECTOR');
    
    const element = document.querySelector(selector);
    return element 
        ? createValidationSuccess({ element }) 
        : createValidationError('ELEMENT_NOT_FOUND', selector);
};

export const waitForElement = async (selector, timeout = VALIDATION_CONFIG.TIMEOUT_MS) => {
    // Guard clauses
    if (!selector) return createValidationError('NO_SELECTOR');
    
    const element = document.querySelector(selector);
    if (element) return createValidationSuccess({ element });
    
    return await createElementWaiter(selector, timeout);
};

// HELPERS
const createValidationError = (code, details = '') => ({
    success: false,
    error: { code, details },
    timestamp: Date.now()
});

const createValidationSuccess = (data) => ({
    success: true,
    data,
    timestamp: Date.now()
});

const createElementWaiter = (selector, timeout) => {
    return new Promise((resolve) => {
        const observer = new MutationObserver(() => {
            const element = document.querySelector(selector);
            if (element) {
                observer.disconnect();
                resolve(createValidationSuccess({ element }));
            }
        });
        
        observer.observe(document.body, { childList: true, subtree: true });
        
        setTimeout(() => {
            observer.disconnect();
            resolve(createValidationError('ELEMENT_TIMEOUT', selector));
        }, timeout);
    });
}; 