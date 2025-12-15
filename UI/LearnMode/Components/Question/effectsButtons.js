// Components/Question/effectsButtons.js - Button state management

// IMPORTS
import { createUITracer } from '../../Utils/uiTracer.js';

// CONFIG
export const BUTTONS_EFFECTS_CONFIG = {
    DISABLED_CLASS: 'disabled',
    // Old CSS classes for resetEffects compatibility
    CORRECT_CLASS: 'correct-answer',
    INCORRECT_CLASS: 'incorrect-answer'
};

// OPERATIONS
export const disableAllAnswerButtons = (containerElement) => {
    const tracer = createUITracer('effectsButtons');
    tracer.trace('disableButtons', { hasContainer: !!containerElement });
    
    // Guard clauses
    if (!containerElement) return false;
    
    const buttons = containerElement.querySelectorAll('.answer-option');
    buttons.forEach(button => disableButton(button));
    return true;
};

export const enableAllAnswerButtons = (containerElement) => {
    const tracer = createUITracer('effectsButtons');
    tracer.trace('enableButtons', { hasContainer: !!containerElement });
    
    // Guard clauses
    if (!containerElement) return false;
    
    const buttons = containerElement.querySelectorAll('.answer-option');
    buttons.forEach(button => enableButton(button));
    return true;
};

export const resetEffects = (containerElement) => {
    const tracer = createUITracer('effectsButtons');
    tracer.trace('resetEffects');
    
    // Guard clauses
    if (!containerElement) return false;
    
    const buttons = containerElement.querySelectorAll('.answer-option');
    buttons.forEach(button => {
        button.classList.remove(BUTTONS_EFFECTS_CONFIG.CORRECT_CLASS);
        button.classList.remove(BUTTONS_EFFECTS_CONFIG.INCORRECT_CLASS);
        enableButton(button);
    });
    
    return true;
};

// HELPERS
const disableButton = (button) => {
    if (!button) return;
    
    button.disabled = true;
    button.classList.add(BUTTONS_EFFECTS_CONFIG.DISABLED_CLASS);
};

const enableButton = (button) => {
    if (!button) return;
    
    button.disabled = false;
    button.classList.remove(BUTTONS_EFFECTS_CONFIG.DISABLED_CLASS);
}; 