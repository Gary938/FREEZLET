// PacmanComponent/index.js - Centralized pacman component export

// IMPORTS
import { 
    createPacmanComponent, 
    initializePacmanFromGhosts,
    PACMAN_COMPONENT_CONFIG 
} from './pacmanFactory.js';

import { 
    handleAnswerResult, 
    processPacmanCommandInComponent 
} from './pacmanHandler.js';

import { 
    renderPacmanToOuterArea, 
    cleanupPacman, 
    updatePacmanData 
} from './pacmanRenderer.js';

import { 
    extractCurrentState, 
    saveStateToContainer 
} from './pacmanState.js';

// OPERATIONS - Main API exports
export {
    // Factory functions
    createPacmanComponent,
    initializePacmanFromGhosts,
    
    // Handler functions
    handleAnswerResult,
    
    // Renderer functions
    renderPacmanToOuterArea,
    cleanupPacman,
    updatePacmanData,
    
    // State functions
    extractCurrentState,
    saveStateToContainer,
    
    // Configuration
    PACMAN_COMPONENT_CONFIG
};

// HELPERS - Internal exports for cross-module usage
export {
    processPacmanCommandInComponent
}; 