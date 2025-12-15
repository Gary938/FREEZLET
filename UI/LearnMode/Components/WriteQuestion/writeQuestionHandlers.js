// Components/WriteQuestion/writeQuestionHandlers.js - Answer input event handling

// IMPORTS
import { createUITracer } from '../../Utils/uiTracer.js';
import { compareTextAnswers, isEmptyAnswer } from '../../Utils/answerComparison.js';
import { WRITE_QUESTION_CONFIG } from './writeQuestionComponent.js';
import { generatePacmanCommand } from '../Pacman/PacmanLogic/index.js';
import { t } from '@UI/i18n/index.js';

// OPERATIONS
export const attachWriteAnswerHandlers = (container, questionData, onAnswerSubmit = null) => {
    const tracer = createUITracer('writeQuestionHandlers');

    // Guard clauses
    if (!container || !questionData) return false;

    const inputField = container.querySelector(`.${WRITE_QUESTION_CONFIG.INPUT_CLASS}`);
    const submitBtn = container.querySelector(`.${WRITE_QUESTION_CONFIG.SUBMIT_BUTTON_CLASS}`);

    if (!inputField || !submitBtn) {
        tracer.trace('attachHandlers:elementsNotFound');
        return false;
    }

    const handleSubmit = () => {
        handleWriteAnswerSubmit(container, inputField, questionData, onAnswerSubmit);
    };

    // Button click
    submitBtn.addEventListener('click', handleSubmit);

    // Enter in input
    inputField.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSubmit();
        }
    });

    tracer.trace('attachHandlers:success');
    return true;
};

// HELPERS
const handleWriteAnswerSubmit = (container, inputField, questionData, onAnswerSubmit) => {
    const tracer = createUITracer('writeQuestionHandlers');
    const userAnswer = inputField.value;

    // Empty answer check
    if (isEmptyAnswer(userAnswer)) {
        showFeedback(container, t('learnMode.enterAnswer'), 'empty');
        shakeInput(inputField);
        return;
    }

    const attempts = incrementAttempts(container);

    // correctAnswer - this is INDEX in options array, not text!
    const correctAnswerText = questionData.options[questionData.correctAnswer];
    const isCorrect = compareTextAnswers(userAnswer, correctAnswerText);

    tracer.trace('handleSubmit', { userAnswer, correctAnswerText, isCorrect, attempts });

    if (isCorrect) {
        processCorrectWriteAnswer(container, inputField, attempts, questionData, onAnswerSubmit);
    } else {
        processIncorrectWriteAnswer(container, inputField);
    }
};

const incrementAttempts = (container) => {
    if (!container.dataset.attempts) {
        container.dataset.attempts = '0';
    }
    const attempts = parseInt(container.dataset.attempts) + 1;
    container.dataset.attempts = attempts.toString();
    return attempts;
};

const processCorrectWriteAnswer = (container, inputField, attempts, questionData, onAnswerSubmit) => {
    const tracer = createUITracer('writeQuestionHandlers');

    // Disable input and button
    disableInput(container);

    // Show feedback
    showFeedback(container, t('learnMode.correct'), 'correct');

    // Add success class to input
    inputField.classList.add('correct');

    // Result: first attempt = correct, repeated = incorrect
    const result = attempts === 1 ? 'correct' : 'incorrect';

    // Pacman movement
    movePacmanBasedOnResult(result, questionData);

    // Call callback after delay
    setTimeout(() => {
        if (onAnswerSubmit && typeof onAnswerSubmit === 'function') {
            try {
                onAnswerSubmit(result);
            } catch (error) {
                tracer.trace('correctAnswer:callbackError', { error: error.message });
            }
        }
    }, WRITE_QUESTION_CONFIG.CORRECT_ANSWER_DELAY);
};

const processIncorrectWriteAnswer = (container, inputField) => {
    // Show feedback
    showFeedback(container, t('learnMode.incorrectTryAgain'), 'incorrect');

    // Shake animation
    shakeInput(inputField);

    // Add temporary error class
    inputField.classList.add('incorrect');
    setTimeout(() => inputField.classList.remove('incorrect'), 500);

    // Select text for quick correction
    inputField.select();
};

const showFeedback = (container, message, type) => {
    const feedbackElement = container.querySelector(`.${WRITE_QUESTION_CONFIG.FEEDBACK_CLASS}`);
    if (feedbackElement) {
        feedbackElement.textContent = message;
        feedbackElement.className = `${WRITE_QUESTION_CONFIG.FEEDBACK_CLASS} ${type}`;
    }
};

const shakeInput = (inputField) => {
    inputField.classList.add('shake');
    setTimeout(() => inputField.classList.remove('shake'), 500);
};

const disableInput = (container) => {
    const inputField = container.querySelector(`.${WRITE_QUESTION_CONFIG.INPUT_CLASS}`);
    const submitBtn = container.querySelector(`.${WRITE_QUESTION_CONFIG.SUBMIT_BUTTON_CLASS}`);

    if (inputField) {
        inputField.disabled = true;
        inputField.classList.add('disabled');
    }
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.classList.add('disabled');
    }
};

const movePacmanBasedOnResult = (result, questionData) => {
    const tracer = createUITracer('writeQuestionHandlers');

    // Find pacman component in DOM
    const pacmanContainer = document.querySelector('[data-component="pacman"]');
    if (!pacmanContainer?.pacmanComponent) {
        tracer.trace('pacman:notFound');
        return;
    }

    // Generate command based on result
    const command = generatePacmanCommand(result, questionData?.id);
    if (!command) {
        tracer.trace('pacman:commandGenerationFailed', { result });
        return;
    }

    // Execute command
    const success = pacmanContainer.pacmanComponent.processCommand(command);
    tracer.trace('pacman:commandExecuted', { result, action: command.action, success, questionId: questionData?.id });
};
