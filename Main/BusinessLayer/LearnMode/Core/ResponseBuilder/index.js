// ResponseBuilder/index.js - Centralized response builder exports

// Question Response Building
export { 
    buildQuestionResponse, 
    prepareQuestionForUI, 
    enhanceWithExtensions 
} from './questionBuilder.js';

// Block Response Building
export { 
    buildNextBlockResponse 
} from './blockBuilder.js';

// Completion Response Building
export { 
    buildCompletionResponse, 
    formatTestResults 
} from './completionBuilder.js'; 