// AnswerProcessing/stateUpdater.js - State and statistics update

import { markQuestionAttempted, markQuestionCorrect, removeFromCurrentBlock, addToIncorrect, markBlockImperfect as markBlockImperfectImmutable } from '../../Core/StateTransformers/index.js';
import { trace } from '../../Utils/tracer.js';

// OPERATIONS
export const updateAnswerStatistics = (state, questionId, isCorrect, isFirstAttempt) => {
    let newState = updateQuestionStats(state, questionId, isCorrect, isFirstAttempt);
    newState = removeQuestionFromBlock(newState, questionId);
    return newState;
};

export const processAnswerConsequences = (state, question, isCorrect, isFirstAttempt) => {
    if (isCorrect) return state;

    let newState = addToIncorrectQueue(state, question);

    // perfectBlock breaks ONLY on first attempt (not on repeats)
    if (isFirstAttempt) {
        newState = markBlockImperfect(newState);
    }

    return newState;
};

// Updates statistics only for first attempts (this is intentional)
// Repeat attempts (from incorrect) don't affect accuracy calculation
export const updateQuestionStats = (state, questionId, isCorrect, isFirstAttempt) => {
    if (!isFirstAttempt) return state;

    let newState = markQuestionAttempted(state, questionId);
    if (isCorrect) {
        newState = markQuestionCorrect(newState, questionId);
    }

    trace('questionStatsUpdated', { questionId, isCorrect, isFirstAttempt });
    return newState;
};

export const removeQuestionFromBlock = (state, questionId) => {
    const updatedState = removeFromCurrentBlock(state, questionId);
    trace('questionRemovedFromBlock', { questionId });
    return updatedState;
};

export const addToIncorrectQueue = (state, question) => {
    const updatedState = addToIncorrect(state, question);
    trace('questionAddedToIncorrect', { questionId: question.id });
    return updatedState;
};

export const markBlockImperfect = (state) => {
    const updatedState = markBlockImperfectImmutable(state);
    trace('blockMarkedImperfect', { blockNumber: state.meta.blockCount });
    return updatedState;
};

// HELPERS
export const applyStateTransformations = (state, questionId, question, isCorrect, isFirstAttempt) => {
    let newState = updateAnswerStatistics(state, questionId, isCorrect, isFirstAttempt);
    newState = processAnswerConsequences(newState, question, isCorrect, isFirstAttempt);
    return newState;
}; 