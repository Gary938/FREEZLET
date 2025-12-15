// PacmanRenderer/pacmanRenderer.js - Main pacman rendering operations

// IMPORTS
import { createUITracer } from '../../../Utils/uiTracer.js';
import { PACMAN_CONFIG } from '../pacmanConfig.js';
import { createPacmanElement } from './pacmanElementBuilder.js';
import { createGhostElements } from './ghostElementBuilder.js';
import { calculatePacmanPosition, getCalculatedSizes } from './positionCalculator.js';

// OPERATIONS
export const createPacmanContainer = () => {
    const tracer = createUITracer('pacmanRenderer');
    
    const container = document.createElement('div');
    container.id = PACMAN_CONFIG.CONTAINER_ID;
    container.className = PACMAN_CONFIG.CONTAINER_CLASS;
    
    const progressTrack = document.createElement('div');
    progressTrack.className = PACMAN_CONFIG.TRACK_CLASS;
    
    container.appendChild(progressTrack);
    
    tracer.trace('createContainer:success');
    return container;
};

export const renderPacmanElement = (container, pacmanData) => {
    const tracer = createUITracer('pacmanRenderer');
    
    // Guard clauses
    if (!container || !pacmanData) {
        tracer.trace('renderPacman:invalidParams');
        return false;
    }
    
    const track = container.querySelector(`.${PACMAN_CONFIG.TRACK_CLASS}`);
    if (!track) {
        tracer.trace('renderPacman:noTrack');
        return false;
    }
    
    // Clear track
    track.innerHTML = '';
    
    // Create pacman
    const pacmanElement = createPacmanElement(pacmanData.totalGhosts);
    track.appendChild(pacmanElement);
    
    // Create ghosts (pagination support)
    const ghostElements = pacmanData.currentPageData ? 
        createGhostElements(pacmanData.currentPageData, pacmanData.currentPageData.startGhost) :
        createGhostElements(pacmanData.totalGhosts);
    ghostElements.forEach(ghost => track.appendChild(ghost));
    
    tracer.trace('renderPacman:success', { 
        totalGhosts: pacmanData.totalGhosts 
    });
    
    return true;
};

// New function for page re-render
export const rerenderPageContent = (container, pageState) => {
    const tracer = createUITracer('pacmanRenderer');
    
    // Guard clauses
    if (!container || !pageState?.currentPageData) {
        tracer.trace('rerenderPage:invalidParams');
        return false;
    }
    
    const track = container.querySelector(`.${PACMAN_CONFIG.TRACK_CLASS}`);
    if (!track) {
        tracer.trace('rerenderPage:noTrack');
        return false;
    }
    
    // Get new sizes for current page
    const newSizes = getCalculatedSizes ? getCalculatedSizes(pageState.currentPageData.ghostCount) : { pacmanSize: 80, ghostSize: 36 }; // fallback
    
    // Update pacman size to match new scale
    const pacman = track.querySelector(`.${PACMAN_CONFIG.PACMAN_CLASS}`);
    if (pacman) {
        pacman.style.width = `${newSizes.pacmanSize}px`;
        pacman.style.height = `${newSizes.pacmanSize}px`;
        pacman.style.bottom = `${PACMAN_CONFIG.INITIAL_PACMAN_BOTTOM}px`;
        
        // Update eye and pupil sizes
        const eye = pacman.querySelector('.pacman-eye');
        const pupil = pacman.querySelector('.pacman-pupil');
        
        if (eye) {
            eye.style.width = `${newSizes.eyeSize}px`;
            eye.style.height = `${newSizes.eyeHeight}px`;
        }
        
        if (pupil) {
            pupil.style.width = `${newSizes.pupilSize}px`;
            pupil.style.height = `${newSizes.pupilHeight}px`;
        }
        
        // Update CSS variables for horns
        const baseSize = 80;
        const multiplier = newSizes.pacmanSize / baseSize;
        
        const hornSize = Math.round(6 * multiplier);
        const hornHeight = Math.round(16 * multiplier);
        const hornOffset = Math.round(4 * multiplier);
        const hornTop = Math.round(-1 * multiplier);
        
        document.documentElement.style.setProperty('--horn-size', `${hornSize}px`);
        document.documentElement.style.setProperty('--horn-height', `${hornHeight}px`);
        document.documentElement.style.setProperty('--horn-offset', `${hornOffset}px`);
        document.documentElement.style.setProperty('--horn-top', `${hornTop}px`);
        
        tracer.trace('rerenderPage:pacmanResized', {
            newPacmanSize: newSizes.pacmanSize,
            eyeSize: newSizes.eyeSize,
            pupilSize: newSizes.pupilSize,
            ghostCount: pageState.currentPageData.ghostCount
        });
    }
    
    // Clear only ghosts, keep pacman
    const ghosts = track.querySelectorAll(`.${PACMAN_CONFIG.GHOST_CLASS}`);
    ghosts.forEach(ghost => ghost.remove());
    
    // Create ghosts for new page
    const newGhosts = createGhostElements(
        pageState.currentPageData, 
        pageState.currentPageData.startGhost
    );
    
    newGhosts.forEach(ghost => track.appendChild(ghost));
    
    tracer.trace('rerenderPage:success', {
        newPageIndex: pageState.currentPage,
        ghostCount: pageState.currentPageData.ghostCount,
        pacmanSize: newSizes.pacmanSize
    });
    
    return true;
};

export const updatePacmanPosition = (container, pacmanData) => {
    const tracer = createUITracer('pacmanRenderer');
    
    // Guard clauses
    if (!container || !pacmanData) return false;
    
    const pacman = container.querySelector(`.${PACMAN_CONFIG.PACMAN_CLASS}`);
    if (!pacman) return false;
    
    // Use CURRENT PAGE ghost count for position calculation
    const ghostCount = pacmanData.currentPageData ? 
        pacmanData.currentPageData.ghostCount : 
        pacmanData.totalGhosts;
    
    // Create temporary object with correct ghost count for calculation
    const adjustedData = {
        ...pacmanData,
        totalGhosts: ghostCount
    };
    
    // Calculate new position
    const newPosition = calculatePacmanPosition(adjustedData);
    
    // Apply CSS transition for animation
    pacman.style.bottom = `${newPosition}px`;
    
    tracer.trace('updatePosition:success', { 
        position: pacmanData.currentPosition,
        newBottom: newPosition,
        ghostCount: ghostCount
    });
    
    return true;
}; 