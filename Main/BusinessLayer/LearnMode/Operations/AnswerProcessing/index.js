// AnswerProcessing/index.js - Centralized answer processing exports

// Answer Processing & Validation
export { 
    processAnswer, 
    validateAnswerInput, 
    createAnswerContext,
    isAnswerCorrect 
} from './answerValidation.js';

// Answer Logic
export { 
    executeAnswerLogic, 
    processQuestionExamples, 
    createAnswerResult,
    determineAnswerType,
    getCurrentQuestionId, 
    getAnswerSummary 
} from './answerLogic.js';

// State Updates
export { 
    updateAnswerStatistics,
    processAnswerConsequences,
    updateQuestionStats, 
    removeQuestionFromBlock, 
    addToIncorrectQueue, 
    markBlockImperfect,
    applyStateTransformations
} from './stateUpdater.js'; 