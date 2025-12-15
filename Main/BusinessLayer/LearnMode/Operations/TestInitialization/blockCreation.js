// TestInitialization/blockCreation.js - Question block formation

import { updateCurrentState, getCurrentState } from '../../Core/stateManager.js';
import { moveQuestionsFromRemainingToBlock, incrementBlockCount, resetPerfectBlock } from '../../Core/StateTransformers/index.js';
import { trace } from '../../Utils/tracer.js';

// CONFIG
const CONFIG = {
    MIN_QUESTIONS_PER_BLOCK: 1
};

// TYPES
const BLOCK_STATUS = {
    EMPTY: 'empty',
    FORMED: 'formed',
    ACTIVE: 'active'
};

// OPERATIONS
export const formFirstBlock = (state) => {
    trace('formFirstBlock', { remainingCount: state?.questions?.remaining?.length });
    
    if (!state?.questions?.remaining) return null;
    
    const blockParams = calculateBlockParams(state);
    if (!blockParams.valid) return null;
    
    return createNewBlock(state, blockParams);
};

export const getFirstQuestion = (state) => {
    if (!state?.questions?.current?.length) return null;
    return state.questions.current[0];
};

export const validateBlockSize = (state) => {
    if (!state?.questions?.remaining) return { valid: false, reason: 'No remaining questions' };
    
    const availableQuestions = state.questions.remaining.length;
    return {
        valid: availableQuestions >= CONFIG.MIN_QUESTIONS_PER_BLOCK,
        availableQuestions,
        minRequired: CONFIG.MIN_QUESTIONS_PER_BLOCK
    };
};

// HELPERS
const calculateBlockParams = (state) => {
    const blockSize = state.meta.blockSize;
    const questionsToTake = Math.min(blockSize, state.questions.remaining.length);
    
    return {
        valid: questionsToTake >= CONFIG.MIN_QUESTIONS_PER_BLOCK,
        questionsToTake,
        blockSize
    };
};

const createNewBlock = (state, blockParams) => {
    let newState = moveQuestionsFromRemainingToBlock(state, blockParams.questionsToTake);
    newState = incrementBlockCount(newState);
    newState = resetPerfectBlock(newState);  // Reset perfectBlock for new block

    updateCurrentState(newState);
    
    const currentBlock = newState.questions.current;
    
    trace('blockCreated', { 
        blockSize: currentBlock.length,
        remaining: newState.questions.remaining.length,
        status: BLOCK_STATUS.FORMED
    });
    
    return currentBlock;
}; 