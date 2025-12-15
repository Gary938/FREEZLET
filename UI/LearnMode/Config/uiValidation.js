// Config/uiValidation.js - UI validation rules

// IMPORTS
import { UI_ACTION_TYPES, UI_LIMITS } from './uiTypes.js';

// CONFIG - UI action validation rules
export const UI_VALIDATION_RULES = {
    [UI_ACTION_TYPES.SELECT_ANSWER]: {
        answerIndex: { required: true, type: 'number', min: 0, max: 3 },
        questionData: { required: true, type: 'object' }
    },
    [UI_ACTION_TYPES.SHOW_EFFECTS]: {
        effectType: { required: true, type: 'string' },
        duration: { required: false, type: 'number', min: 100, max: 5000 }
    },
    [UI_ACTION_TYPES.NEW_QUESTION]: {
        questionData: { required: true, type: 'object' },
        pacmanData: { required: false, type: 'object' },
        backgroundData: { required: false, type: 'object' }
    }
};

// CONFIG - Data type validators
export const UI_DATA_VALIDATORS = {
    required: (value) => value !== null && value !== undefined,
    type: (value, expectedType) => typeof value === expectedType,
    min: (value, minValue) => typeof value === 'number' && value >= minValue,
    max: (value, maxValue) => typeof value === 'number' && value <= maxValue,
    minLength: (value, minLen) => typeof value === 'string' && value.length >= minLen,
    maxLength: (value, maxLen) => typeof value === 'string' && value.length <= maxLen,
    array: (value) => Array.isArray(value),
    object: (value) => value && typeof value === 'object' && !Array.isArray(value)
};

// OPERATIONS
export const validateActionPayload = (actionType, payload) => {
    // Guard clauses
    if (!actionType) return createValidationError('NO_ACTION_TYPE');
    if (!payload) return createValidationError('NO_PAYLOAD');
    
    const rules = UI_VALIDATION_RULES[actionType];
    if (!rules) return createValidationSuccess(); // No rules = valid
    
    const errors = validatePayloadFields(payload, rules);
    return errors.length > 0 
        ? createValidationError('VALIDATION_FAILED', errors)
        : createValidationSuccess();
};

export const validateUIData = (data, fieldRules) => {
    // Guard clauses
    if (!data || !fieldRules) return createValidationError('INVALID_PARAMS');
    
    const errors = validatePayloadFields(data, fieldRules);
    return errors.length > 0 
        ? createValidationError('DATA_VALIDATION_FAILED', errors)
        : createValidationSuccess();
};

// HELPERS
const validatePayloadFields = (payload, rules) => {
    return Object.entries(rules).reduce((errors, [field, fieldRules]) => {
        const value = payload[field];
        const fieldErrors = validateField(value, fieldRules, field);
        return [...errors, ...fieldErrors];
    }, []);
};

const validateField = (value, rules, fieldName) => {
    return Object.entries(rules).reduce((errors, [ruleName, ruleValue]) => {
        const validator = UI_DATA_VALIDATORS[ruleName];
        if (validator && !validator(value, ruleValue)) {
            return [...errors, `${fieldName}: ${ruleName} validation failed`];
        }
        return errors;
    }, []);
};

const createValidationError = (code, details = []) => ({
    success: false,
    error: { code, details },
    timestamp: Date.now()
});

const createValidationSuccess = () => ({
    success: true,
    timestamp: Date.now()
}); 