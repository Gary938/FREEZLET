// BlockBuilder/blockFormation.js - Block creation and formation

import { getBlockSize } from '../../../Config/stageConfig.js';
import { createSuccessResult } from '../../../Core/errorHandler.js';
import { trace } from '../../../Utils/tracer.js';
import { collectQuestionsForBlock } from './questionCollector.js';
import { updateBlockState, createBlockResult, createCompletionResult } from './stateUpdater.js';
import { isTestCompleted } from '../../../Core/State/stateQueries.js';

// OPERATIONS
export const formNextBlock = (state) => {
    trace('formNextBlock', { 
        remaining: state.questions.remaining.length,
        incorrect: state.questions.incorrect.length 
    });
    
    if (isTestCompleted(state)) {
        return createCompletionResult();
    }
    
    const blockResult = createBlock(state);
    if (!blockResult.block.length) {
        return createCompletionResult();
    }
    
    const finalState = updateBlockState(blockResult.updatedState, blockResult.block);
    
    return createBlockResult(blockResult.block, finalState);
};

export const createBlock = (state) => {
    const blockSize = getBlockSize(state.stage);
    const result = collectQuestionsForBlock(state, blockSize);
    
    trace('createBlock', { 
        targetSize: blockSize, 
        actualSize: result.block.length 
    });
    
    return result;
};

// isTestCompleted is imported from stateQueries.js 