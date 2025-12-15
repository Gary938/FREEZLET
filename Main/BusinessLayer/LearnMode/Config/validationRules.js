// Config/validationRules.js - Validation rules

import { ANSWER_TYPES } from './responseTypes.js';
import { isStageValid } from './stageConfig.js';

// CONFIG
export const VALIDATION_RULES = {
    QUESTION_ID: {
        minLength: 1,
        maxLength: 100,
        required: true
    },
    TEST_PATH: {
        minLength: 3,
        maxLength: 500,
        required: true
    },
    ACCURACY: {
        min: 0,
        max: 100,  // Accuracy in 0-100 format (percentages)
        precision: 2
    }
};

// OPERATIONS
export const validateAnswer = (answer) => {
    if (!answer) return { valid: false, error: 'Answer not specified' };
    if (!Object.values(ANSWER_TYPES).includes(answer)) {
        return { valid: false, error: 'Invalid answer type' };
    }
    return { valid: true };
};

export const validateTestPath = (testPath) => {
    if (!testPath) return { valid: false, error: 'Test path not specified' };
    if (typeof testPath !== 'string') {
        return { valid: false, error: 'Path must be a string' };
    }
    if (testPath.length < VALIDATION_RULES.TEST_PATH.minLength) {
        return { valid: false, error: 'Path is too short' };
    }
    return { valid: true };
};

export const validateQuestionId = (questionId) => {
    if (!questionId) return { valid: false, error: 'Question ID not specified' };
    if (typeof questionId !== 'string') {
        return { valid: false, error: 'ID must be a string' };
    }
    return { valid: true };
};

export const validateStage = (stage) => {
    if (stage === null || stage === undefined) {
        return { valid: false, error: 'Stage not specified' };
    }
    if (!Number.isInteger(stage)) {
        return { valid: false, error: 'Stage must be an integer' };
    }
    if (!isStageValid(stage)) {
        return { valid: false, error: 'Invalid stage' };
    }
    return { valid: true };
};

export const validateAccuracy = (accuracy) => {
    if (accuracy === null || accuracy === undefined) {
        return { valid: false, error: 'Accuracy not specified' };
    }
    if (typeof accuracy !== 'number') {
        return { valid: false, error: 'Accuracy must be a number' };
    }
    if (accuracy < VALIDATION_RULES.ACCURACY.min || 
        accuracy > VALIDATION_RULES.ACCURACY.max) {
        return { valid: false, error: 'Invalid accuracy value' };
    }
    return { valid: true };
};

export const validateQuestionsList = (questions) => {
    if (!Array.isArray(questions)) {
        return { valid: false, error: 'Questions must be an array' };
    }
    if (questions.length === 0) {
        return { valid: false, error: 'Question list cannot be empty' };
    }
    return { valid: true };
}; 