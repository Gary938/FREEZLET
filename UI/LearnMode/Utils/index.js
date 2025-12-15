// Utils/index.js - Centralized export of Utils layer

// EXPORTS - UI Tracer (tracing for UI)
export {
    createUITracer,
    UI_TRACER_CONFIG as TRACER_CONFIG
} from './uiTracer.js';

// EXPORTS - Type Guards (data type validation)
export {
    isValidQuestionData,
    isValidPacmanData,
    isValidBackgroundData,
    validateBusinessResponse,
    TYPE_DEFINITIONS,
    TYPE_VALIDATORS
} from './typeGuards.js';

// EXPORTS - DOM Validator (DOM structure validation)
export {
    validateDOMStructure,
    validateElementExists,
    waitForElement,
    VALIDATION_CONFIG
} from './domValidator.js';

// EXPORTS - Facade Validator (facade validation)
export {
    validateStartParams,
    validateFacadeState,
    VALIDATION_CONFIG as FACADE_VALIDATION_CONFIG
} from './facadeValidator.js';

// EXPORTS - Error Elements (error element creation)
export {
    createErrorElement,
    createScreenError,
    createResultsError,
    ERROR_ELEMENTS_CONFIG
} from './errorElements.js';

// EXPORTS - Timeout Helpers (timeout and delay logic)
export {
    executeWithTimeout,
    createTimeoutPromise,
    executeCallbackWithTimeout,
    sleep,
    waitForCondition,
    TIMEOUT_CONFIG
} from './timeoutHelpers.js';

// CONFIG
export const UTILS_CONFIG = {
    LAYER_VERSION: '2.2.0',
    TOTAL_MODULES: 6,
    CATEGORIES: ['tracer', 'typeGuards', 'domValidator', 'facadeValidator', 'errorElements', 'timeoutHelpers']
};

// OPERATIONS
export const createUtilsAPI = () => ({
    // Tracer API
    createTracer: createUITracer,
    
    // Type Guards API
    validateQuestion: isValidQuestionData,
    validatePacman: isValidPacmanData,
    validateBackground: isValidBackgroundData,
    validateResponse: validateBusinessResponse,
    
    // DOM Validator API
    validateDOM: validateDOMStructure,
    validateElement: validateElementExists,
    waitForElement,
    
    // Facade Validator API
    validateStartParams,
    validateFacadeState,
    
    // Error Elements API
    createError: createErrorElement,
    createScreenError,
    createResultsError,
    
    // Timeout Helpers API
    executeWithTimeout,
    createTimeout: createTimeoutPromise,
    executeCallback: executeCallbackWithTimeout,
    sleep,
    waitForCondition,
    
    // Configuration
    config: UTILS_CONFIG
}); 