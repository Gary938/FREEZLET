// Effects/ExplosionEffects/smokeEffects.js - Explosion smoke effects

// IMPORTS
import { PACMAN_CONFIG, ANIMATION_CONFIG } from '../../pacmanConfig.js';
import { findTrackElement } from '../MovementEffects/targetUtils.js';

// CONFIG
const SMOKE_CONFIG = {
    MIN_SIZE: 25,
    MAX_SIZE: 40,
    VERTICAL_OFFSET: 5,
    STAGGER_DELAY: 0.2,
    DURATION: 3200,
    OPACITY_VARIANTS: [0.3, 0.5, 0.7, 0.9],
    COLORS: ['gray', 'darkgray', 'black', 'lightgray']
};

// OPERATIONS
export const createExplosionSmoke = (container, bottom) => {
    // Guard clauses
    if (!container || bottom == null) return false;
    
    const track = findTrackElement(container, PACMAN_CONFIG.TRACK_CLASS);
    if (!track) return false;
    
    const smokeCount = ANIMATION_CONFIG.EXPLOSION_SMOKE_COUNT;
    
    for (let i = 0; i < smokeCount; i++) {
        scheduleSmokePuff(track, bottom, i);
    }
    
    return true;
};

export const createColoredSmoke = (container, bottom, colors = [], opacities = []) => {
    // Guard clauses
    if (!container || bottom == null) return false;
    
    const track = findTrackElement(container, PACMAN_CONFIG.TRACK_CLASS);
    if (!track) return false;
    
    const smokeCount = ANIMATION_CONFIG.EXPLOSION_SMOKE_COUNT;
    
    for (let i = 0; i < smokeCount; i++) {
        const color = colors[i % colors.length] || getRandomSmokeColor();
        const opacity = opacities[i % opacities.length] || getRandomOpacity();
        scheduleColoredSmokePuff(track, bottom, i, color, opacity);
    }
    
    return true;
};

export const createLightSmoke = (container, bottom, intensity = 0.5) => {
    // Guard clauses
    if (!container || bottom == null || intensity <= 0) return false;
    
    const track = findTrackElement(container, PACMAN_CONFIG.TRACK_CLASS);
    if (!track) return false;
    
    const baseCount = ANIMATION_CONFIG.EXPLOSION_SMOKE_COUNT;
    const adjustedCount = Math.max(1, Math.floor(baseCount * intensity));
    
    for (let i = 0; i < adjustedCount; i++) {
        const lightOpacity = 0.2 + intensity * 0.3;
        scheduleColoredSmokePuff(track, bottom, i, 'lightgray', lightOpacity);
    }
    
    return true;
};

// HELPERS
const scheduleSmokePuff = (track, bottom, index) => {
    const delay = index * SMOKE_CONFIG.STAGGER_DELAY * 1000;
    
    setTimeout(() => {
        const smoke = createSmokeElement(bottom, index);
        track.appendChild(smoke);
        scheduleSmokeRemoval(smoke);
    }, delay);
};

const scheduleColoredSmokePuff = (track, bottom, index, color, opacity) => {
    const delay = index * SMOKE_CONFIG.STAGGER_DELAY * 1000;
    
    setTimeout(() => {
        const smoke = createColoredSmokeElement(bottom, index, color, opacity);
        track.appendChild(smoke);
        scheduleSmokeRemoval(smoke);
    }, delay);
};

const createSmokeElement = (bottom, index) => {
    const smoke = document.createElement('div');
    smoke.className = 'pacman-explosion-smoke';
    
    const size = calculateSmokeSize();
    applySmokeSize(smoke, size);
    applySmokePosition(smoke, bottom);
    applySmokeAnimation(smoke, index);
    
    return smoke;
};

const createColoredSmokeElement = (bottom, index, color, opacity) => {
    const smoke = createSmokeElement(bottom, index);
    
    if (SMOKE_CONFIG.COLORS.includes(color)) {
        smoke.style.backgroundColor = color;
    }
    
    if (opacity) {
        smoke.style.opacity = opacity;
    }
    
    return smoke;
};

const calculateSmokeSize = () => {
    return SMOKE_CONFIG.MIN_SIZE + Math.random() * (SMOKE_CONFIG.MAX_SIZE - SMOKE_CONFIG.MIN_SIZE);
};

const applySmokeSize = (smoke, size) => {
    smoke.style.width = `${size}px`;
    smoke.style.height = `${size}px`;
};

const applySmokePosition = (smoke, bottom) => {
    smoke.style.bottom = `${bottom + SMOKE_CONFIG.VERTICAL_OFFSET}px`;
};

const applySmokeAnimation = (smoke, index) => {
    smoke.style.animationDelay = `${index * SMOKE_CONFIG.STAGGER_DELAY}s`;
};

const getRandomSmokeColor = () => {
    return SMOKE_CONFIG.COLORS[Math.floor(Math.random() * SMOKE_CONFIG.COLORS.length)];
};

const getRandomOpacity = () => {
    return SMOKE_CONFIG.OPACITY_VARIANTS[Math.floor(Math.random() * SMOKE_CONFIG.OPACITY_VARIANTS.length)];
};

const scheduleSmokeRemoval = (smoke) => {
    setTimeout(() => {
        if (smoke.parentNode) {
            smoke.parentNode.removeChild(smoke);
        }
    }, SMOKE_CONFIG.DURATION);
}; 