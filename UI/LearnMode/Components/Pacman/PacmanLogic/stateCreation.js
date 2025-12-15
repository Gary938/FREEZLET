// PacmanLogic/stateCreation.js - Pacman initial state creation and validation

// IMPORTS
import { PACMAN_COMMANDS, PACMAN_VALIDATION } from '../pacmanConfig.js';
import { calculatePagination, validatePagination } from './paginationLogic.js';

// OPERATIONS
export const createInitialPacmanState = (totalQuestions) => {
    // Guard clauses
    if (!totalQuestions || totalQuestions < PACMAN_VALIDATION.MIN_GHOSTS) {
        return null;
    }
    
    // Pagination calculation
    const pagination = calculatePagination(Math.min(totalQuestions, PACMAN_VALIDATION.MAX_GHOSTS));
    
    if (!validatePagination(pagination)) {
        return null;
    }
    
    const currentPageData = pagination.pages[0];
    
    return {
        totalQuestions,
        pagination,
        currentPage: 0,
        currentPageData,
        
        totalGhosts: currentPageData.ghostCount,
        currentPosition: 0,
        lastAction: PACMAN_COMMANDS.INIT,
        isAnimating: false,
        createdTime: Date.now(),
        updateTime: Date.now()
    };
}; 