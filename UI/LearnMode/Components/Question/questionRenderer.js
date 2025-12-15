// Components/Question/questionRenderer.js - Question DOM creation and rendering

// IMPORTS
import { createUITracer } from '../../Utils/uiTracer.js';
import { QUESTION_CONFIG } from './questionComponent.js';

// OPERATIONS
export const renderQuestionToDOM = (container) => {
    const tracer = createUITracer('questionRenderer');
    
    // Guard clauses
    if (!container) {
        tracer.trace('renderQuestion:noContainer');
        return false;
    }
    
    const targetArea = document.getElementById('hybridQuestionArea');
    if (!targetArea) {
        tracer.trace('renderQuestion:noTargetArea');
        return false;
    }
    
    targetArea.innerHTML = '';
    targetArea.appendChild(container);
    
    tracer.trace('renderQuestion:success');
    return true;
};

export const createQuestionContainer = (questionData) => {
    // Guard clauses
    if (!questionData) return null;
    
    const container = createElement('div', {
        id: QUESTION_CONFIG.QUESTION_CONTAINER_ID,
        className: 'learn-mode-question'
    });
    
    appendQuestionElements(container, questionData);
    
    return container;
};

// HELPERS
const appendQuestionElements = (container, questionData) => {
    const questionText = createQuestionText(questionData.question);
    const optionsContainer = createOptionsContainer(questionData.options);
    
    container.appendChild(questionText);
    container.appendChild(optionsContainer);
    
    // Example AFTER answers (like in old UI)
    const exampleElement = createExampleAfterAnswers(questionData.showExample);
    if (exampleElement) {
        container.appendChild(exampleElement);
    }
};

const createQuestionText = (text) => {
    return createElement('div', {
        className: QUESTION_CONFIG.QUESTION_TEXT_CLASS,
        textContent: text
    });
};

const createExampleAfterAnswers = (showExample) => {
    // Guard clause
    if (!showExample?.text) return null;
    
    return createElement('div', {
        className: QUESTION_CONFIG.EXAMPLE_CLASS,
        textContent: showExample.text
    });
};

const createOptionsContainer = (options) => {
    const container = createElement('div', {
        className: QUESTION_CONFIG.OPTIONS_CONTAINER_CLASS
    });
    
    options.forEach((option, index) => {
        const optionElement = createOptionElement(option, index);
        container.appendChild(optionElement);
    });
    
    return container;
};

const createOptionElement = (option, index) => {
    return createElement('button', {
        className: QUESTION_CONFIG.ANSWER_OPTION_CLASS,
        textContent: option,
        'data-index': index
    });
};

const createElement = (tagName, attributes = {}) => {
    const element = document.createElement(tagName);
    
    Object.entries(attributes).forEach(([key, value]) => {
        if (key === 'textContent') {
            element.textContent = value;
        } else if (key === 'className') {
            element.className = value;
        } else {
            element.setAttribute(key, value);
        }
    });
    
    return element;
}; 