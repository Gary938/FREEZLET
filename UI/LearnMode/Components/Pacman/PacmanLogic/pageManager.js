// PacmanLogic/pageManager.js - Pacman page state management

// IMPORTS
import { createUITracer } from '../../../Utils/uiTracer.js';
import { getPageData } from './paginationLogic.js';

// OPERATIONS
export const shouldSwitchPage = (currentPosition, currentPageData) => {
    const tracer = createUITracer('pageManager');
    
    // Guard clauses
    if (!currentPageData || typeof currentPosition !== 'number') {
        tracer.trace('shouldSwitchPage:invalidParams', {
            currentPosition,
            currentPageData: !!currentPageData,
            positionType: typeof currentPosition
        });
        return false;
    }
    
    // Switch happens when pacman ate all ghosts on current page
    const shouldSwitch = currentPosition >= currentPageData.ghostCount;
    
    tracer.trace('shouldSwitchPage:check', {
        currentPosition,
        ghostCount: currentPageData.ghostCount,
        shouldSwitch,
        pageData: currentPageData
    });
    
    return shouldSwitch;
};

export const getNextPageData = (pagination, currentPageIndex) => {
    const tracer = createUITracer('pageManager');
    
    // Guard clauses
    if (!pagination || typeof currentPageIndex !== 'number') {
        tracer.trace('getNextPage:invalidParams');
        return null;
    }
    
    const nextPageIndex = currentPageIndex + 1;
    
    // Check if next page exists
    if (nextPageIndex >= pagination.totalPages) {
        tracer.trace('getNextPage:noMorePages', { 
            nextPageIndex, 
            totalPages: pagination.totalPages 
        });
        return null;
    }
    
    const nextPageData = getPageData(pagination, nextPageIndex);
    
    tracer.trace('getNextPage:success', {
        nextPageIndex,
        ghostCount: nextPageData?.ghostCount
    });
    
    return nextPageData;
};

export const getPreviousPageData = (pagination, currentPageIndex) => {
    const tracer = createUITracer('pageManager');
    
    // Guard clauses
    if (!pagination || typeof currentPageIndex !== 'number') {
        tracer.trace('getPreviousPage:invalidParams');
        return null;
    }
    
    const prevPageIndex = currentPageIndex - 1;
    
    // Check if previous page exists
    if (prevPageIndex < 0) {
        tracer.trace('getPreviousPage:noMorePages', { prevPageIndex });
        return null;
    }
    
    const prevPageData = getPageData(pagination, prevPageIndex);
    
    tracer.trace('getPreviousPage:success', {
        prevPageIndex,
        ghostCount: prevPageData?.ghostCount
    });
    
    return prevPageData;
};

export const getCurrentPageInfo = (pagination, pageIndex) => {
    // Guard clauses
    if (!pagination || typeof pageIndex !== 'number') return null;
    
    const pageData = getPageData(pagination, pageIndex);
    if (!pageData) return null;
    
    return {
        ...pageData,
        isFirstPage: pageIndex === 0,
        isLastPage: pageIndex === pagination.totalPages - 1,
        hasNextPage: pageIndex < pagination.totalPages - 1,
        hasPreviousPage: pageIndex > 0
    };
};

export const resetPagePosition = (state) => {
    return {
        ...state,
        currentPosition: 0,
        isAnimating: false,
        pageSwitch: true,
        updateTime: Date.now()
    };
}; 