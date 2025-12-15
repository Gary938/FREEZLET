// Effects/EatingEffects/popupEffects.js - Popup number effects

// IMPORTS
import { PACMAN_CONFIG, ANIMATION_CONFIG } from '../../pacmanConfig.js';
import { findTrackElement } from '../MovementEffects/targetUtils.js';

// OPERATIONS
export const createPopupNumber = (container, number, bottom) => {
    // Guard clauses
    if (!container || number == null || bottom == null) return false;
    
    const popup = createPopupElement(number, bottom);
    const track = findTrackElement(container, PACMAN_CONFIG.TRACK_CLASS);
    
    if (!track) return false;
    
    track.appendChild(popup);
    schedulePopupRemoval(popup);
    
    return true;
};

export const createMultiplePopups = (container, numbers, bottom) => {
    // Guard clauses
    if (!container || !Array.isArray(numbers) || bottom == null) return false;
    
    return numbers.every((number, index) => {
        const offset = index * 5; // Small offset for each number
        return createPopupNumber(container, number, bottom + offset);
    });
};

// HELPERS
const createPopupElement = (number, bottom) => {
    const popup = document.createElement('div');
    popup.className = 'pacman-popup-number';
    popup.textContent = number;
    popup.style.bottom = `${bottom}px`;
    
    return popup;
};

const schedulePopupRemoval = (popup) => {
    setTimeout(() => {
        if (popup.parentNode) {
            popup.parentNode.removeChild(popup);
        }
    }, ANIMATION_CONFIG.POPUP_DURATION);
}; 