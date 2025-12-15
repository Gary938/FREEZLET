// BlockManagement/index.js - Centralized block operations exports

// Block Formation
export { 
    formNextBlock, 
    createBlock, 
    collectQuestionsForBlock 
} from './BlockBuilder/index.js';

// Block Completion
export { 
    completeCurrentBlock, 
    isTestCompleted, 
    hasQuestionsRemaining, 
    getNextQuestion 
} from './blockCompletion.js';

// Block Analytics
export { 
    getBlockProgress, 
    calculateBlockAccuracy, 
    getBlockStats, 
    calculateCompletion,
    isBlockPerfect,
    getBlockSize
} from './blockAnalytics.js'; 