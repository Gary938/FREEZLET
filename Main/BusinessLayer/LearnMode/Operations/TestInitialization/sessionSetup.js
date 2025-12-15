// TestInitialization/sessionSetup.js - Test session setup

import { createState, getCurrentState } from '../../Core/stateManager.js';
import { validateTestStart } from '../../Core/validator.js';
import { createSuccessResult } from '../../Core/errorHandler.js';
import { trace } from '../../Utils/tracer.js';
import { initializePacman } from './pacmanInitializer.js';

// CONFIG
const CONFIG = {
    DEFAULT_SESSION_TIMEOUT: 3600000, // 1 hour
    MIN_STAGE: 0,
    MAX_STAGE: 3
};

// TYPES
const SESSION_STATUS = {
    CREATED: 'created',
    ACTIVE: 'active',
    COMPLETED: 'completed'
};

// OPERATIONS
export const initializeTestSession = async (testPath, stage, questions) => {
    trace('initializeTestSession', { testPath, stage, questionsCount: questions.length });
    
    const validation = validateTestStart(testPath, stage);
    if (validation) return validation;
    
    return setupNewSession(questions, stage, testPath);
};

export const getTestMetadata = (state) => {
    if (!state) return null;
    
    return {
        id: state.id,
        stage: state.stage,
        totalQuestions: state.questions.all.length,
        blockSize: state.meta.blockSize,
        startTime: state.meta.startTime,
        status: SESSION_STATUS.ACTIVE
    };
};

export const createSessionInfo = (questions, stage) => ({
    totalQuestions: questions.length,
    stage,
    startTime: Date.now(),
    timeout: CONFIG.DEFAULT_SESSION_TIMEOUT
});

// HELPERS
const setupNewSession = (questions, stage, testPath) => {
    const state = createState(questions, stage, testPath);
    const pacmanCommand = initializePacman(questions);
    
    return createSuccessResult({
        state,
        sessionInfo: createSessionInfo(questions, stage),
        pacmanCommand
    });
}; 