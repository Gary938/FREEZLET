// Components/Question/questionHandlers.js - Event handling and interaction

// IMPORTS
import { createUITracer } from '../../Utils/uiTracer.js';
import { QUESTION_CONFIG } from './questionComponent.js';
import { applyRandomEffect } from '../Assets/Buttons/applyEffectSystem.js';
import { generatePacmanCommand } from '../Pacman/PacmanLogic/index.js';

// OPERATIONS
export const attachAnswerHandlers = (container, questionData, onAnswerClick = null) => {
    const tracer = createUITracer('questionHandlers');
    
    // Guard clauses
    if (!container || !questionData) return false;
    
    const answerButtons = container.querySelectorAll(`.${QUESTION_CONFIG.ANSWER_OPTION_CLASS}`);
    
    answerButtons.forEach((button, index) => {
        button.addEventListener('click', (event) => {
            handleAnswerClick(event, index, questionData.correctAnswer, questionData, onAnswerClick);
        });
    });
    
    tracer.trace('attachHandlers:success', { buttonsCount: answerButtons.length });
    return true;
};

// HELPERS
const handleAnswerClick = async (event, selectedIndex, correctAnswer, questionData, onAnswerClick = null) => {
    const tracer = createUITracer('questionHandlers');
    const container = event.target.closest('.learn-mode-question');
    
    const attempts = incrementAttempts(container);
    const isCorrect = selectedIndex === correctAnswer;
    const allButtons = container.querySelectorAll(`.${QUESTION_CONFIG.ANSWER_OPTION_CLASS}`);
    
    tracer.trace('handleAnswer', { selectedIndex, correctAnswer, isCorrect, attempts });
    
    if (isCorrect) {
        await processCorrectAnswer(event.target, allButtons, attempts, questionData, onAnswerClick);
    } else {
        await processIncorrectAnswer(event.target);
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

const processCorrectAnswer = async (button, allButtons, attempts, questionData, onAnswerClick) => {
    disableAllButtons(allButtons);
    await applyRandomEffect(button, true);
    
    // 🎯 FIXED: pacman movement with same logic as callback
    const result = attempts === 1 ? 'correct' : 'incorrect';
    movePacmanBasedOnResult(result, questionData);
    
    scheduleNextQuestion(button, attempts, questionData, onAnswerClick);
};

const processIncorrectAnswer = async (button) => {
    await applyRandomEffect(button, false);
};

const disableAllButtons = (allButtons) => {
    allButtons.forEach(btn => {
        btn.disabled = true;
        btn.classList.add('disabled');
    });
};

const scheduleNextQuestion = (button, attempts, questionData, onAnswerClick) => {
    setTimeout(() => {
        if (onAnswerClick && typeof onAnswerClick === 'function') {
            const callbackData = createCallbackData(button, attempts, questionData);
            executeCallback(onAnswerClick, callbackData);
        }
    }, QUESTION_CONFIG.CORRECT_ANSWER_DELAY);
};

const createCallbackData = (button, attempts, questionData) => {
    const result = attempts === 1 ? 'correct' : 'incorrect';
    return { result };
};

const executeCallback = (onAnswerClick, callbackData) => {
    const tracer = createUITracer('questionHandlers');

    try {
        onAnswerClick(callbackData.result);
    } catch (error) {
        tracer.trace('correctAnswer:callbackError', { error: error.message });
    }
};

const movePacmanBasedOnResult = (result, questionData) => {
    const tracer = createUITracer('questionHandlers');
    
    // Find pacman component in DOM
    const pacmanContainer = document.querySelector('[data-component="pacman"]');
    if (!pacmanContainer?.pacmanComponent) {
        tracer.trace('pacman:notFound');
        return;
    }
    
    // Generate command based on same result sent to business layer
    const command = generatePacmanCommand(result, questionData?.id);
    if (!command) {
        tracer.trace('pacman:commandGenerationFailed', { result });
        return;
    }
    
    // Execute command (move for 'correct', stay for 'incorrect')
    const success = pacmanContainer.pacmanComponent.processCommand(command);
    tracer.trace('pacman:commandExecuted', { result, action: command.action, success, questionId: questionData?.id });
}; 