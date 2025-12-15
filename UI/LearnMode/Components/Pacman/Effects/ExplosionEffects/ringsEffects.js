// Effects/ExplosionEffects/ringsEffects.js - Explosion ring effects

// IMPORTS
import { PACMAN_CONFIG, ANIMATION_CONFIG } from '../../pacmanConfig.js';
import { findTrackElement } from '../MovementEffects/targetUtils.js';

// CONFIG
const RINGS_CONFIG = {
    RING_DELAY: 150,
    RING_DURATION: 1200,
    VERTICAL_OFFSET: 10
};

// OPERATIONS
export const createExplosionRings = (container, bottom) => {
    // Guard clauses
    if (!container || bottom == null) return false;
    
    const track = findTrackElement(container, PACMAN_CONFIG.TRACK_CLASS);
    if (!track) return false;
    
    const ringsCount = ANIMATION_CONFIG.EXPLOSION_RINGS_COUNT;
    
    for (let i = 0; i < ringsCount; i++) {
        scheduleRingCreation(track, bottom, i);
    }
    
    return true;
};

export const createCustomRings = (container, bottom, count, colors = []) => {
    // Guard clauses
    if (!container || bottom == null || count <= 0) return false;
    
    const track = findTrackElement(container, PACMAN_CONFIG.TRACK_CLASS);  
    if (!track) return false;
    
    for (let i = 0; i < count; i++) {
        const color = colors[i % colors.length];
        scheduleColoredRingCreation(track, bottom, i, color);
    }
    
    return true;
};

// HELPERS
const scheduleRingCreation = (track, bottom, index) => {
    setTimeout(() => {
        const ring = createRingElement(bottom, index);
        track.appendChild(ring);
        scheduleRingRemoval(ring);
    }, index * RINGS_CONFIG.RING_DELAY);
};

const scheduleColoredRingCreation = (track, bottom, index, color) => {
    setTimeout(() => {
        const ring = createColoredRingElement(bottom, index, color);
        track.appendChild(ring);
        scheduleRingRemoval(ring);
    }, index * RINGS_CONFIG.RING_DELAY);
};

const createRingElement = (bottom, index) => {
    const ring = document.createElement('div');
    ring.className = 'pacman-explosion-ring';
    ring.style.bottom = `${bottom + RINGS_CONFIG.VERTICAL_OFFSET}px`;
    ring.style.animationDelay = `${index * 0.1}s`;
    
    return ring;
};

const createColoredRingElement = (bottom, index, color) => {
    const ring = createRingElement(bottom, index);
    
    if (color) {
        ring.style.borderColor = color;
    }
    
    return ring;
};

const scheduleRingRemoval = (ring) => {
    setTimeout(() => {
        if (ring.parentNode) {
            ring.parentNode.removeChild(ring);
        }
    }, RINGS_CONFIG.RING_DURATION);
}; 