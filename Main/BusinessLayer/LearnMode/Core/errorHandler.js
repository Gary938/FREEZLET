// Core/errorHandler.js - Error handling

import { createError, createResponse } from '../Config/responseTypes.js';
import { trace } from '../Utils/tracer.js';

// OPERATIONS
export const handleError = (error, operation, context = {}) => {
    trace('handleError', { operation, error: error.message, stack: error.stack });

    const errorCode = getErrorCode(error);
    const errorMessage = getErrorMessage(error, operation);

    return createError(errorCode, errorMessage, {
        operation,
        ...context,
        originalError: error.message,
        stack: error.stack  // Save stack trace for debugging
    });
};

export const handleOperationResult = (result, operation, successCallback) => {
    if (!result.success) {
        return createError(
            result.code || 'OPERATION_FAILED',
            result.error || `Error during ${operation}`
        );
    }
    
    if (successCallback) {
        return successCallback(result);
    }
    
    return result;
};

export const wrapAsyncOperation = (operation, operationName) => 
    async (...args) => {
        try {
            return await operation(...args);
        } catch (error) {
            return handleError(error, operationName);
        }
    };

export const createSuccessResult = (data, extensions = {}) => ({
    success: true,
    data,
    ...extensions
});

export const createErrorResult = (error, code = 'UNKNOWN_ERROR') => ({
    success: false,
    error: typeof error === 'string' ? error : (error?.message || JSON.stringify(error)),
    code
});

export const isError = (result) => 
    result && (result.type === 'error' || result.success === false);

export const isSuccess = (result) => 
    result && (result.success === true || result.type !== 'error');

// HELPERS
const getErrorCode = (error) => {
    switch (error.code) {
        case 'ENOENT': return 'FILE_NOT_FOUND';
        case 'EACCES': return 'ACCESS_DENIED';
        default: return error.name === 'SyntaxError' ? 'PARSE_ERROR' : 'UNKNOWN_ERROR';
    }
};

const getErrorMessage = (error, operation) => {
    const baseMessage = error.message || 'Unknown error';
    return operation ? `${baseMessage} during ${operation}` : baseMessage;
}; 