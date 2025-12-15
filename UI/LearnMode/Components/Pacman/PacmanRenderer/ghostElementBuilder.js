// PacmanRenderer/ghostElementBuilder.js - Ghost element creation

// IMPORTS
import { PACMAN_CONFIG, PACMAN_ELEMENTS } from '../pacmanConfig.js';
import { getCalculatedSizes, calculateGhostPosition } from './positionCalculator.js';

// OPERATIONS
export const createGhostElements = (pageData, globalStartIndex = 0) => {
    const ghosts = [];
    const colors = PACMAN_CONFIG.GHOST_COLORS;
    
    // If old format passed (number instead of object), use old logic
    if (typeof pageData === 'number') {
        return createGhostElementsLegacy(pageData);
    }
    
    const { ghostCount } = pageData;
    const sizes = getCalculatedSizes(ghostCount);
    
    for (let i = 0; i < ghostCount; i++) {
        const ghost = document.createElement('div');
        ghost.className = PACMAN_CONFIG.GHOST_CLASS;
        ghost.dataset.index = i;
        ghost.dataset.globalIndex = globalStartIndex + i;
        
        // Last ghost on CURRENT PAGE is bold
        const sizeMultiplier = (i === ghostCount - 1) ? 
            PACMAN_CONFIG.LAST_GHOST_MULTIPLIER : 
            PACMAN_CONFIG.GHOST_SIZE_MULTIPLIER;
            
        const size = sizes.ghostSize * sizeMultiplier;
        const position = calculateGhostPosition(i, ghostCount);
        
        ghost.style.width = `${size}px`;
        ghost.style.height = `${size}px`;
        ghost.style.bottom = `${position}px`;
        ghost.style.background = colors[(globalStartIndex + i) % colors.length];
        ghost.style.animation = `ghost-bob ${1 + Math.random()}s infinite ease-in-out`;
        ghost.style.animationDelay = `${Math.random()}s`;
        
        appendGhostEyes(ghost, size);
        
        // Randomly apply scared animation to some ghosts
        if (Math.random() > 0.7) { // 30% chance to be scared
            applyScaredAnimation(ghost);
        }
        
        ghosts.push(ghost);
    }
    
    return ghosts;
};

// Old logic for backward compatibility
const createGhostElementsLegacy = (totalGhosts) => {
    const ghosts = [];
    const colors = PACMAN_CONFIG.GHOST_COLORS;
    const sizes = getCalculatedSizes(totalGhosts);
    
    for (let i = 0; i < totalGhosts; i++) {
        const ghost = document.createElement('div');
        ghost.className = PACMAN_CONFIG.GHOST_CLASS;
        ghost.dataset.index = i;
        
        const sizeMultiplier = (i === totalGhosts - 1) ? 
            PACMAN_CONFIG.LAST_GHOST_MULTIPLIER : 
            PACMAN_CONFIG.GHOST_SIZE_MULTIPLIER;
            
        const size = sizes.ghostSize * sizeMultiplier;
        const position = calculateGhostPosition(i, totalGhosts);
        
        ghost.style.width = `${size}px`;
        ghost.style.height = `${size}px`;
        ghost.style.bottom = `${position}px`;
        ghost.style.background = colors[i % colors.length];
        ghost.style.animation = `ghost-bob ${1 + Math.random()}s infinite ease-in-out`;
        ghost.style.animationDelay = `${Math.random()}s`;
        
        appendGhostEyes(ghost, size);
        
        if (Math.random() > 0.7) {
            applyScaredAnimation(ghost);
        }
        
        ghosts.push(ghost);
    }
    
    return ghosts;
};

// Function to apply scared animation
export const applyScaredAnimation = (ghost) => {
    if (!ghost) return false;
    
    ghost.classList.add('scared');
    
    // Remove scared after random time
    setTimeout(() => {
        if (ghost.parentNode) {
            ghost.classList.remove('scared');
        }
    }, 2000 + Math.random() * 3000); // 2-5 seconds
    
    return true;
};

// HELPERS
const appendGhostEyes = (ghost, size) => {
    const face = document.createElement('div');
    face.style.cssText = `
        position: absolute;
        top: 30%;
        left: 50%;
        transform: translate(-50%, -50%);
        display: flex;
        justify-content: space-between;
        width: ${size * 0.6}px;
    `;
    
    const eye1 = createGhostEye(size);
    const eye2 = createGhostEye(size);
    
    face.appendChild(eye1);
    face.appendChild(eye2);
    ghost.appendChild(face);
    
    // Add wavy mouth
    const mouth = createGhostMouth(size);
    ghost.appendChild(mouth);
};

const createGhostEye = (ghostSize) => {
    const eye = document.createElement('div');
    eye.className = 'pacman-ghost-eye';
    eye.style.width = `${ghostSize * 0.15}px`;
    eye.style.height = `${ghostSize * 0.15}px`;
    
    const pupil = document.createElement('div');
    pupil.className = 'pacman-ghost-pupil';
    pupil.style.width = `${ghostSize * 0.08}px`;
    pupil.style.height = `${ghostSize * 0.08}px`;
    
    eye.appendChild(pupil);
    return eye;
};

const createGhostMouth = (ghostSize) => {
    const mouth = document.createElement('div');
    mouth.className = PACMAN_ELEMENTS.GHOST_MOUTH;
    mouth.style.width = `${ghostSize * 0.4}px`;
    mouth.style.height = `${ghostSize * 0.15}px`;
    mouth.style.top = '55%';
    mouth.style.left = '50%';
    
    return mouth;
}; 