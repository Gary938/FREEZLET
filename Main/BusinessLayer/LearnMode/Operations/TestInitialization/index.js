// TestInitialization/index.js - Centralized API for test initialization

import { loadAndParseQuestions, validateTestFile } from './fileHandling.js';
import { initializeTestSession, getTestMetadata, createSessionInfo } from './sessionSetup.js';
import { formFirstBlock, getFirstQuestion, validateBlockSize } from './blockCreation.js';
import { createSuccessResult } from '../../Core/errorHandler.js';
import { getCurrentState } from '../../Core/stateManager.js';
import { trace } from '../../Utils/tracer.js';

// OPERATIONS
export const initializeTest = async (testPath, stage) => {
    trace('initializeTest', { testPath, stage });
    
    const questions = await loadAndParseQuestions(testPath);
    if (!questions.success) return questions;
    
    const sessionResult = await initializeTestSession(testPath, stage, questions.data);
    if (!sessionResult.success) return sessionResult;
    
    return setupCompleteSession(
        sessionResult.data.state, 
        questions.data, 
        stage, 
        sessionResult.data.pacmanCommand
    );
};

export const setupCompleteSession = (state, questions, stage, pacmanCommand = null) => {
    const firstBlock = formFirstBlock(state);

    // Check for block formation error
    if (!firstBlock) {
        return { success: false, error: 'Failed to form first question block' };
    }

    const updatedState = getCurrentState();
    const firstQuestion = getFirstQuestion(updatedState);
    
    const result = {
        state: updatedState,
        firstQuestion,
        totalQuestions: questions.length,
        stage
    };
    
    if (pacmanCommand) {
        result.pacmanCommand = pacmanCommand;
    }
    
    return createSuccessResult(result);
};

// MODULE EXPORTS
export { loadAndParseQuestions, validateTestFile } from './fileHandling.js';
export { initializeTestSession, getTestMetadata, createSessionInfo } from './sessionSetup.js';
export { formFirstBlock, getFirstQuestion, validateBlockSize } from './blockCreation.js';
export { initializePacman } from './pacmanInitializer.js'; 