// PacmanLogic/index.js - Centralized pacman logic module exports

export { generatePacmanCommand } from './commandGeneration.js';
export { processPacmanCommand } from './commandProcessing.js';
export { createInitialPacmanState } from './stateCreation.js';

// New pagination modules
export { 
    calculatePagination, 
    getPageData, 
    validatePagination,
    PAGINATION_CONFIG 
} from './paginationLogic.js';

export { 
    shouldSwitchPage, 
    getNextPageData, 
    getPreviousPageData,
    getCurrentPageInfo,
    resetPagePosition 
} from './pageManager.js'; 