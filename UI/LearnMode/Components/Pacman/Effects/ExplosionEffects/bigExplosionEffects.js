// Effects/ExplosionEffects/bigExplosionEffects.js - Big explosion effects

// IMPORTS
import { PACMAN_CONFIG } from '../../pacmanConfig.js';
import { findTrackElement } from '../MovementEffects/targetUtils.js';

// CONFIG
const BIG_EXPLOSION_CONFIG = {
    DURATION: 1800,
    SCALE_VARIANTS: ['small', 'medium', 'large'],
    COLORS: ['red', 'orange', 'yellow', 'white']
};

// OPERATIONS
export const createBigExplosion = (container, bottom) => {
    // Guard clauses
    if (!container || bottom == null) return false;
    
    const explosion = createExplosionElement(bottom);
    const track = findTrackElement(container, PACMAN_CONFIG.TRACK_CLASS);
    
    if (!track) return false;
    
    track.appendChild(explosion);
    scheduleExplosionRemoval(explosion);
    
    return true;
};

export const createMultipleBigExplosions = (container, positions, delays = []) => {
    // Guard clauses
    if (!container || !Array.isArray(positions)) return false;
    
    return positions.every((bottom, index) => {
        const delay = delays[index] || 0;
        
        setTimeout(() => {
            createBigExplosion(container, bottom);
        }, delay);
        
        return true;
    });
};

export const createColoredBigExplosion = (container, bottom, color = 'red') => {
    // Guard clauses
    if (!container || bottom == null) return false;
    
    const explosion = createColoredExplosionElement(bottom, color);
    const track = findTrackElement(container, PACMAN_CONFIG.TRACK_CLASS);
    
    if (!track) return false;
    
    track.appendChild(explosion);
    scheduleExplosionRemoval(explosion);
    
    return true;
};

// HELPERS
const createExplosionElement = (bottom) => {
    const explosion = document.createElement('div');
    explosion.className = 'pacman-big-explosion';
    explosion.style.bottom = `${bottom}px`;
    
    return explosion;
};

const createColoredExplosionElement = (bottom, color) => {
    const explosion = createExplosionElement(bottom);
    
    if (BIG_EXPLOSION_CONFIG.COLORS.includes(color)) {
        explosion.classList.add(`explosion-${color}`);
    }
    
    return explosion;
};

const scheduleExplosionRemoval = (explosion) => {
    setTimeout(() => {
        if (explosion.parentNode) {
            explosion.parentNode.removeChild(explosion);
        }
    }, BIG_EXPLOSION_CONFIG.DURATION);
}; 