// Effects/EatingEffects/flashEffects.js - Flash effects

// IMPORTS
import { PACMAN_CONFIG, ANIMATION_CONFIG } from '../../pacmanConfig.js';
import { findTrackElement } from '../MovementEffects/targetUtils.js';

// OPERATIONS
export const createFlashEffect = (container, bottom) => {
    // Guard clauses
    if (!container || bottom == null) return false;
    
    const flash = createFlashElement(bottom);
    const track = findTrackElement(container, PACMAN_CONFIG.TRACK_CLASS);
    
    if (!track) return false;
    
    track.appendChild(flash);
    scheduleFlashRemoval(flash);
    
    return true;
};

export const createMultipleFlashes = (container, positions) => {
    // Guard clauses
    if (!container || !Array.isArray(positions)) return false;
    
    return positions.every(bottom => createFlashEffect(container, bottom));
};

export const createColoredFlash = (container, bottom, color = 'white') => {
    // Guard clauses
    if (!container || bottom == null) return false;
    
    const flash = createFlashElement(bottom, color);
    const track = findTrackElement(container, PACMAN_CONFIG.TRACK_CLASS);
    
    if (!track) return false;
    
    track.appendChild(flash);
    scheduleFlashRemoval(flash);
    
    return true;
};

// HELPERS
const createFlashElement = (bottom, color = 'white') => {
    const flash = document.createElement('div');
    flash.className = 'pacman-flash-effect';
    flash.style.bottom = `${bottom}px`;
    
    if (color !== 'white') {
        flash.style.backgroundColor = color;
    }
    
    return flash;
};

const scheduleFlashRemoval = (flash) => {
    setTimeout(() => {
        if (flash.parentNode) {
            flash.parentNode.removeChild(flash);
        }
    }, ANIMATION_CONFIG.FLASH_DURATION);
}; 