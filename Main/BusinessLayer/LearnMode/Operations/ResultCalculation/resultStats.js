// ResultCalculation/resultStats.js - Test statistics calculation
//
// ACCURACY FORMAT: All functions in this file return accuracy as PERCENTAGES (0-100)
// Example: 85.5 means 85.5%
// When passing to getStarsForAccuracy() divide by 100 to get coefficient

import { trace } from '../../Utils/tracer.js';

// OPERATIONS
// @returns {number} accuracy - percentages (0-100), e.g. 85.5 = 85.5%
export const calculateTestStats = (state) => {
    const totalQuestions = state.questions.all.length;
    const attemptedQuestions = state.stats.attempted.length;  // .length instead of .size
    const correctAnswers = state.stats.correct.length;        // .length instead of .size

    // Accuracy in range 0-100
    const accuracy = attemptedQuestions > 0 ?
        (correctAnswers / attemptedQuestions) * 100 : 0;

    trace('statsCalculated', { totalQuestions, attemptedQuestions, correctAnswers, accuracy });

    return {
        totalQuestions,
        attemptedQuestions,
        correctAnswers,
        accuracy: Math.round(accuracy * 100) / 100,  // Round to 2 decimal places (already in percentages)
        testDuration: Date.now() - state.meta.startTime
    };
};

export const calculateAccuracy = (correct, total) => {
    if (total === 0) return 0;
    return Math.round((correct / total) * 100) / 100;
};

export const calculatePerfectBlocks = (state) => {
    return state.stats.perfectBlock ? 1 : 0;
};

export const calculateTotalBlocks = (state) =>
    state.meta.blockCount || 1;

// HELPERS
export const formatDuration = (milliseconds) => {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    
    return minutes > 0 ? 
        `${minutes}m ${remainingSeconds}s` : 
        `${remainingSeconds}s`;
}; 