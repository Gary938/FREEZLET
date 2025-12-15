// Interactive/Background/Utils/pathValidator.js - Path and mode validation

import { createSuccessResult, createErrorResult } from '../../../Core/errorHandler.js';
import { BACKGROUND_CONFIG } from '../Config/backgroundConfig.js';
import { trace } from '../../../Utils/tracer.js';
import fs from 'fs';
import { promises as fsPromises } from 'fs';

// OPERATIONS
export const validateMode = (mode) => {
    trace('validateMode', { mode });

    if (!mode) {
        return createErrorResult('Mode cannot be empty', 'EMPTY_MODE');
    }

    if (!BACKGROUND_CONFIG.MODES.includes(mode)) {
        return createErrorResult(`Invalid mode: ${mode}. Available: ${BACKGROUND_CONFIG.MODES.join(', ')}`, 'INVALID_MODE');
    }

    return createSuccessResult({ mode });
};

export const validatePath = (filePath) => {
    trace('validatePath', { filePath });

    if (!filePath) {
        return createErrorResult('Path cannot be empty', 'EMPTY_PATH');
    }

    if (typeof filePath !== 'string') {
        return createErrorResult('Path must be a string', 'INVALID_PATH_TYPE');
    }

    return createSuccessResult({ filePath });
};

// Synchronous existence check (for backward compatibility with fileScanner)
export const pathExists = (filePath) => {
    trace('pathExists', { filePath });

    const validation = validatePath(filePath);
    if (!validation.success) {
        return validation;
    }

    try {
        const exists = fs.existsSync(filePath);
        return createSuccessResult({ exists, filePath });
    } catch (error) {
        return createErrorResult(error.message, 'PATH_CHECK_ERROR');
    }
};

// Asynchronous existence check (recommended to use)
export const pathExistsAsync = async (filePath) => {
    trace('pathExistsAsync', { filePath });

    const validation = validatePath(filePath);
    if (!validation.success) {
        return validation;
    }

    try {
        await fsPromises.access(filePath);
        return createSuccessResult({ exists: true, filePath });
    } catch (error) {
        if (error.code === 'ENOENT') {
            return createSuccessResult({ exists: false, filePath });
        }
        return createErrorResult(error.message, 'PATH_CHECK_ERROR');
    }
}; 