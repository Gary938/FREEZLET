// txtParser.js - TXT content parsing

import { validateQuestion } from './questionValidator.js';

// OPERATIONS
export const parseTxtContent = (content) => {
    const lines = content.split('\n');
    const questions = [];
    let currentQuestion = createEmptyQuestion();
    
    for (const line of lines) {
        const trimmedLine = line.trim();
        
        if (!trimmedLine) {
            if (isQuestionReady(currentQuestion)) {
                const question = finalizeQuestion(currentQuestion);
                if (validateQuestion(question).valid) {
                    questions.push(question);
                }
            }
            currentQuestion = createEmptyQuestion();
            continue;
        }
        
        processLine(currentQuestion, trimmedLine);
    }
    
    // Last question
    if (isQuestionReady(currentQuestion)) {
        const question = finalizeQuestion(currentQuestion);
        if (validateQuestion(question).valid) {
            questions.push(question);
        }
    }
    
    return questions;
};

// HELPERS
const createEmptyQuestion = () => ({
    content: '', 
    options: [], 
    correctAnswer: '', 
    correctIndex: -1, 
    examples: []
});

const processLine = (question, line) => {
    if (line.toLowerCase().startsWith('example:')) {
        const example = line.slice(8).trim();
        if (example) question.examples.push(example);
    } else if (line.startsWith('E:')) {
        // Ignore explanations
    } else if (line.includes('?') || !question.content) {
        question.content = line;
    } else if (line.startsWith('*')) {
        const answer = line.slice(1).trim();
        question.correctAnswer = answer;
        question.correctIndex = question.options.length;
        question.options.push(answer);
    } else {
        question.options.push(line);
    }
};

const isQuestionReady = (question) => 
    question.content && question.options.length > 0;

const finalizeQuestion = (question) => ({
    id: generateQuestionId(),
    content: question.content,
    correctAnswer: question.correctAnswer,
    options: [...question.options],
    correctIndex: question.correctIndex,
    examples: [...question.examples]
});

// ID Generation utility
const generateQuestionId = () => 
    `q_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`; 