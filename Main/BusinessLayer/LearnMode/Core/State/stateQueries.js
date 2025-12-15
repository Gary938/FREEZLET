// State/stateQueries.js - State queries

// CONFIG  
const QUERY_DEFAULTS = {
    EMPTY_STATE: null,
    EMPTY_ARRAY_LENGTH: 0,
    ZERO_ACCURACY: 0
};

// Unused constants removed

// OPERATIONS
export const getStateInfo = (state) => {
    if (!state) return QUERY_DEFAULTS.EMPTY_STATE;
    
    return {
        id: state.id,
        stage: state.stage,
        status: state.status,
        totalQuestions: state.questions.all.length,
        remainingQuestions: state.questions.remaining.length,
        currentBlockSize: state.questions.current.length,
        incorrectCount: state.questions.incorrect.length,
        attemptedCount: state.stats.attempted.length,  // .length instead of .size
        correctCount: state.stats.correct.length,      // .length instead of .size
        blockCount: state.meta.blockCount,
        perfectBlock: state.stats.perfectBlock
    };
};

export const getCurrentQuestion = (state) => {
    if (!state?.questions?.current?.length) return null;
    return state.questions.current[0];
};

export const isBlockCompleted = (state) => 
    state?.questions?.current?.length === 0;

export const isTestCompleted = (state) => {
    if (!state?.questions) return true;
    
    const { current, remaining, incorrect } = state.questions;
    return current.length === 0 && 
           remaining.length === 0 && 
           incorrect.length === 0;
};

// Unused functions removed: hasQuestionsRemaining, getTestProgress, calculateAccuracy 