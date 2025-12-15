// AnswerProcessing/answerValidation.js - Answer validation and processing coordination

import { ANSWER_TYPES } from '../../Config/responseTypes.js';
import { validateAnswerSubmission, validateTestState } from '../../Core/validator.js';
import { createErrorResult } from '../../Core/errorHandler.js';
import { getCurrentQuestion } from '../../Core/State/stateQueries.js';
import { trace } from '../../Utils/tracer.js';
import { executeAnswerLogic, getCurrentQuestionId } from './answerLogic.js';
import { applyStateTransformations } from './stateUpdater.js';

// OPERATIONS
export const processAnswer = (state, answer) => {
    trace('processAnswer', { answer, questionId: getCurrentQuestionId(state) });
    
    const validation = validateAnswerInput(state, answer);
    if (validation) return validation;
    
    const currentQuestion = getCurrentQuestion(state);
    if (!currentQuestion) {
        return createErrorResult('No current question', 'NO_CURRENT_QUESTION');
    }
    
    const answerContext = createAnswerContext(state, currentQuestion, answer);
    const updatedState = applyStateTransformations(
        state, 
        answerContext.questionId, 
        currentQuestion, 
        answerContext.isCorrect, 
        answerContext.isFirstAttempt
    );
    
    return executeAnswerLogic(updatedState, currentQuestion, answerContext.isCorrect, answerContext.isFirstAttempt);
};

export const validateAnswerInput = (state, answer) => {
    const validation = validateAnswerSubmission(answer, getCurrentQuestionId(state));
    if (validation) return validation;
    
    const stateValidation = validateTestState(state);
    if (stateValidation) return stateValidation;
    
    return null;
};

export const createAnswerContext = (state, question, answer) => ({
    questionId: question.id,
    isCorrect: answer === ANSWER_TYPES.CORRECT,
    isFirstAttempt: !state.stats.attempted.includes(question.id),  // .includes instead of .has
    answer
});

// HELPERS
export const isAnswerCorrect = (userAnswer, correctAnswer) => 
    userAnswer === correctAnswer; 