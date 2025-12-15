// ResultCalculation/index.js - Centralized result calculation exports

// Result Formatting & Main Logic
export { 
    calculateFinalResults, 
    formatResults 
} from './resultFormatter.js';

// Statistics Calculation
export {
    calculateTestStats,
    calculateAccuracy,
    calculatePerfectBlocks,
    calculateTotalBlocks,
    formatDuration
} from './resultStats.js';

// Outcome Logic
export { 
    determineTestOutcome, 
    shouldAdvanceStage, 
    getNextStage, 
    getOutcomeMessage, 
    getPerformanceLevel,
    evaluateTestCompletion 
} from './outcomeLogic.js';

// Video Selection
export { 
    determineResultVideo, 
    getVideoForOutcome 
} from './videoSelector.js'; 