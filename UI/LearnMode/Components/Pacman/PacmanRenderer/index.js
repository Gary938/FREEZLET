// PacmanRenderer/index.js - Centralized pacman rendering module export

// Main rendering operations (public API)
export {
    createPacmanContainer,
    renderPacmanElement,
    updatePacmanPosition,
    rerenderPageContent
} from './pacmanRenderer.js';

// For internal use in Pacman modules
export { createPacmanElement } from './pacmanElementBuilder.js';
export { createGhostElements, applyScaredAnimation } from './ghostElementBuilder.js';
export { 
    calculatePacmanPosition, 
    calculateGhostPosition, 
    getCalculatedSizes 
} from './positionCalculator.js'; 