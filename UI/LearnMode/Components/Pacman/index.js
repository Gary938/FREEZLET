// Components/Pacman/index.js - Centralized Pacman module export

// IMPORTS
import { 
    createPacmanComponent, 
    initializePacmanFromGhosts, 
    handleAnswerResult,
    PACMAN_COMPONENT_CONFIG
} from './PacmanComponent/index.js';

import { 
    createPacmanContainer, 
    renderPacmanElement, 
    updatePacmanPosition,
    rerenderPageContent 
} from './PacmanRenderer/index.js';

import { 
    generatePacmanCommand, 
    processPacmanCommand, 
    createInitialPacmanState,
    calculatePagination,
    PAGINATION_CONFIG
} from './PacmanLogic/index.js';

import { 
    animatePacmanMovement, 
    createEatingEffects, 
    createExplosionEffects 
} from './Effects/index.js';

import { 
    PACMAN_CONFIG, 
    PACMAN_COMMANDS, 
    ANIMATION_CONFIG,
    PACMAN_ELEMENTS,
    PACMAN_VALIDATION
} from './pacmanConfig.js';

// OPERATIONS - Main Factory API
export const createPacman = (pacmanData) => {
    return {
        // Main API
        createPacmanComponent,
        initializePacmanFromGhosts,
        handleAnswerResult,
        
        // Rendering
        createPacmanContainer,
        renderPacmanElement,
        updatePacmanPosition,
        rerenderPageContent,
        
        // Logic
        generatePacmanCommand,
        processPacmanCommand,
        createInitialPacmanState,
        
        // Pagination
        calculatePagination,
        
        // Animations
        animatePacmanMovement,
        createEatingEffects,
        createExplosionEffects,
        
        // Direct component creation
        component: createPacmanComponent(pacmanData),
        
        // Configuration
        config: PACMAN_CONFIG,
        commands: PACMAN_COMMANDS,
        animation: ANIMATION_CONFIG
    };
};

// Enhanced API with fluent interface
export const createPacmanWithAPI = (totalGhosts) => {
    const component = initializePacmanFromGhosts(totalGhosts);
    
    if (!component) return null;
    
    return {
        ...component,
        
        // Enhanced API methods
        init: () => component.render(),
        destroy: () => component.cleanup(),
        onCorrectAnswer: (questionId) => handleAnswerResult(component, 'correct', questionId),
        onIncorrectAnswer: (questionId) => handleAnswerResult(component, 'incorrect', questionId),
        
        // Direct access to component
        component,
        
        // Configuration access
        getConfig: () => PACMAN_CONFIG,
        getCommands: () => PACMAN_COMMANDS
    };
};

// Quick initialization helper
export const initializePacman = (totalGhosts, autoRender = true) => {
    const component = initializePacmanFromGhosts(totalGhosts);
    
    if (component && autoRender) {
        component.render();
    }
    
    return component;
};

// Direct exports for external use
export {
    // Component API
    createPacmanComponent,
    initializePacmanFromGhosts,
    handleAnswerResult,
    
    // Rendering API
    createPacmanContainer,
    renderPacmanElement,
    updatePacmanPosition,
    rerenderPageContent,
    
    // Logic API
    generatePacmanCommand,
    processPacmanCommand,
    createInitialPacmanState,
    
    // Pagination API
    calculatePagination,
    
    // Animation API
    animatePacmanMovement,
    createEatingEffects,
    createExplosionEffects,
    
    // Configuration
    PACMAN_CONFIG,
    PACMAN_COMMANDS,
    ANIMATION_CONFIG,
    PACMAN_ELEMENTS,
    PACMAN_VALIDATION,
    PACMAN_COMPONENT_CONFIG,
    PAGINATION_CONFIG
}; 