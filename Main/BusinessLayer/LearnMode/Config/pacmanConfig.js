// Config/pacmanConfig.js - Pacman configuration (initialization only)

// CONFIG - UI commands (initialization only)
export const PACMAN_COMMANDS = {
    INIT: 'init'
};

// CONFIG - UI settings
export const PACMAN_UI_CONFIG = {
    DEFAULT_SIZE: 40,
    ANIMATION_DURATION: 300,
    MIN_GHOSTS: 1,
    MAX_GHOSTS: 1000
};

// CONFIG - Validation rules (initialization only)
export const PACMAN_VALIDATION = {
    REQUIRED_FIELDS: {
        INIT_COMMAND: ['action', 'totalGhosts']
    },
    
    ERROR_CODES: {
        INVALID_TOTAL_QUESTIONS: 'INVALID_TOTAL_QUESTIONS'
    }
}; 