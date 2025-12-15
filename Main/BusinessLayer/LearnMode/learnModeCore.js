// learnModeCore.js - LearnMode coordinator

import { initializeTest } from './Operations/TestInitialization/index.js';
import { processAnswer } from './Operations/AnswerProcessing/index.js';
import { getNextQuestion } from './Operations/BlockManagement/index.js';
import { buildQuestionResponse } from './Core/ResponseBuilder/index.js';
import { getCurrentState, updateCurrentState } from './Core/stateManager.js';
import { validateTestState } from './Core/validator.js';
import { handleError, createErrorResult } from './Core/errorHandler.js';
import { trace } from './Utils/tracer.js';
import { loadTestStage } from './DB/testProgress.js';
import { completeTest, completeBlock } from './Flows/completion.js';
import { getTestStatus, endTest } from './Status/current.js';
import { getBackgroundState } from './Interactive/Background/index.js';

// STATE LOCK - prevents race conditions
// Promise-based mutex for reliable locking on parallel calls
let isProcessingAnswer = false;
let answerQueue = Promise.resolve();

// OPERATIONS
export const startTest = async (testPath, stage = null) => {
    trace('startTest', { testPath, stage });
    
    const finalStage = stage ?? loadTestStage(testPath);
    
    try {
        const initResult = await initializeTest(testPath, finalStage);
        if (initResult.success) {
            const extensions = {};
            if (initResult.data.pacmanCommand) {
                extensions.pacman = initResult.data.pacmanCommand;
            }
            
            // 🖼️ AUTOMATIC BACKGROUND SENDING ON START
            const backgroundResult = getBackgroundState();
            if (backgroundResult.success) {
                extensions.background = {
                    currentPath: backgroundResult.data.backgroundPath || '',
                    mode: backgroundResult.data.mode || 'random'
                };
                trace('backgroundLoaded', { 
                    path: backgroundResult.data.backgroundPath, 
                    mode: backgroundResult.data.mode 
                });
            }
            
            return buildQuestionResponse(initResult.data.firstQuestion, extensions);
        }
        return initResult;
    } catch (error) {
        return handleError(error, 'test initialization');
    }
};

export const submitAnswer = async (answer) => {
    trace('submitAnswer', { answer });

    // Promise-based mutex: guarantees sequential answer processing
    // Even with parallel calls, each answer will be processed in order
    const processThis = answerQueue.then(async () => {
        // Double check with flag for fast rejection
        if (isProcessingAnswer) {
            trace('submitAnswer:blocked', { reason: 'already processing' });
            return createErrorResult('Answer is already being processed', 'ANSWER_PROCESSING_LOCKED');
        }

        isProcessingAnswer = true;

        try {
            const state = getCurrentState();
            const stateValidation = validateTestState(state);
            if (stateValidation) return stateValidation;

            const answerResult = processAnswer(state, answer);
            if (!answerResult.success) return answerResult;

            if (answerResult.data.updatedState) {
                updateCurrentState(answerResult.data.updatedState);
            }

            return await routeAnswerResult(answerResult.data.updatedState || state, answerResult.data);
        } finally {
            isProcessingAnswer = false;
        }
    });

    // Update queue for next call
    answerQueue = processThis.catch(() => {});

    return processThis;
};

export { getTestStatus, endTest };

// HELPERS
const routeAnswerResult = async (state, answerData) => {
    const { blockCompleted, testCompleted } = answerData;
    
    if (testCompleted) return await completeTest(state);
    if (blockCompleted) return await completeBlock(state);
    
    return buildQuestionResponse(getNextQuestion(state));
}; 