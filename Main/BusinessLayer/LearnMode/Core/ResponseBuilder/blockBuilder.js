// ResponseBuilder/blockBuilder.js - Block response building

import { createResponse, RESPONSE_TYPES } from '../../Config/responseTypes.js';
import { createErrorResult } from '../errorHandler.js';
import { trace } from '../../Utils/tracer.js';
import { prepareQuestionForUI } from './questionBuilder.js';

// OPERATIONS
export const buildNextBlockResponse = (nextQuestion, blockInfo = {}, extensions = {}) => {
    trace('buildNextBlock', { 
        questionId: nextQuestion?.id,
        blockNumber: blockInfo.blockNumber 
    });
    
    if (!nextQuestion) {
        return createErrorResult('No next question for new block', 'NO_NEXT_BLOCK_QUESTION');
    }
    
    const questionData = prepareQuestionForUI(nextQuestion);
    
    const response = {
        type: RESPONSE_TYPES.NEXT_BLOCK,
        success: true,
        data: {
            blockNumber: blockInfo.blockNumber || 1,
            message: `Block completed! Moving to block ${blockInfo.blockNumber || 1}`,
            totalBlocks: blockInfo.totalBlocks || 1,
            perfectBlock: blockInfo.perfectBlock || false,
            nextQuestion: questionData
        },
        timestamp: Date.now()
    };
    
    if (extensions.pacman) response.data.pacman = extensions.pacman;
    if (extensions.background) response.data.background = extensions.background;
    
    return response;
}; 