// DB/testProgress.js - Working with test progress in DB

import { testProgressOperations } from '../../DB/testProgressOperations.js';
import { getNextStage } from '../Operations/ResultCalculation/index.js';
import { trace } from '../Utils/tracer.js';

// OPERATIONS
export const loadTestStage = (testPath) => {
    const progressData = testProgressOperations.getProgress(testPath);
    const stage = progressData.success ? progressData.stage : 0;
    
    trace('loadProgress', { 
        testPath, 
        loadedStage: stage, 
        progressFound: progressData.success 
    });
    
    return stage;
};

export const saveTestResults = async (resultsData, testPath) => {
    if (!testPath) {
        return { success: false, error: 'No test path provided' };
    }

    // Get current data from DB to preserve stars on FAIL
    const currentProgress = testProgressOperations.getProgress(testPath);
    const progressData = buildProgressData(resultsData, currentProgress);

    try {
        await testProgressOperations.updateProgress(testPath, progressData);
        await testProgressOperations.incrementAttempts(testPath);
        trace('progressSaved', { progressData, passed: resultsData.passed });
        return { success: true, data: progressData };
    } catch (error) {
        trace('progressSaveError', { error: error.message });
        return { success: false, error: error.message };
    }
};

// HELPERS
// On PASS: move to next stage with new stars
// On FAIL: ROLLBACK to previous stage, stars = stage (always synchronized)
const buildProgressData = (resultsData, currentProgress = {}) => {
    if (resultsData.passed) {
        return {
            stage: getNextStage(resultsData.stage),
            stars: resultsData.stars,
            percentage: Math.round(resultsData.accuracy)
        };
    }

    // FAIL: rollback stage to previous (but not less than 0)
    // stars = stage (always synchronized)
    const previousStage = Math.max(0, resultsData.stage - 1);
    trace('stageFallback', {
        fromStage: resultsData.stage,
        toStage: previousStage,
        newStars: previousStage
    });

    return {
        stage: previousStage,
        stars: previousStage,
        percentage: Math.round(resultsData.accuracy)
    };
}; 