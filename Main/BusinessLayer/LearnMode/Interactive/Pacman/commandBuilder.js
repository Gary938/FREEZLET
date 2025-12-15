// Interactive/Pacman/commandBuilder.js - Creating pacman initialization commands with pagination

// IMPORTS
import { PACMAN_COMMANDS } from '../../Config/pacmanConfig.js';
import { trace } from '../../Utils/tracer.js';

// CONFIG - Pagination configuration (copy from UI for independence)
const PAGINATION_CONFIG = {
    MAX_GHOSTS_PER_PAGE: 30,
    MIN_GHOSTS_FOR_PAGINATION: 31
};

// OPERATIONS
const calculatePagination = (totalQuestions) => {
    const { MAX_GHOSTS_PER_PAGE } = PAGINATION_CONFIG;
    
    if (!totalQuestions || totalQuestions <= 0) {
        return {
            totalPages: 0,
            ghostsPerPage: 0,
            pages: [],
            needsPagination: false
        };
    }
    
    if (totalQuestions <= MAX_GHOSTS_PER_PAGE) {
        return {
            totalPages: 1,
            ghostsPerPage: totalQuestions,
            pages: [{
                pageIndex: 0,
                startGhost: 0,
                endGhost: totalQuestions,
                ghostCount: totalQuestions
            }],
            needsPagination: false
        };
    }
    
    const totalPages = Math.ceil(totalQuestions / MAX_GHOSTS_PER_PAGE);
    const pages = Array.from({ length: totalPages }, (_, pageIndex) => {
        const startGhost = pageIndex * MAX_GHOSTS_PER_PAGE;
        const endGhost = Math.min(startGhost + MAX_GHOSTS_PER_PAGE, totalQuestions);
        
        return {
            pageIndex,
            startGhost,
            endGhost,
            ghostCount: endGhost - startGhost
        };
    });
    
    return {
        totalPages,
        ghostsPerPage: MAX_GHOSTS_PER_PAGE,
        pages,
        needsPagination: true
    };
};

export const createInitCommand = (totalQuestions) => {
    // Guard clauses
    if (!totalQuestions || totalQuestions <= 0) {
        trace('pacman_command', { error: 'INVALID_TOTAL_QUESTIONS', totalQuestions });
        return null;
    }
    
    // Pagination calculation
    const pagination = calculatePagination(totalQuestions);
    const currentPageData = pagination.pages[0];
    
    const command = {
        action: PACMAN_COMMANDS.INIT,
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
    
    trace('pacman_command', { 
        operation: 'create_init_command_paginated',
        createdCommand: command,
        totalQuestions,
        paginationInfo: {
            needsPagination: pagination.needsPagination,
            totalPages: pagination.totalPages,
            firstPageGhosts: currentPageData.ghostCount
        }
    });
    
    return command;
}; 