// ResponseBuilder/completionBuilder.js - Completion response building

import { createCompletionResponse } from '../../Config/responseTypes.js';
import { trace } from '../../Utils/tracer.js';

// OPERATIONS
export const buildCompletionResponse = (resultsData, additionalData = {}) => {
    trace('buildCompletion', { stage: resultsData.stage });
    
    return createCompletionResponse(resultsData, additionalData);
};

/**
 * Formats final test results
 * @param {Object} state - Test state
 * @param {Object} calculatedResults - Calculated results
 * @returns {Object} Formatted results for UI
 */
export const formatTestResults = (state, calculatedResults) => ({
    accuracy: calculatedResults.accuracy,
    stars: calculatedResults.stars,
    stage: state.stage,
    passed: calculatedResults.passed,
    totalQuestions: state.questions.all.length,
    correctAnswers: state.stats.correct.length,  // .length instead of .size
    testDuration: Date.now() - state.meta.startTime,
    perfectBlocks: calculatedResults.perfectBlocks || 0
}); 