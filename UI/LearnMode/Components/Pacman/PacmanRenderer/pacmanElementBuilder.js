// PacmanRenderer/pacmanElementBuilder.js - Pacman element creation

// IMPORTS
import { PACMAN_CONFIG, PACMAN_ELEMENTS } from '../pacmanConfig.js';
import { getCalculatedSizes } from './positionCalculator.js';

// OPERATIONS
export const createPacmanElement = (totalGhosts = 3) => {
    const pacman = document.createElement('div');
    pacman.className = PACMAN_CONFIG.PACMAN_CLASS;
    
    const sizes = getCalculatedSizes(totalGhosts);
    
    pacman.style.width = `${sizes.pacmanSize}px`;
    pacman.style.height = `${sizes.pacmanSize}px`;
    pacman.style.bottom = `${PACMAN_CONFIG.INITIAL_PACMAN_BOTTOM}px`;
    
    pacman.dataset.totalGhosts = totalGhosts;
    pacman.dataset.currentPosition = 0;
    pacman.dataset.bodySize = sizes.pacmanSize;
    
    // Set CSS variables for dynamic horn sizes
    setCSSVariablesForHorns(sizes);
    
    appendPacmanFeatures(pacman, sizes);
    
    return pacman;
};

// HELPERS
const setCSSVariablesForHorns = (sizes) => {
    const baseSize = 80; // Base size from configuration
    const multiplier = sizes.pacmanSize / baseSize;
    
    // Calculate horn sizes with fixes to eliminate gaps
    const hornSize = Math.round(6 * multiplier);
    const hornHeight = Math.round(16 * multiplier);  // Increased for tight fit
    const hornOffset = Math.round(4 * multiplier);   // Shifted to center  
    const hornTop = Math.round(-1 * multiplier);     // Closer to head
    
    // Set CSS variables for dynamic control
    document.documentElement.style.setProperty('--horn-size', `${hornSize}px`);
    document.documentElement.style.setProperty('--horn-height', `${hornHeight}px`);
    document.documentElement.style.setProperty('--horn-offset', `${hornOffset}px`);
    document.documentElement.style.setProperty('--horn-top', `${hornTop}px`);
};

const appendPacmanFeatures = (pacman, sizes) => {
    const hornLeft = createHorn(PACMAN_ELEMENTS.HORN_LEFT);
    const hornRight = createHorn(PACMAN_ELEMENTS.HORN_RIGHT);
    const eyeContainer = createEyeWithPupil(sizes);
    
    pacman.appendChild(hornLeft);
    pacman.appendChild(hornRight);
    pacman.appendChild(eyeContainer);
};

const createHorn = (className) => {
    const horn = document.createElement('div');
    horn.className = className;
    return horn;
};

const createEyeWithPupil = (sizes) => {
    const eyeContainer = document.createElement('div');
    eyeContainer.className = PACMAN_ELEMENTS.EYE_CONTAINER;
    
    const eye = document.createElement('div');
    eye.className = PACMAN_ELEMENTS.EYE;
    eye.style.width = `${sizes.eyeSize}px`;
    eye.style.height = `${sizes.eyeHeight}px`;
    
    const pupil = document.createElement('div');
    pupil.className = PACMAN_ELEMENTS.PUPIL;
    pupil.style.width = `${sizes.pupilSize}px`;
    pupil.style.height = `${sizes.pupilHeight}px`;
    
    const shine = document.createElement('div');
    shine.className = PACMAN_ELEMENTS.SHINE;
    
    const eyelid = document.createElement('div');
    eyelid.className = PACMAN_ELEMENTS.EYELID;
    
    eye.appendChild(pupil);
    eye.appendChild(shine);
    eyeContainer.appendChild(eye);
    eyeContainer.appendChild(eyelid);
    
    return eyeContainer;
}; 