// PacmanComponent/pacmanFactory.js - Pacman component factory

// IMPORTS
import { createUITracer } from '../../../Utils/uiTracer.js';
import { createPacmanContainer, renderPacmanElement } from '../PacmanRenderer/index.js';
import { createInitialPacmanState } from '../PacmanLogic/index.js';
import { PACMAN_CONFIG, PACMAN_VALIDATION } from '../pacmanConfig.js';
import { renderPacmanToOuterArea, cleanupPacman, updatePacmanData } from './pacmanRenderer.js';
import { processPacmanCommandInComponent } from './pacmanHandler.js';
import { saveStateToContainer } from './pacmanState.js';

// CONFIG
export const PACMAN_COMPONENT_CONFIG = {
    CONTAINER_ID: PACMAN_CONFIG.CONTAINER_ID,
    AUTO_CLEANUP: true,
    DEFAULT_ANIMATION: true,
    PARENT_SELECTOR: '#outerArea'
};

// OPERATIONS
export const createPacmanComponent = (pacmanData, onMoveComplete = null) => {
    const tracer = createUITracer('pacmanComponent');
    
    // Guard clauses - new pagination structure support
    if (!pacmanData || (!pacmanData.totalGhosts && !pacmanData.currentPageData)) {
        tracer.trace('createPacman:invalidData', { pacmanData });
        return null;
    }
    
    const container = createPacmanContainer();
    const isRendered = renderPacmanElement(container, pacmanData);
    
    if (!isRendered) {
        tracer.trace('createPacman:renderFailed');
        return null;
    }
    
    // IMPORTANT: Save full state to DOM immediately after creation
    saveStateToContainer(container, pacmanData);
    
    // Logging with pagination support
    const ghostCount = pacmanData.totalGhosts || pacmanData.currentPageData?.ghostCount;
    const paginationInfo = pacmanData.pagination ? {
        needsPagination: pacmanData.pagination.needsPagination,
        totalPages: pacmanData.pagination.totalPages,
        currentPage: pacmanData.currentPage
    } : null;
    
    tracer.trace('createPacman:success', { 
        totalGhosts: ghostCount,
        paginationInfo
    });
    
    return {
        element: container,
        data: pacmanData,
        render: () => renderPacmanToOuterArea(container, pacmanData),
        cleanup: () => cleanupPacman(container),
        updateData: (newData) => updatePacmanData(container, newData),
        processCommand: (command) => processPacmanCommandInComponent(container, command, onMoveComplete)
    };
};

export const initializePacmanFromGhosts = (totalGhosts) => {
    const tracer = createUITracer('pacmanComponent');
    
    // Guard clauses
    if (!totalGhosts || totalGhosts < PACMAN_VALIDATION.MIN_GHOSTS) {
        tracer.trace('initPacman:invalidGhosts', { totalGhosts });
        return null;
    }
    
    const pacmanData = createInitialPacmanState(totalGhosts);
    if (!pacmanData) {
        tracer.trace('initPacman:stateCreationFailed');
        return null;
    }
    
    const component = createPacmanComponent(pacmanData);
    tracer.trace('initPacman:success', { totalGhosts });
    
    return component;
}; 