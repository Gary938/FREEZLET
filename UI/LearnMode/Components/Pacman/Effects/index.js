// Effects/index.js - Centralized export of all pacman effects

// Movement effects
export { 
    animatePacmanMovement 
} from './MovementEffects/index.js';

// Target utilities
export { 
    getTargetGhost,
    findTrackElement 
} from './MovementEffects/index.js';

// Eating effects
export { 
    createEatingEffects,
    createGhostDisappearEffect,
    createPopupNumber,
    createMultiplePopups,
    createFlashEffect,
    createMultipleFlashes,
    createColoredFlash,
    createCrumbsEffect,
    createCustomCrumbs 
} from './EatingEffects/index.js';

// Explosion effects
export { 
    createExplosionEffects,
    createCustomExplosion,
    createExplosionRings,
    createCustomRings,
    createBigExplosion,
    createMultipleBigExplosions,
    createColoredBigExplosion,
    createExplosionParticles,
    createCustomParticles,
    createExplosionSparks,
    createColoredSparks,
    createRadialSparks,
    createExplosionSmoke,
    createColoredSmoke,
    createLightSmoke 
} from './ExplosionEffects/index.js';