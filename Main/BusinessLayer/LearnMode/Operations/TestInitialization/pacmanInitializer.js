// TestInitialization/pacmanInitializer.js - Pacman initialization

// IMPORTS
import { createInitCommand } from '../../Interactive/Pacman/index.js';
import { trace } from '../../Utils/tracer.js';

// CONFIG
export const PACMAN_INIT_CONFIG = {
    MIN_QUESTIONS: 1,
    MAX_QUESTIONS: 1000,
    ERROR_CODES: {
        NO_QUESTIONS: 'NO_QUESTIONS',
        INVALID_COUNT: 'INVALID_COUNT'
    }
};

// OPERATIONS
export const initializePacman = (questions) => {
    // Guard clauses
    if (!questions?.length) {
        trace('pacman_init', { error: PACMAN_INIT_CONFIG.ERROR_CODES.NO_QUESTIONS });
        return null;
    }
    if (questions.length < PACMAN_INIT_CONFIG.MIN_QUESTIONS || 
        questions.length > PACMAN_INIT_CONFIG.MAX_QUESTIONS) {
        trace('pacman_init', { 
            error: PACMAN_INIT_CONFIG.ERROR_CODES.INVALID_COUNT, 
            count: questions.length 
        });
        return null;
    }
    
    const command = createInitCommand(questions.length);
    
    trace('pacman_init', { 
        initialized: !!command,
        totalQuestions: questions.length 
    });
    
    return command;
}; 