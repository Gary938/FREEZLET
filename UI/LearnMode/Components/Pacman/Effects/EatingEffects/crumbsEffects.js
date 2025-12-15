// Effects/EatingEffects/crumbsEffects.js - Crumbs effects

// IMPORTS
import { PACMAN_CONFIG } from '../../pacmanConfig.js';
import { findTrackElement } from '../MovementEffects/targetUtils.js';

// CONFIG
const CRUMBS_CONFIG = {
    MIN_CRUMBS: 5,
    MAX_ADDITIONAL_CRUMBS: 3,
    BASE_DISTANCE: 20,
    MAX_ADDITIONAL_DISTANCE: 30,
    VERTICAL_OFFSET: 10,
    CLEANUP_DELAY: 1000
};

// OPERATIONS
export const createCrumbsEffect = (container, bottom) => {
    // Guard clauses
    if (!container || bottom == null) return false;
    
    const numCrumbs = calculateCrumbsCount();
    const track = findTrackElement(container, PACMAN_CONFIG.TRACK_CLASS);
    
    if (!track) return false;
    
    const crumbs = [...Array(numCrumbs)].map((_, index) => 
        createSingleCrumb(track, bottom, index, numCrumbs)
    );
    
    crumbs.forEach(crumb => {
        if (crumb) {
            scheduleCrumbRemoval(crumb);
        }
    });
    
    return true;
};

export const createCustomCrumbs = (container, bottom, count, colors = []) => {
    // Guard clauses
    if (!container || bottom == null || count <= 0) return false;
    
    const track = findTrackElement(container, PACMAN_CONFIG.TRACK_CLASS);
    if (!track) return false;
    
    const crumbs = [...Array(count)].map((_, index) => 
        createColoredCrumb(track, bottom, index, count, colors[index % colors.length])
    );
    
    crumbs.forEach(crumb => {
        if (crumb) {
            scheduleCrumbRemoval(crumb);
        }
    });
    
    return true;
};

// HELPERS
const calculateCrumbsCount = () => {
    return CRUMBS_CONFIG.MIN_CRUMBS + Math.floor(Math.random() * CRUMBS_CONFIG.MAX_ADDITIONAL_CRUMBS);
};

const createSingleCrumb = (track, bottom, index, totalCrumbs) => {
    const crumb = document.createElement('div');
    crumb.className = 'pacman-crumb';
    crumb.style.bottom = `${bottom + CRUMBS_CONFIG.VERTICAL_OFFSET}px`;
    crumb.style.left = '50%';
    
    const { x, y } = calculateCrumbTrajectory(index, totalCrumbs);
    crumb.style.setProperty('--crumb-x', `${x}px`);
    crumb.style.setProperty('--crumb-y', `${y}px`);
    
    track.appendChild(crumb);
    return crumb;
};

const createColoredCrumb = (track, bottom, index, totalCrumbs, color) => {
    const crumb = createSingleCrumb(track, bottom, index, totalCrumbs);
    
    if (color && crumb) {
        crumb.style.backgroundColor = color;
    }
    
    return crumb;
};

const calculateCrumbTrajectory = (index, totalCrumbs) => {
    const angle = (Math.PI * 2 * index) / totalCrumbs + Math.random() * 0.5;
    const distance = CRUMBS_CONFIG.BASE_DISTANCE + Math.random() * CRUMBS_CONFIG.MAX_ADDITIONAL_DISTANCE;
    
    return {
        x: Math.cos(angle) * distance,
        y: Math.sin(angle) * distance
    };
};

const scheduleCrumbRemoval = (crumb) => {
    setTimeout(() => {
        if (crumb.parentNode) {
            crumb.parentNode.removeChild(crumb);
        }
    }, CRUMBS_CONFIG.CLEANUP_DELAY);
}; 