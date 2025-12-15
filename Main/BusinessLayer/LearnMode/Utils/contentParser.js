// Utils/contentParser.js - Content parsing API

import { trace } from './tracer.js';
import { parseTxtContent } from './Parser/txtParser.js';
import { validateQuestion } from './Parser/questionValidator.js';

// OPERATIONS
export const parseTestContent = (content) => {
    trace('parseContent', { length: content?.length });
    
    if (!content?.trim()) {
        return { success: false, error: 'Empty content' };
    }
    
    try {
        const questions = parseTxtContent(content);
        
        if (questions.length === 0) {
            return { success: false, error: 'No valid questions found' };
        }
        
        return { success: true, questions };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

// EXPORTS
export { parseTxtContent } from './Parser/txtParser.js';
export { validateQuestion } from './Parser/questionValidator.js';

// UTILITIES
export const shuffleOptions = (options, correctAnswer) => {
    if (!Array.isArray(options)) return { options: [], correctAnswer: null };

    // Fisher-Yates shuffle for uniform distribution
    const shuffled = [...options];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    // Find new correct answer index by text
    const newCorrectIndex = shuffled.indexOf(correctAnswer);

    // Protection from -1: if correct answer not found, return original
    if (newCorrectIndex === -1) {
        return {
            options: options,
            correctAnswer: options.indexOf(correctAnswer)
        };
    }

    return {
        options: shuffled,
        correctAnswer: newCorrectIndex
    };
}; 