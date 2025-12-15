// Core/validator.js - Centralized validation
// PATTERN: Validation functions return null on success, error object on failure
// Usage: if (validation) return validation; // if error - return

import {
    validateAnswer,
    validateTestPath,
    validateQuestionId,
    validateStage,
    validateQuestionsList
} from '../Config/validationRules.js';
import { createError } from '../Config/responseTypes.js';

// OPERATIONS
export const validateTestStart = (testPath, stage) => {
    const pathValidation = validateTestPath(testPath);
    if (!pathValidation.valid) {
        return createError('INVALID_TEST_PATH', pathValidation.error);
    }
    
    const stageValidation = validateStage(stage);
    if (!stageValidation.valid) {
        return createError('INVALID_STAGE', stageValidation.error);
    }
    
    return null;
};

export const validateAnswerSubmission = (answer, questionId) => {
    const answerValidation = validateAnswer(answer);
    if (!answerValidation.valid) {
        return createError('INVALID_ANSWER', answerValidation.error);
    }
    
    const questionValidation = validateQuestionId(questionId);
    if (!questionValidation.valid) {
        return createError('INVALID_QUESTION_ID', questionValidation.error);
    }
    
    return null;
};

export const validateTestState = (state) => {
    if (!state) {
        return createError('NO_ACTIVE_TEST', 'No active test');
    }
    
    if (!state.questions?.all) {
        return createError('INVALID_STATE', 'Invalid test state');
    }
    
    return null;
};

export const validateQuestions = (questions) => {
    const validation = validateQuestionsList(questions);
    if (!validation.valid) {
        return createError('INVALID_QUESTIONS', validation.error);
    }
    
    return null;
};

export const validateBlockFormation = (state) => {
    if (!state?.questions) {
        return createError('INVALID_STATE', 'No questions in state');
    }
    
    const { remaining, current, incorrect } = state.questions;
    
    if (!Array.isArray(remaining) || !Array.isArray(current) || !Array.isArray(incorrect)) {
        return createError('INVALID_QUESTIONS_STRUCTURE', 'Invalid questions structure');
    }
    
    return null;
};

export const validateTestCompletion = (state) => {
    const stateValidation = validateTestState(state);
    if (stateValidation) return stateValidation;
    
    const { remaining, current, incorrect } = state.questions;
    
    if (remaining.length > 0 || current.length > 0 || incorrect.length > 0) {
        return createError('TEST_NOT_COMPLETE', 'Test not yet completed');
    }
    
    return null;
};

// HELPERS
export const validateInput = (validations) => {
    for (const validation of validations) {
        if (validation) return validation;
    }
    return null;
};

export const isValidationError = (result) => 
    result && result.data?.code && result.type === 'error'; 