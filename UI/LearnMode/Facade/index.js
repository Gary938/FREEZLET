// Facade/index.js - Centralized export of Facade layer

// EXPORTS - Event Coordinator (event system)
export {
    createEventCoordinator,
    EVENT_COORDINATOR_CONFIG
} from './EventCoordinator/index.js';

// EXPORTS - Isolation Manager (main UI isolation)
export {
    createIsolationManager,
    ISOLATION_CONFIG
} from './IsolationManager/index.js';

// EXPORTS - Hybrid Facade (main facade)
export {
    createHybridFacade,
    FACADE_CONFIG as HYBRID_FACADE_CONFIG
} from './HybridFacade/hybridFacade.js';

// CONFIG
export const FACADE_CONFIG = {
    LAYER_VERSION: '4.0.0-hybrid-ultimate-stage4',
    TOTAL_MODULES: 11,
    CATEGORIES: ['eventCoordinator', 'isolationManager', 'hybridFacade']
};

// OPERATIONS
export const createFacadeAPI = () => {
    return {
        // Component creation
        createEventCoordinator,
        createIsolationManager,
        createHybridFacade,
        
        // Configuration
        config: FACADE_CONFIG,
        
        // Aliases for compatibility
        eventCoordinator: EVENT_COORDINATOR_CONFIG,
        isolation: ISOLATION_CONFIG,
        hybridFacade: HYBRID_FACADE_CONFIG
    };
}; 