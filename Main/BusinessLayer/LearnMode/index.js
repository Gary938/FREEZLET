// index.js - Public LearnMode API

// CORE API
export { 
    startTest, 
    submitAnswer, 
    getTestStatus, 
    endTest 
} from './learnModeCore.js';

// STATE OPERATIONS
export {
    getCurrentState,
    hasActiveTest,
    getStateInfo,
    setPendingExample,
    getPendingExample,
    clearPendingExample
} from './Core/stateManager.js';

// VALIDATION
export { 
    validateTestStart, 
    validateAnswerSubmission 
} from './Core/validator.js';

// UTILITIES
export { 
    parseTestContent, 
    validateQuestion 
} from './Utils/contentParser.js';

export { 
    loadFile, 
    fileExists 
} from './Utils/fileLoader.js';

// CONFIG
export { 
    STAGE_CONFIG, 
    getStageConfig, 
    getBlockSize 
} from './Config/stageConfig.js';

export { 
    RESPONSE_TYPES, 
    ANSWER_TYPES, 
    createResponse 
} from './Config/responseTypes.js';

// OPERATIONS
export { 
    initializeTest, 
    validateTestFile 
} from './Operations/TestInitialization/index.js';

export { 
    calculateFinalResults, 
    determineTestOutcome 
} from './Operations/ResultCalculation/index.js';

// RESPONSE BUILDERS
export { 
    buildQuestionResponse, 
    buildCompletionResponse, 
    buildNextBlockResponse 
} from './Core/ResponseBuilder/index.js';

// VERSION INFO
export const VERSION = '2.0.0';
export const ARCHITECTURE = 'AI-Optimized';
export const CREATED = '2024-12-28'; 