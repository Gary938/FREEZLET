// BlockManagement/blockAnalytics.js - Block analytics and metrics
//
// ACCURACY FORMAT: All functions in this file return accuracy as COEFFICIENT (0-1)
// Example: 0.85 means 85%
// DIFFERS from resultStats.js which returns PERCENTAGES (0-100)!

// OPERATIONS
export const getBlockProgress = (state) => ({
    currentBlock: state.meta.blockCount,
    questionsInCurrentBlock: state.questions.current.length,
    remainingQuestions: state.questions.remaining.length,
    incorrectQuestions: state.questions.incorrect.length,
    totalQuestions: state.questions.all.length,
    perfectBlock: state.stats.perfectBlock
});

// @returns {number} accuracy - coefficient (0-1), e.g. 0.85 = 85%
export const calculateBlockAccuracy = (state) => {
    const attempted = state.stats.attempted.length;  // .length instead of .size
    const correct = state.stats.correct.length;      // .length instead of .size

    return attempted > 0 ? correct / attempted : 0;  // coefficient 0-1
};

export const getBlockStats = (state) => ({
    accuracy: calculateBlockAccuracy(state),
    progress: getBlockProgress(state),
    completion: calculateCompletion(state)
});

export const calculateCompletion = (state) => {
    const total = state.questions.all.length;
    const completed = total - state.questions.remaining.length - state.questions.current.length;
    
    return total > 0 ? completed / total : 0;
};

// HELPERS
export const isBlockPerfect = (state) => 
    state.stats.perfectBlock;

export const getBlockSize = (state) => 
    state.questions.current.length; 