// PacmanRenderer/positionCalculator.js - Simplified position and size calculations

// IMPORTS
import { PACMAN_CONFIG } from '../pacmanConfig.js';

// OPERATIONS
export const calculatePacmanPosition = (pacmanData) => {
    const { currentPosition, totalGhosts } = pacmanData;
    const containerHeight = window.innerHeight;
    const spacing = getGhostSpacing(totalGhosts);
    
    return PACMAN_CONFIG.INITIAL_PACMAN_BOTTOM + (spacing * currentPosition);
};

export const calculateGhostPosition = (index, totalGhosts) => {
    const containerHeight = window.innerHeight;
    const spacing = getGhostSpacing(totalGhosts);
    
    return containerHeight - spacing * (totalGhosts - index) - PACMAN_CONFIG.GHOST_BOTTOM_OFFSET;
};

export const getCalculatedSizes = (totalGhosts = 3) => {
    const containerHeight = window.innerHeight;
    const baseSize = Math.min(40, (containerHeight / (totalGhosts + 2)) * 0.7);
    
    return {
        baseSize,
        pacmanSize: baseSize * 2,
        ghostSize: baseSize * 0.9,
        eyeSize: baseSize * 0.5,
        eyeHeight: baseSize * 0.3,
        pupilSize: baseSize * 0.1,
        pupilHeight: baseSize * 0.2
    };
};

// HELPERS
const getGhostSpacing = (totalGhosts) => {
    const containerHeight = window.innerHeight;
    const sizes = getCalculatedSizes(totalGhosts);
    
    return (containerHeight - sizes.ghostSize - sizes.pacmanSize) / totalGhosts * 0.9;
}; 