// ResponseBuilder/questionBuilder.js - Question response building

import { createQuestionResponse, createResponse, RESPONSE_TYPES } from '../../Config/responseTypes.js';
import { getPendingExample, clearPendingExample } from '../stateManager.js';
import { trace } from '../../Utils/tracer.js';
import { shuffleOptions } from '../../Utils/contentParser.js';

// OPERATIONS
export const buildQuestionResponse = (question, extensions = {}) => {
    trace('buildQuestion', { questionId: question?.id });
    
    if (!question) {
        return createResponse(RESPONSE_TYPES.ERROR, {
            code: 'NO_QUESTION',
            message: 'Question not found'
        });
    }
    
    const questionData = prepareQuestionForUI(question);
    const baseResponse = createQuestionResponse(questionData);
    
    return enhanceWithExtensions(baseResponse, extensions);
};

export const prepareQuestionForUI = (question) => {
    if (!question) return null;
    
    const pendingExample = getPendingExample();
    const shuffledData = shuffleOptions(question.options, question.correctAnswer);
    
    const result = {
        id: question.id,
        question: question.content,
        options: shuffledData.options,
        correctAnswer: shuffledData.correctAnswer
    };
    
    if (pendingExample) {
        result.showExample = {
            text: pendingExample,
            position: 'after_answers'
        };
        clearPendingExample();  // Clear after use to prevent leakage
        trace('exampleDataPrepared', {
            example: pendingExample,
            questionId: question.id,
            position: 'after_answers'
        });
    }
    
    return result;
};

export const enhanceWithExtensions = (baseResponse, extensions) => {
    const enhanced = { ...baseResponse };
    
    if (extensions.pacman) enhanced.data.pacman = extensions.pacman;
    if (extensions.background) enhanced.data.background = extensions.background;
    if (extensions.audio) enhanced.data.audio = extensions.audio;
    
    return enhanced;
}; 