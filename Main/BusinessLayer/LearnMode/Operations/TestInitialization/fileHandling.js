// TestInitialization/fileHandling.js - Test file handling

import { safeLoad } from '../../Utils/fileLoader.js';
import { parseTestContent } from '../../Utils/contentParser.js';
import { validateQuestions } from '../../Core/validator.js';
import { createSuccessResult, createErrorResult } from '../../Core/errorHandler.js';
import { trace } from '../../Utils/tracer.js';

// TYPES
const ERROR_TYPES = {
    FILE_LOAD_ERROR: 'FILE_LOAD_ERROR',
    PARSE_ERROR: 'PARSE_ERROR',
    VALIDATION_ERROR: 'VALIDATION_ERROR'
};

// OPERATIONS
export const loadAndParseQuestions = async (testPath) => {
    trace('loadAndParseQuestions', { testPath });
    
    const fileResult = await loadTestFile(testPath);
    if (!fileResult.success) return fileResult;
    
    const parseResult = parseFileContent(fileResult.content);
    if (!parseResult.success) return parseResult;
    
    return validateParsedQuestions(parseResult.questions);
};

export const validateTestFile = async (testPath) => {
    trace('validateTestFile', { testPath });
    
    const questions = await loadAndParseQuestions(testPath);
    
    return questions.success ? 
        { valid: true, questionsCount: questions.data.length } :
        { valid: false, error: questions.error };
};

// HELPERS
const loadTestFile = async (testPath) => {
    const fileResult = await safeLoad(testPath);
    if (!fileResult.success) {
        return createErrorResult(fileResult.error, ERROR_TYPES.FILE_LOAD_ERROR);
    }
    
    return fileResult;
};

const parseFileContent = (content) => {
    const parseResult = parseTestContent(content);
    if (!parseResult.success) {
        return createErrorResult(parseResult.error, ERROR_TYPES.PARSE_ERROR);
    }
    
    return parseResult;
};

const validateParsedQuestions = (questions) => {
    const questionsValidation = validateQuestions(questions);
    if (questionsValidation) {
        return createErrorResult(questionsValidation.error, ERROR_TYPES.VALIDATION_ERROR);
    }
    
    return createSuccessResult(questions);
}; 