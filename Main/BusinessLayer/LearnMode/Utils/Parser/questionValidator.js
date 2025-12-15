// questionValidator.js - Question validation

// CONFIG
const MIN_OPTIONS = 2;

// OPERATIONS
export const validateQuestion = (question) => {
    if (!question.content) {
        return { valid: false, error: 'Question text is missing' };
    }
    
    if (!question.correctAnswer) {
        return { valid: false, error: 'Correct answer is missing' };
    }
    
    if (!question.options || question.options.length < MIN_OPTIONS) {
        return { valid: false, error: 'Not enough answer options' };
    }
    
    if (!question.options.includes(question.correctAnswer)) {
        return { valid: false, error: 'Correct answer not found in options' };
    }
    
    if (question.correctIndex === -1) {
        return { valid: false, error: 'Correct answer index not specified' };
    }
    
    return { valid: true };
};

// HELPERS
export const isValidQuestionStructure = (question) => 
    question && question.content && Array.isArray(question.options); 