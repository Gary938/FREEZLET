// Utils/typeGuards.js - UI data type checks

// IMPORTS
import { createUITracer } from './uiTracer.js';

// CONFIG
export const TYPE_DEFINITIONS = {
    QUESTION_DATA: ['id', 'question', 'options', 'correctAnswer'],
    PACMAN_DATA: ['totalGhosts', 'currentPosition', 'lastAction', 'isAnimating'],
    BACKGROUND_DATA: ['currentPath', 'mode'],
    BUSINESS_RESPONSE: ['type', 'data']
};

export const TYPE_VALIDATORS = {
    id: (value) => typeof value === 'string' && value.length > 0,
    question: (value) => typeof value === 'string' && value.length > 0,
    options: (value) => Array.isArray(value) && value.length >= 2,
    correctAnswer: (value, data) => typeof value === 'number' && 
                                    value >= 0 && 
                                    value < data.options.length,
    command: (value) => ['move', 'stay'].includes(value),
    currentPath: (value) => typeof value === 'string',
    mode: (value) => ['story', 'random', 'custom'].includes(value),
    type: (value) => ['question', 'next_block', 'final_stats'].includes(value)
};

// OPERATIONS
export const isValidQuestionData = (data) => {
    // Guard clauses
    if (!data || typeof data !== 'object') return false;
    
    return validateQuestionFields(data);
};

export const isValidPacmanData = (data) => {
    // Guard clauses
    if (!data || typeof data !== 'object') return false;
    
    // Check required fields for pacman UI component
    return typeof data.totalGhosts === 'number' && 
           data.totalGhosts > 0 &&
           typeof data.currentPosition === 'number' &&
           data.currentPosition >= 0;
};

export const isValidBackgroundData = (data) => {
    // Guard clauses
    if (!data || typeof data !== 'object') return false;
    
    return TYPE_VALIDATORS.currentPath(data.currentPath) && 
           TYPE_VALIDATORS.mode(data.mode);
};

export const validateBusinessResponse = (response) => {
    const tracer = createUITracer('typeGuards');
    
    // Guard clauses
    if (!response || typeof response !== 'object') {
        tracer.trace('validateResponse:invalidResponse', { 
            responseType: typeof response 
        });
        return createValidationResult(false, 'INVALID_RESPONSE_FORMAT');
    }
    
    if (!TYPE_VALIDATORS.type(response.type)) {
        tracer.trace('validateResponse:invalidType', { 
            actualType: response.type
        });
        return createValidationResult(false, 'INVALID_RESPONSE_TYPE');
    }
    
    if (response.type === 'question' && !isValidQuestionData(response.data)) {
        tracer.trace('validateResponse:invalidQuestionData');
        return createValidationResult(false, 'INVALID_QUESTION_DATA');
    }
    
    tracer.trace('validateResponse:success', { 
        type: response.type,
        validationPassed: true
    });
    
    return createValidationResult(true);
};

// HELPERS
const validateQuestionFields = (data) => {
    return TYPE_DEFINITIONS.QUESTION_DATA.every(field => {
        const validator = TYPE_VALIDATORS[field];
        return validator ? validator(data[field], data) : false;
    });
};

const createValidationResult = (success, errorCode = null) => ({
    success,
    error: errorCode ? { code: errorCode } : null,
    timestamp: Date.now()
}); 