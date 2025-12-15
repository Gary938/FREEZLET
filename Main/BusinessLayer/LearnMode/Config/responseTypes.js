// Config/responseTypes.js - Response types for UI

// TYPES
export const RESPONSE_TYPES = {
    QUESTION: 'question',
    NEXT_BLOCK: 'next_block',        // ✅ FIXED: synchronized with UI
    FINAL_STATS: 'final_stats',      // ✅ FIXED: synchronized with UI  
    ERROR: 'error'
};

export const ANSWER_TYPES = {
    CORRECT: 'correct',
    INCORRECT: 'incorrect'
};

export const COMMAND_TYPES = {
    PACMAN_INIT: 'init',
    PACMAN_MOVE: 'move',
    PACMAN_STAY: 'stay',
    PACMAN_RESET: 'reset'
};

export const ERROR_CODES = {
    NO_ACTIVE_TEST: 'NO_ACTIVE_TEST',
    INVALID_RESULT: 'INVALID_RESULT',
    FILE_NOT_FOUND: 'FILE_NOT_FOUND',
    PARSE_ERROR: 'PARSE_ERROR',
    OPERATION_FAILED: 'OPERATION_FAILED'
};

// OPERATIONS
export const createResponse = (type, data, extensions = {}) => ({
    type,
    data,
    timestamp: Date.now(),
    ...extensions
});

export const createSuccess = (type, data, extensions = {}) => 
    createResponse(type, data, { success: true, ...extensions });

export const createError = (code, message, details = {}) => 
    createResponse(RESPONSE_TYPES.ERROR, {
        code,
        message,
        ...details
    });

export const createQuestionResponse = (question, extensions = {}) =>
    createSuccess(RESPONSE_TYPES.QUESTION, question, extensions);

export const createCompletionResponse = (results, extensions = {}) =>
    createResponse(RESPONSE_TYPES.FINAL_STATS, results, { success: true, ...extensions });

export const isValidAnswerType = (type) => 
    Object.values(ANSWER_TYPES).includes(type);

export const isValidResponseType = (type) => 
    Object.values(RESPONSE_TYPES).includes(type); 