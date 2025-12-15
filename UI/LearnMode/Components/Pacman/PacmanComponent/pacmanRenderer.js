// PacmanComponent/pacmanRenderer.js - Pacman rendering and DOM operations

// IMPORTS
import { createUITracer } from '../../../Utils/uiTracer.js';
import { updatePacmanPosition } from '../PacmanRenderer/index.js';
import { PACMAN_CONFIG } from '../pacmanConfig.js';

// OPERATIONS
export const renderPacmanToOuterArea = (container, pacmanData) => {
    const tracer = createUITracer('pacmanComponent');
    
    const outerArea = document.getElementById('outerArea');
    if (!outerArea) {
        tracer.trace('renderPacman:noOuterArea');
        return false;
    }
    
    const existingContainer = document.getElementById(PACMAN_CONFIG.CONTAINER_ID);
    if (existingContainer && existingContainer.parentNode) {
        existingContainer.parentNode.removeChild(existingContainer);
    }
    
    outerArea.appendChild(container);
    
    tracer.trace('renderPacman:success', { 
        addedToOuterArea: true,
        totalGhosts: pacmanData?.totalGhosts 
    });
    
    return true;
};

export const cleanupPacman = (container) => {
    if (container?.parentNode) {
        container.parentNode.removeChild(container);
    }
};

export const updatePacmanData = (container, newData) => {
    if (!container || !newData) return false;
    
    const success = updatePacmanPosition(container, newData);
    return success;
}; 