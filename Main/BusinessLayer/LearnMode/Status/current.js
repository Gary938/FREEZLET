// Status/current.js - Current active test status

import { getCurrentState, clearState } from '../Core/stateManager.js';
import { createSuccessResult } from '../Core/errorHandler.js';
import { trace } from '../Utils/tracer.js';

// OPERATIONS
export const getTestStatus = () => {
    const state = getCurrentState();
    return state ? buildActiveTestStatus(state) : { hasActiveTest: false };
};

export const endTest = () => {
    trace('endTest');
    const clearedInfo = clearState();
    return createSuccessResult({ testEnded: true, ...clearedInfo });
};

// HELPERS
const buildActiveTestStatus = (state) => createSuccessResult({
    hasActiveTest: true,
    testId: state.id,
    stage: state.stage,
    progress: {
        totalQuestions: state.questions.all.length,
        attempted: state.stats.attempted.length,  // .length instead of .size
        correct: state.stats.correct.length,      // .length instead of .size
        currentBlock: state.meta.blockCount
    }
}); 