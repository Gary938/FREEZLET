// Effects/ExplosionEffects/particleEffects.js - Explosion particle effects

// IMPORTS
import { PACMAN_CONFIG, ANIMATION_CONFIG } from '../../pacmanConfig.js';
import { findTrackElement } from '../MovementEffects/targetUtils.js';

// CONFIG
const PARTICLE_CONFIG = {
    TYPES: ['black', 'red', 'orange', 'yellow', 'white'],
    TYPE_PROBABILITIES: [0.3, 0.5, 0.7, 0.9, 1.0],
    MIN_SIZE: 2,
    MAX_SIZE: 8,
    BASE_DISTANCE: 30,
    MAX_DISTANCE: 90,
    VERTICAL_OFFSET: 20,
    MAX_VERTICAL_RANDOM: 30,
    DURATION: 2300,
    MAX_ANIMATION_DELAY: 0.3
};

// OPERATIONS
export const createExplosionParticles = (container, bottom) => {
    // Guard clauses
    if (!container || bottom == null) return false;
    
    const track = findTrackElement(container, PACMAN_CONFIG.TRACK_CLASS);
    if (!track) return false;
    
    const particlesCount = ANIMATION_CONFIG.EXPLOSION_PARTICLES_COUNT;
    
    for (let i = 0; i < particlesCount; i++) {
        const particle = createSingleParticle(bottom, i, particlesCount);
        track.appendChild(particle);
        scheduleParticleRemoval(particle);
    }
    
    return true;
};

export const createCustomParticles = (container, bottom, count, colors = []) => {
    // Guard clauses
    if (!container || bottom == null || count <= 0) return false;
    
    const track = findTrackElement(container, PACMAN_CONFIG.TRACK_CLASS);
    if (!track) return false;
    
    for (let i = 0; i < count; i++) {
        const color = colors[i % colors.length] || getRandomParticleType();
        const particle = createColoredParticle(bottom, i, count, color);
        track.appendChild(particle);
        scheduleParticleRemoval(particle);
    }
    
    return true;
};

// HELPERS
const createSingleParticle = (bottom, index, totalParticles) => {
    const particle = document.createElement('div');
    particle.className = 'pacman-explosion-particle';
    
    const particleType = getRandomParticleType();
    applyParticleType(particle, particleType);
    
    const size = PARTICLE_CONFIG.MIN_SIZE + Math.random() * (PARTICLE_CONFIG.MAX_SIZE - PARTICLE_CONFIG.MIN_SIZE);
    applyParticleSize(particle, size);
    
    const position = calculateParticlePosition(bottom, index, totalParticles);
    applyParticlePosition(particle, position);
    
    const animationDelay = Math.random() * PARTICLE_CONFIG.MAX_ANIMATION_DELAY;
    particle.style.animationDelay = `${animationDelay}s`;
    
    return particle;
};

const createColoredParticle = (bottom, index, totalParticles, color) => {
    const particle = createSingleParticle(bottom, index, totalParticles);
    applyParticleType(particle, color);
    
    return particle;
};

const getRandomParticleType = () => {
    const rand = Math.random();
    const { TYPES, TYPE_PROBABILITIES } = PARTICLE_CONFIG;
    
    for (let i = 0; i < TYPE_PROBABILITIES.length; i++) {
        if (rand < TYPE_PROBABILITIES[i]) {
            return TYPES[i];
        }
    }
    
    return TYPES[0];
};

const applyParticleType = (particle, type) => {
    if (type !== 'black') {
        particle.classList.add(type);
    }
};

const applyParticleSize = (particle, size) => {
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
};

const calculateParticlePosition = (bottom, index, totalParticles) => {
    const angle = (Math.PI * 2 * index) / totalParticles + Math.random() * 0.8;
    const distance = PARTICLE_CONFIG.BASE_DISTANCE + Math.random() * (PARTICLE_CONFIG.MAX_DISTANCE - PARTICLE_CONFIG.BASE_DISTANCE);
    const x = Math.cos(angle) * distance;
    const y = Math.sin(angle) * distance - Math.random() * PARTICLE_CONFIG.MAX_VERTICAL_RANDOM;
    
    return {
        bottom: bottom + PARTICLE_CONFIG.VERTICAL_OFFSET,
        x,
        y
    };
};

const applyParticlePosition = (particle, { bottom, x, y }) => {
    particle.style.bottom = `${bottom}px`;
    particle.style.setProperty('--particle-x', `${x}px`);
    particle.style.setProperty('--particle-y', `${y}px`);
};

const scheduleParticleRemoval = (particle) => {
    setTimeout(() => {
        if (particle.parentNode) {
            particle.parentNode.removeChild(particle);
        }
    }, PARTICLE_CONFIG.DURATION);
}; 