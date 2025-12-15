// PacmanComponent/pacmanState.js - Pacman state management

// IMPORTS
import { PACMAN_CONFIG } from '../pacmanConfig.js';

// OPERATIONS
export const extractCurrentState = (container) => {
    const pacman = container.querySelector(`.${PACMAN_CONFIG.PACMAN_CLASS}`);
    
    if (!pacman) return null;
    
    // Restore pagination data from dataset
    const paginationData = container.dataset.pagination ? 
        JSON.parse(container.dataset.pagination) : null;
    const currentPageData = container.dataset.currentPageData ? 
        JSON.parse(container.dataset.currentPageData) : null;
    
    return {
        totalGhosts: parseInt(container.dataset.totalGhosts || '0'),
        currentPosition: parseInt(container.dataset.currentPosition || '0'),
        
        // Pagination fields
        pagination: paginationData,
        currentPage: parseInt(container.dataset.currentPage || '0'),
        currentPageData: currentPageData,
        totalQuestions: parseInt(container.dataset.totalQuestions || '0'),
        
        isAnimating: false,
        updateTime: Date.now()
    };
};

export const saveStateToContainer = (container, state) => {
    container.dataset.currentPosition = state.currentPosition.toString();
    container.dataset.totalGhosts = state.totalGhosts.toString();
    container.dataset.lastUpdate = state.updateTime.toString();
    
    // Save pagination data
    if (state.pagination) {
        container.dataset.pagination = JSON.stringify(state.pagination);
    }
    if (state.currentPageData) {
        container.dataset.currentPageData = JSON.stringify(state.currentPageData);
    }
    if (typeof state.currentPage === 'number') {
        container.dataset.currentPage = state.currentPage.toString();
    }
    if (typeof state.totalQuestions === 'number') {
        container.dataset.totalQuestions = state.totalQuestions.toString();
    }
}; 