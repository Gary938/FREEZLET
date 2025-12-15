// BlockBuilder/questionCollector.js - Question collection and selection for blocks

import { updateQuestions as updateQuestionsImmutable } from '../../../Core/StateTransformers/index.js';

// CONFIG
const COLLECTOR_CONFIG = {
    NO_QUESTIONS_NEEDED: 0,
    EMPTY_SELECTION: []
};

// OPERATIONS
// Logic: blockSize NEW questions + ALL incorrect questions for repeat (beyond blockSize)
// Incorrect questions are added to end of block and don't affect perfectBlock
export const collectQuestionsForBlock = (state, blockSize) => {
    // 1. Take blockSize NEW questions from remaining
    const remainingQuestions = takeRemainingQuestions(state.questions.remaining, blockSize);

    // 2. Take ALL incorrect questions for repeat (no limit)
    const incorrectQuestions = takeAllIncorrectQuestions(state.questions.incorrect);

    // 3. Block = new + incorrect (beyond blockSize)
    return buildBlockResult(state, incorrectQuestions, remainingQuestions);
};

// Take ALL incorrect questions (for repeat)
export const takeAllIncorrectQuestions = (incorrectQuestions) => {
    return { selected: [...incorrectQuestions], remaining: [] };
};

export const takeRemainingQuestions = (remainingQuestions, needed) => {
    if (needed <= COLLECTOR_CONFIG.NO_QUESTIONS_NEEDED) {
        return { 
            selected: COLLECTOR_CONFIG.EMPTY_SELECTION, 
            remaining: remainingQuestions 
        };
    }
    
    const selected = remainingQuestions.slice(0, needed);
    const remaining = remainingQuestions.slice(selected.length);
    return { selected, remaining };
};

// HELPERS
const buildBlockResult = (state, incorrectQuestions, remainingQuestions) => {
    // Order: NEW questions first, incorrect (for repeat) at end
    const block = [...remainingQuestions.selected, ...incorrectQuestions.selected];
    
    const updatedState = updateQuestionsImmutable(state, {
        incorrect: incorrectQuestions.remaining,
        remaining: remainingQuestions.remaining
    });
    
    return { block, updatedState };
}; 