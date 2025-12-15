// StateTransformers/questionTransformers.js - Question transformations

import { updateQuestions } from './baseTransformers.js';

// CONFIG
const QUESTION_CONFIG = {
    EMPTY_ARRAY: []
};

// TYPES
export const QUESTION_FIELDS = {
    ALL: 'all',
    REMAINING: 'remaining',
    CURRENT: 'current',
    INCORRECT: 'incorrect'
};

// OPERATIONS
export const addToCurrentBlock = (state, questions) => {
    return updateQuestions(state, {
        current: [...state.questions.current, ...questions]
    });
};

export const removeFromCurrentBlock = (state, questionId) => {
    const updatedCurrent = state.questions.current.filter(q => q.id !== questionId);
    
    return updateQuestions(state, {
        current: updatedCurrent
    });
};

export const addToIncorrect = (state, question) => {
    const hasQuestion = state.questions.incorrect.some(q => q.id === question.id);
    if (hasQuestion) return state;
    
    return updateQuestions(state, {
        incorrect: [...state.questions.incorrect, question]
    });
};

export const moveQuestionsFromRemainingToBlock = (state, questionsCount) => {
    const questionsToTake = Math.min(questionsCount, state.questions.remaining.length);
    const currentBlock = state.questions.remaining.slice(0, questionsToTake);
    const newRemaining = state.questions.remaining.slice(questionsToTake);
    
    return updateQuestions(state, {
        current: currentBlock,
        remaining: newRemaining
    });
}; 