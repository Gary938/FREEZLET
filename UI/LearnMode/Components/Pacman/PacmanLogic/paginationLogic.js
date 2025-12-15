// PacmanLogic/paginationLogic.js - Pacman ghost pagination logic

// CONFIG
export const PAGINATION_CONFIG = {
    MAX_GHOSTS_PER_PAGE: 30,
    MIN_GHOSTS_FOR_PAGINATION: 31
};

// OPERATIONS
export const calculatePagination = (totalQuestions) => {
    const { MAX_GHOSTS_PER_PAGE } = PAGINATION_CONFIG;
    
    // Guard clauses
    if (!totalQuestions || totalQuestions <= 0) {
        return {
            totalPages: 0,
            ghostsPerPage: 0,
            pages: [],
            needsPagination: false
        };
    }
    
    // If questions less than or equal to max - no pagination needed
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
    
    // Page calculation
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

export const getPageData = (pagination, pageIndex) => {
    // Guard clauses
    if (!pagination?.pages || pageIndex < 0 || pageIndex >= pagination.pages.length) {
        return null;
    }
    
    return pagination.pages[pageIndex];
};

export const validatePagination = (pagination) => {
    if (!pagination) return false;
    if (!Array.isArray(pagination.pages)) return false;
    if (pagination.totalPages !== pagination.pages.length) return false;
    
    return pagination.pages.every(page => 
        typeof page.pageIndex === 'number' &&
        typeof page.startGhost === 'number' &&
        typeof page.endGhost === 'number' &&
        typeof page.ghostCount === 'number' &&
        page.ghostCount > 0
    );
}; 