// Effects/MovementEffects/targetUtils.js - Target element search utilities

// OPERATIONS
export const getTargetGhost = (container, index) => {
    // Guard clauses
    if (!container || index < 0) return null;
    
    return container.querySelector(`[data-index="${index}"]`);
};

export const findTrackElement = (container, trackClass) => {
    // Guard clauses
    if (!container || !trackClass) return null;
    
    return container.querySelector(`.${trackClass}`);
}; 