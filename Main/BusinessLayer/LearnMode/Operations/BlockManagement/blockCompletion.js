// BlockManagement/blockCompletion.js - Block completion and checking

import { createSuccessResult } from '../../Core/errorHandler.js';
import { trace } from '../../Utils/tracer.js';
import { isTestCompleted } from '../../Core/State/stateQueries.js';

// OPERATIONS
export const completeCurrentBlock = (state) => {
    const blockInfo = createBlockInfo(state);
    
    trace('completeBlock', blockInfo);
    
    return createSuccessResult({
        blockCompleted: true,
        blockInfo,
        hasMoreBlocks: hasQuestionsRemaining(state)
    });
};

// isTestCompleted is imported from stateQueries.js
export { isTestCompleted };

export const hasQuestionsRemaining = (state) => {
    if (!state?.questions) return false;
    
    const { remaining, incorrect } = state.questions;
    return remaining.length > 0 || incorrect.length > 0;
};

export const getNextQuestion = (state) => {
    if (!state?.questions?.current?.length) return null;
    return state.questions.current[0];
};

// HELPERS  
const createBlockInfo = (state) => ({
    blockNumber: state.meta.blockCount,
    wasBlockPerfect: state.stats.perfectBlock,
    questionsInBlock: state.questions.current.length
}); 