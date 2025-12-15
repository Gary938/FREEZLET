// BlockBuilder/stateUpdater.js - Block state update

import { createSuccessResult } from '../../../Core/errorHandler.js';
import { updateQuestions as updateQuestionsImmutable, incrementBlockCount, resetPerfectBlock } from '../../../Core/StateTransformers/index.js';
import { trace } from '../../../Utils/tracer.js';

// TYPES
const RESULT_TYPES = {
    COMPLETION: 'completion',
    BLOCK_READY: 'blockReady'
};

// OPERATIONS
export const updateBlockState = (state, newBlock) => {
    let updatedState = updateQuestionsImmutable(state, {
        current: newBlock
    });
    
    updatedState = incrementBlockCount(updatedState);
    updatedState = resetPerfectBlock(updatedState);
    
    trace('blockStateUpdated', {
        blockNumber: updatedState.meta.blockCount,
        blockSize: newBlock.length
    });
    
    return updatedState;
};

export const createCompletionResult = () => createSuccessResult({ 
    hasNextBlock: false, 
    testCompleted: true 
});

export const createBlockResult = (block, finalState) => createSuccessResult({
    hasNextBlock: true,
    blockSize: block.length,
    blockNumber: finalState.meta.blockCount,
    firstQuestion: block[0],
    updatedState: finalState
}); 