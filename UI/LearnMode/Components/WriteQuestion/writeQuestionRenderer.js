// Components/WriteQuestion/writeQuestionRenderer.js - DOM creation and rendering

// IMPORTS
import { createUITracer } from '../../Utils/uiTracer.js';
import { WRITE_QUESTION_CONFIG } from './writeQuestionComponent.js';
import { t } from '@UI/i18n/index.js';

// OPERATIONS
export const renderWriteQuestionToDOM = (container) => {
    const tracer = createUITracer('writeQuestionRenderer');

    // Guard clauses
    if (!container) {
        tracer.trace('renderWriteQuestion:noContainer');
        return false;
    }

    const targetArea = document.getElementById('hybridQuestionArea');
    if (!targetArea) {
        tracer.trace('renderWriteQuestion:noTargetArea');
        return false;
    }

    targetArea.innerHTML = '';
    targetArea.appendChild(container);

    // Autofocus on input
    const input = container.querySelector(`.${WRITE_QUESTION_CONFIG.INPUT_CLASS}`);
    if (input) {
        setTimeout(() => input.focus(), 100);
    }

    tracer.trace('renderWriteQuestion:success');
    return true;
};

export const createWriteQuestionContainer = (questionData, showHints = false) => {
    // Guard clauses
    if (!questionData) return null;

    const container = createElement('div', {
        id: WRITE_QUESTION_CONFIG.CONTAINER_ID,
        className: WRITE_QUESTION_CONFIG.CONTAINER_CLASS
    });

    appendWriteQuestionElements(container, questionData, showHints);

    return container;
};

// HELPERS
const appendWriteQuestionElements = (container, questionData, showHints) => {
    // Question text
    const questionText = createQuestionText(questionData.question);
    container.appendChild(questionText);

    // Hints (options) if showHints = true
    if (showHints && questionData.options?.length > 0) {
        const hintsContainer = createHintsContainer(questionData.options);
        container.appendChild(hintsContainer);
    }

    // Input container (input + button)
    const inputContainer = createInputContainer();
    container.appendChild(inputContainer);

    // Feedback element (for correct/incorrect messages)
    const feedbackElement = createFeedbackElement();
    container.appendChild(feedbackElement);

    // Example AFTER answers (like in LearnMode)
    const exampleElement = createExampleAfterAnswers(questionData.showExample);
    if (exampleElement) {
        container.appendChild(exampleElement);
    }
};

const createQuestionText = (text) => {
    return createElement('div', {
        className: WRITE_QUESTION_CONFIG.QUESTION_TEXT_CLASS,
        textContent: text
    });
};

const createHintsContainer = (options) => {
    const container = createElement('div', {
        className: WRITE_QUESTION_CONFIG.HINTS_CONTAINER_CLASS
    });

    // Hints title
    const title = createElement('div', {
        className: 'write-hints-title',
        textContent: 'Hints'
    });
    container.appendChild(title);

    // Options list
    const listContainer = createElement('div', {
        className: 'write-hints-list'
    });

    options.forEach((option) => {
        const hintItem = createElement('span', {
            className: WRITE_QUESTION_CONFIG.HINT_ITEM_CLASS,
            textContent: option
        });
        listContainer.appendChild(hintItem);
    });

    container.appendChild(listContainer);
    return container;
};

const createInputContainer = () => {
    const container = createElement('div', {
        className: WRITE_QUESTION_CONFIG.INPUT_CONTAINER_CLASS
    });

    const input = createElement('input', {
        type: 'text',
        className: WRITE_QUESTION_CONFIG.INPUT_CLASS,
        placeholder: t('learnMode.enterAnswer'),
        autocomplete: 'off',
        spellcheck: 'false'
    });

    const submitBtn = createElement('button', {
        className: WRITE_QUESTION_CONFIG.SUBMIT_BUTTON_CLASS,
        textContent: t('buttons.check')
    });

    container.appendChild(input);
    container.appendChild(submitBtn);

    return container;
};

const createFeedbackElement = () => {
    return createElement('div', {
        className: WRITE_QUESTION_CONFIG.FEEDBACK_CLASS
    });
};

const createExampleAfterAnswers = (showExample) => {
    // Guard clause
    if (!showExample?.text) return null;

    return createElement('div', {
        className: WRITE_QUESTION_CONFIG.EXAMPLE_CLASS,
        textContent: showExample.text
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
