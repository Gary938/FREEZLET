// Facade/HybridFacade/index.js - Centralized export of HybridFacade modules

// IMPORTS
import { 
    handleClose,
    handleRestart,
    activateFacade,
    resetState,
    createManagers,
    LIFECYCLE_CONFIG
} from './facadeLifecycle.js';

import { 
    cleanupComponents,
    forceCleanupAll,
    forceCleanup,
    cleanupForRestart,
    CLEANUP_CONFIG
} from './facadeCleanup.js';

import { 
    setupDOMEventHandlers,
    removeDOMEventListeners,
    subscribeToEvents,
    EVENTS_CONFIG
} from './facadeEvents.js';

import { 
    recreateComponents,
    initializeUI,
    COMPONENTS_CONFIG
} from './facadeComponents.js';

import { 
    createWrappedHandlers
} from './facadeWrappers.js';

// OPERATIONS - Main API
export { createHybridFacade } from './hybridFacade.js';

// OPERATIONS - Lifecycle functions
export {
    handleClose,
    handleRestart,
    activateFacade,
    resetState,
    createManagers
};

// OPERATIONS - Cleanup functions
export {
    cleanupComponents,
    forceCleanupAll,
    forceCleanup,
    cleanupForRestart
};

// OPERATIONS - Event functions
export {
    setupDOMEventHandlers,
    removeDOMEventListeners,
    subscribeToEvents
};

// OPERATIONS - Component functions
export {
    recreateComponents,
    initializeUI
};

// OPERATIONS - Wrapper functions
export {
    createWrappedHandlers
};

// CONFIG - All configurations
export {
    LIFECYCLE_CONFIG,
    CLEANUP_CONFIG,
    EVENTS_CONFIG,
    COMPONENTS_CONFIG
}; 