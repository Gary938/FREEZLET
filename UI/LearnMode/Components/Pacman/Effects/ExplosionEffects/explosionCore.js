// Effects/ExplosionEffects/explosionCore.js - Core explosion effects

// IMPORTS
import { createUITracer } from '../../../../Utils/uiTracer.js';
import { PACMAN_CONFIG } from '../../pacmanConfig.js';
import { createExplosionRings } from './ringsEffects.js';
import { createBigExplosion } from './bigExplosionEffects.js';
import { createExplosionParticles } from './particleEffects.js';
import { createExplosionSparks } from './sparksEffects.js';
import { createExplosionSmoke } from './smokeEffects.js';

// CONFIG
const EXPLOSION_SEQUENCE = [
    { effect: 'rings', delay: 100 },
    { effect: 'bigExplosion', delay: 200 },
    { effect: 'particles', delay: 300 },
    { effect: 'sparks', delay: 400 },
    { effect: 'smoke', delay: 600 }
];

// OPERATIONS
export const createExplosionEffects = (container, pacman) => {
    const tracer = createUITracer('pacmanExplosion');
    
    // Guard clauses
    if (!container || !pacman) {
        tracer.trace('explosionEffects:invalidParams');
        return false;
    }
    
    const pacmanBottom = getPacmanBottom(pacman);
    
    // Add explosion class to pacman
    pacman.classList.add('exploding');
    
    // Start explosion effects sequence
    executeExplosionSequence(container, pacmanBottom);
    
    tracer.trace('explosionEffects:started', { pacmanBottom });
    return true;
};

export const createCustomExplosion = (container, position, effectTypes = []) => {
    // Guard clauses
    if (!container || !position) return false;
    
    const effects = effectTypes.length > 0 ? effectTypes : EXPLOSION_SEQUENCE;
    
    effects.forEach(({ effect, delay }) => {
        setTimeout(() => {
            executeExplosionEffect(container, position, effect);
        }, delay);
    });
    
    return true;
};

// HELPERS
const getPacmanBottom = (pacman) => {
    return parseInt(pacman.style.bottom) || PACMAN_CONFIG.INITIAL_PACMAN_BOTTOM;
};

const executeExplosionSequence = (container, bottom) => {
    EXPLOSION_SEQUENCE.forEach(({ effect, delay }) => {
        setTimeout(() => {
            executeExplosionEffect(container, bottom, effect);
        }, delay);
    });
};

const executeExplosionEffect = (container, bottom, effectType) => {
    const effectMap = {
        rings: () => createExplosionRings(container, bottom),
        bigExplosion: () => createBigExplosion(container, bottom),
        particles: () => createExplosionParticles(container, bottom),
        sparks: () => createExplosionSparks(container, bottom),
        smoke: () => createExplosionSmoke(container, bottom)
    };
    
    const effectFunction = effectMap[effectType];
    if (effectFunction) {
        effectFunction();
    }
}; 