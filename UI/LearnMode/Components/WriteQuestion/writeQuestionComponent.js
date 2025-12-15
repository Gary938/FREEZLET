// Components/WriteQuestion/writeQuestionComponent.js - Answer input component main API

// IMPORTS
import { createUITracer } from '../../Utils/uiTracer.js';
import { createWriteQuestionContainer, renderWriteQuestionToDOM } from './writeQuestionRenderer.js';
import { attachWriteAnswerHandlers } from './writeQuestionHandlers.js';

// CONFIG
export const WRITE_QUESTION_CONFIG = {
    CONTAINER_ID: 'writeQuestionContainer',
    CONTAINER_CLASS: 'learn-mode-question',  // Use same class as LearnMode for styles
    QUESTION_TEXT_CLASS: 'question-text',
    HINTS_CONTAINER_CLASS: 'write-hints-container',
    HINT_ITEM_CLASS: 'write-hint-item',
    INPUT_CONTAINER_CLASS: 'write-input-form',
    INPUT_CLASS: 'write-answer-input',
    SUBMIT_BUTTON_CLASS: 'write-submit-btn',
    FEEDBACK_CLASS: 'write-feedback',
    EXAMPLE_CLASS: 'question-example',
    CORRECT_ANSWER_DELAY: 900
};

// OPERATIONS
export const createWriteQuestionComponent = (questionData, onAnswerSubmit = null, options = {}) => {
    const tracer = createUITracer('writeQuestionComponent');
    const { showHints = false } = options;

    // Guard clauses
    if (!questionData || !questionData.question) {
        tracer.trace('createWriteQuestion:invalidData');
        return null;
    }

    const container = createWriteQuestionContainer(questionData, showHints);
    attachWriteAnswerHandlers(container, questionData, onAnswerSubmit);

    tracer.trace('createWriteQuestion:success', {
        componentCreated: true,
        showHints
    });

    return {
        element: container,
        render: () => renderWriteQuestionToDOM(container),
        cleanup: () => cleanupWriteQuestion(container),
        focus: () => focusInput(container)
    };
};

// HELPERS
const cleanupWriteQuestion = (container) => {
    if (container?.parentNode) {
        container.parentNode.removeChild(container);
    }
};

const focusInput = (container) => {
    const input = container?.querySelector(`.${WRITE_QUESTION_CONFIG.INPUT_CLASS}`);
    if (input) {
        input.focus();
    }
};
