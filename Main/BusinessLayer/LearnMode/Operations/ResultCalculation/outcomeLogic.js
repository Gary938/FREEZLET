// ResultCalculation/outcomeLogic.js - Test result determination

import { calculateProgress } from '../../Config/stageConfig.js';

// OPERATIONS
export const determineTestOutcome = (accuracy, stage) => {
    const progress = calculateProgress(stage, accuracy);
    
    return {
        passed: progress.passed,
        stars: progress.stars,
        message: getOutcomeMessage(progress.passed, progress.stars)
    };
};

export const shouldAdvanceStage = (results) => {
    return results.passed && results.stars >= 2;
};

export const getNextStage = (currentStage) => {
    return Math.min(currentStage + 1, 3);
};

export const getOutcomeMessage = (passed, stars) => {
    if (!passed) return 'Test not passed';
    if (stars === 3) return 'Excellent result!';
    if (stars === 2) return 'Good result!';
    if (stars === 1) return 'Test passed';
    return 'Test completed';
};

export const getPerformanceLevel = (accuracy) => {
    if (accuracy >= 0.9) return 'excellent';
    if (accuracy >= 0.8) return 'good';
    if (accuracy >= 0.6) return 'satisfactory';
    return 'poor';
};

export const evaluateTestCompletion = (state, stats) => {
    const outcome = determineTestOutcome(stats.accuracy, state.stage);
    const performanceLevel = getPerformanceLevel(stats.accuracy / 100);
    
    return {
        ...outcome,
        performanceLevel,
        nextStage: outcome.passed ? getNextStage(state.stage) : state.stage,
        canAdvance: shouldAdvanceStage(outcome)
    };
}; 