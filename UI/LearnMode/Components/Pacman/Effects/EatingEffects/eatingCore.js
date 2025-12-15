// Effects/EatingEffects/eatingCore.js - Core eating effects

// IMPORTS
import { createUITracer } from '../../../../Utils/uiTracer.js';
import { ANIMATION_CONFIG } from '../../pacmanConfig.js';
import { createPopupNumber } from './popupEffects.js';
import { createFlashEffect } from './flashEffects.js';
import { createCrumbsEffect } from './crumbsEffects.js';

// OPERATIONS
export const createEatingEffects = (container, ghost, number) => {
    const tracer = createUITracer('pacmanEating');
    
    // Guard clauses
    if (!container || !ghost) {
        tracer.trace('eatingEffects:invalidParams');
        return false;
    }
    
    const ghostBottom = parseInt(ghost.style.bottom);
    
    // Apply disappearance effect to ghost
    applyGhostDisappearEffect(ghost);
    
    // Create all eating effects
    createPopupNumber(container, number, ghostBottom);
    createFlashEffect(container, ghostBottom);
    createCrumbsEffect(container, ghostBottom);
    
    // Scare remaining ghosts
    scareRemainingGhosts(container, ghost);
    
    // Remove ghost after animation
    scheduleGhostRemoval(ghost);
    
    tracer.trace('eatingEffects:created', { number, ghostBottom });
    return true;
};

export const createGhostDisappearEffect = (ghost) => {
    // Guard clauses
    if (!ghost) return false;
    
    applyGhostDisappearEffect(ghost);
    return true;
};

// Function to scare remaining ghosts
export const scareRemainingGhosts = (container, eatenGhost) => {
    if (!container || !eatenGhost) return false;
    
    const remainingGhosts = container.querySelectorAll('.pacman-ghost:not(.eaten)');
    
    remainingGhosts.forEach(ghost => {
        if (ghost !== eatenGhost && Math.random() > 0.5) { // 50% chance to get scared
            ghost.classList.add('scared');
            
            // Remove scared after short time
            setTimeout(() => {
                if (ghost.parentNode) {
                    ghost.classList.remove('scared');
                }
            }, 1000 + Math.random() * 2000); // 1-3 seconds
        }
    });
    
    return true;
};

// HELPERS
const applyGhostDisappearEffect = (ghost) => {
    ghost.style.transform = 'translateX(-50%) scale(1.5)';
    ghost.style.opacity = '0';
    ghost.classList.add('eaten'); // Mark as eaten
};

const scheduleGhostRemoval = (ghost) => {
    setTimeout(() => {
        if (ghost.parentNode) {
            ghost.parentNode.removeChild(ghost);
        }
    }, ANIMATION_CONFIG.CLEANUP_DELAY);
}; 