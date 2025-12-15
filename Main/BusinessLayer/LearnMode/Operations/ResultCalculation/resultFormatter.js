// ResultCalculation/resultFormatter.js - Result formatting

import { calculateProgress } from '../../Config/stageConfig.js';
import { calculateTestStats, calculateTotalBlocks } from './resultStats.js';
import { getNextStage } from './outcomeLogic.js';
import { determineResultVideo } from './videoSelector.js';
import { createSuccessResult } from '../../Core/errorHandler.js';
import { trace } from '../../Utils/tracer.js';
import { testProgressOperations } from '../../../DB/testProgressOperations.js';

// OPERATIONS
export const calculateFinalResults = (state, testPath = null) => {
    trace('calculateResults', { 
        stage: state.stage,
        totalQuestions: state.questions.all.length 
    });
    
    const stats = calculateTestStats(state);
    const progress = calculateProgress(state.stage, stats.accuracy);
    const results = formatResults(state, stats, progress, testPath);
    
    return createSuccessResult(results);
};

export const formatResults = (state, stats, progress, testPath = null) => {
    const baseResults = createBaseResults(state, stats, testPath);
    const progressResults = createProgressResults(progress);
    const metadataResults = createMetadataResults(state, stats, testPath);

    return { ...baseResults, ...progressResults, ...metadataResults };
};

// HELPERS
const createBaseResults = (state, stats, testPath = null) => ({
    testId: state.id,
    testPath: testPath,
    stage: state.stage,
    currentStage: state.stage,
    accuracy: stats.accuracy,
    correctCount: stats.correctAnswers,
    totalCount: stats.totalQuestions
});

const createProgressResults = (progress) => ({
    nextStage: progress.passed ? getNextStage(progress.stage || 0) : (progress.stage || 0),
    stars: progress.stars,
    passed: progress.passed,
    resultVideo: determineResultVideo(progress.passed, progress.stars)
});

const createMetadataResults = (state, stats, testPath) => {
    // Get current attempts count from DB (+1 for current attempt)
    let currentAttempt = 1;
    try {
        const progress = testPath ? testProgressOperations.getProgress(testPath) : null;
        currentAttempt = (progress?.attempts || 0) + 1;
    } catch (error) {
        trace('getProgressError', { testPath, error: error.message });
    }

    return {
        elapsedTimeSeconds: Math.round(stats.testDuration / 1000),
        blocks: calculateTotalBlocks(state),
        wasIdealLastBlock: state.stats.perfectBlock || false,
        completedAt: new Date().toISOString(),
        attempts: currentAttempt
    };
}; 