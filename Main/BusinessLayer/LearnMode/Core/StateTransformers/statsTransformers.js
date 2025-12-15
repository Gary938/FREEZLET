// StateTransformers/statsTransformers.js - Statistics transformations

import { updateStats } from './baseTransformers.js';

// CONFIG
const STATS_CONFIG = {
    PERFECT_BLOCK_DEFAULT: true,
    IMPERFECT_BLOCK_VALUE: false
};

// TYPES
export const STATS_FIELDS = {
    ATTEMPTED: 'attempted',
    CORRECT: 'correct',
    PERFECT_BLOCK: 'perfectBlock'
};

// OPERATIONS
export const markQuestionAttempted = (state, questionId) => {
    // Use Array instead of Set for serialization
    const newAttempted = state.stats.attempted.includes(questionId)
        ? state.stats.attempted
        : [...state.stats.attempted, questionId];

    return updateStats(state, {
        attempted: newAttempted
    });
};

export const markQuestionCorrect = (state, questionId) => {
    // Use Array instead of Set for serialization
    const newCorrect = state.stats.correct.includes(questionId)
        ? state.stats.correct
        : [...state.stats.correct, questionId];

    return updateStats(state, {
        correct: newCorrect
    });
};

export const markBlockImperfect = (state) => {
    return updateStats(state, {
        perfectBlock: STATS_CONFIG.IMPERFECT_BLOCK_VALUE
    });
};

export const resetPerfectBlock = (state) => {
    return updateStats(state, {
        perfectBlock: STATS_CONFIG.PERFECT_BLOCK_DEFAULT
    });
}; 