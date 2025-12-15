// Components/Pacman/pacmanConfig.js - Pacman configuration

// CONFIG - Main settings
export const PACMAN_CONFIG = {
    // Ghost sizes
    GHOST_SIZE_MULTIPLIER: 0.9,
    LAST_GHOST_MULTIPLIER: 1.2,
    
    // CSS identifiers and classes
    CONTAINER_ID: 'pacmanProgressContainer',
    CONTAINER_CLASS: 'pacman-progress-container',
    TRACK_CLASS: 'pacman-progress-track',
    PACMAN_CLASS: 'pacman',
    GHOST_CLASS: 'pacman-ghost',
    
    // Ghost colors
    GHOST_COLORS: [
        '#FF7F50', '#FFA07A', '#FFD700', '#FF69B4', 
        '#FF8C00', '#FF6347', '#DA70D6', '#E9967A',
        '#F08080', '#FFE4B5'
    ],
    
    // Positioning
    INITIAL_PACMAN_BOTTOM: 10,
    CONTAINER_OFFSET: 100,
    GHOST_BOTTOM_OFFSET: 40
};

// CONFIG - Pacman commands
export const PACMAN_COMMANDS = {
    INIT: 'init',
    MOVE: 'move',
    STAY: 'stay',
    RESET: 'reset',
    PAGE_SWITCH: 'page_switch'
};

// CONFIG - Animations and timers
export const ANIMATION_CONFIG = {
    MOVEMENT_DURATION: 500,
    FLASH_DURATION: 400,
    EXPLOSION_DELAY: 600,
    CLEANUP_DELAY: 300,
    POPUP_DURATION: 1500,
    EXPLOSION_RINGS_COUNT: 3,
    EXPLOSION_PARTICLES_COUNT: 20,
    EXPLOSION_SPARKS_COUNT: 15,
    EXPLOSION_SMOKE_COUNT: 3
};

// CONFIG - Pacman elements (details)
export const PACMAN_ELEMENTS = {
    HORN_LEFT: 'pacman-horn-left',
    HORN_RIGHT: 'pacman-horn-right',
    EYE_CONTAINER: 'pacman-eye-container',
    EYE: 'pacman-eye',
    PUPIL: 'pacman-pupil',
    SHINE: 'pacman-eye-shine',
    EYELID: 'pacman-eyelid',
    GHOST_MOUTH: 'pacman-ghost-mouth'
};

// CONFIG - Validation
export const PACMAN_VALIDATION = {
    MIN_GHOSTS: 1,
    MAX_GHOSTS: 1000,
    MAX_GHOSTS_PER_PAGE: 30,
    REQUIRED_PROPS: ['totalGhosts', 'currentPosition']
}; 