// Facade/HybridFacade/facadeWrappers.js - Facade wrapper functions

// IMPORTS
import { createHybridController } from '../../Controllers/index.js';
import { createEventCoordinator } from '../EventCoordinator/index.js';
import { renderInitialUI } from '../../Components/Screen/index.js';

import { 
    handleClose,
    handleRestart,
    activateFacade
} from './facadeLifecycle.js';

import { 
    cleanupComponents,
    forceCleanup,
    cleanupForRestart
} from './facadeCleanup.js';

import { 
    removeDOMEventListeners
} from './facadeEvents.js';

import { 
    recreateComponents
} from './facadeComponents.js';

// OPERATIONS
export const createWrappedHandlers = (state, tracer) => {
    const wrappedHandleClose = async () => {
        await handleClose(
            state,
            () => cleanupComponents(state, () => resetFacadeState(state)),
            () => forceCleanup(state, () => removeDOMEventListeners(state), () => resetFacadeState(state), tracer),
            tracer
        );
    };
    
    const wrappedHandleRestart = async (reason) => {
        await handleRestart(
            state,
            () => cleanupForRestart(state),
            async (testPath) => {
                const result = await recreateComponents(
                    testPath,
                    createEventCoordinator,
                    createHybridController,
                    renderInitialUI,
                    wrappedHandleClose,
                    tracer,
                    state.options  // Pass saved options (mode, showHints)
                );
                state.eventCoordinator = result.eventCoordinator;
                state.controller = result.controller;
            },
            (testPath) => activateFacade(state, testPath),
            tracer,
            reason
        );
    };
    
    return { wrappedHandleClose, wrappedHandleRestart };
};

// HELPERS
const resetFacadeState = (state) => {
    state.isActive = false;
    state.controller = null;
    state.eventCoordinator = null;
    state.isolationManager = null;
    state.domCloseHandler = null;
    state.domRestartHandler = null;
    state.currentTestPath = null;
}; 