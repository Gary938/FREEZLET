// Effects/MovementEffects/movementAnimations.js - Pacman movement animations

// IMPORTS
import { createUITracer } from '../../../../Utils/uiTracer.js';
import { PACMAN_CONFIG, ANIMATION_CONFIG } from '../../pacmanConfig.js';
import { getTargetGhost } from './targetUtils.js';

// OPERATIONS
export const animatePacmanMovement = (container, pacmanData, onComplete = null) => {
    const tracer = createUITracer('pacmanMovement');
    
    // Guard clauses
    if (!container || !pacmanData) {
        tracer.trace('animateMovement:invalidParams');
        return false;
    }
    
    const pacman = container.querySelector(`.${PACMAN_CONFIG.PACMAN_CLASS}`);
    const targetGhost = getTargetGhost(container, Math.max(0, pacmanData.currentPosition - 1));
    
    if (!pacman || !targetGhost) {
        tracer.trace('animateMovement:elementsNotFound');
        return false;
    }
    
    // Precise stop position calculation considering element sizes
    const ghostBottom = parseInt(targetGhost.style.bottom);
    const ghostHeight = targetGhost.offsetHeight;
    const pacmanHeight = pacman.offsetHeight;
    const targetPosition = ghostBottom + ghostHeight - pacmanHeight;
    
    pacman.style.bottom = `${targetPosition}px`;
    
    // Start eating effects after animation
    setTimeout(() => {
        // Import eating effects dynamically to avoid circular dependencies
        import('../EatingEffects/index.js').then(({ createEatingEffects }) => {
            createEatingEffects(container, targetGhost, pacmanData.currentPosition);
        });
        
        if (onComplete) onComplete();
    }, ANIMATION_CONFIG.MOVEMENT_DURATION);
    
    tracer.trace('animateMovement:started', { 
        ghostBottom,
        ghostHeight,
        pacmanHeight,
        targetPosition,
        currentPosition: pacmanData.currentPosition
    });
    
    return true;
}; 