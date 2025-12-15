// Components/Question/questionComponent.js - Question component main API

// IMPORTS
import { createUITracer } from '../../Utils/uiTracer.js';
import { UI_CSS_CLASSES } from '../../Config/uiTypes.js';
import { createQuestionContainer, renderQuestionToDOM } from './questionRenderer.js';
import { attachAnswerHandlers } from './questionHandlers.js';

// CONFIG
export const QUESTION_CONFIG = {
    MAX_OPTIONS: 4,
    QUESTION_CONTAINER_ID: 'learnModeQuestion',
    OPTIONS_CONTAINER_CLASS: 'answer-options',
    QUESTION_TEXT_CLASS: 'question-text',
    ANSWER_OPTION_CLASS: 'answer-option',
    EXAMPLE_CLASS: 'question-example',
    CORRECT_ANSWER_DELAY: 900
};

// OPERATIONS
export const createQuestionComponent = (questionData, onAnswerClick = null) => {
    const tracer = createUITracer('questionComponent');
    
    // Guard clauses
    if (!questionData || !questionData.question || !questionData.options) {
        tracer.trace('createQuestion:invalidData');
        return null;
    }
    
    const questionContainer = createQuestionContainer(questionData);
    attachAnswerHandlers(questionContainer, questionData, onAnswerClick);
    
    tracer.trace('createQuestion:success', { 
        componentCreated: true,
        optionsCount: questionData.options.length
    });
    
    return {
        element: questionContainer,
        render: () => renderQuestionToDOM(questionContainer),
        cleanup: () => cleanupQuestion(questionContainer),
        updateData: (newData) => updateQuestionData(questionContainer, newData)
    };
};

export const cleanupQuestion = (container) => {
    if (container?.parentNode) {
        container.parentNode.removeChild(container);
    }
};

export const updateQuestionData = (container, newData) => {
    if (!container || !newData) return false;
    
    const newContainer = createQuestionContainer(newData);
    container.replaceWith(newContainer);
    return true;
}; 