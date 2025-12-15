// Facade/HybridFacade/hybridFacade.js - Main Hybrid Pattern Ultimate facade

// IMPORTS
import { createHybridController } from '../../Controllers/index.js';
import { createEventCoordinator } from '../EventCoordinator/index.js';
import { createIsolationManager } from '../IsolationManager/index.js';
import { createUITracer } from '../../Utils/uiTracer.js';
import { renderInitialUI } from '../../Components/Screen/index.js';
import { validateStartParams } from '../../Utils/index.js';

import { activateFacade, createManagers } from './facadeLifecycle.js';
import { forceCleanup } from './facadeCleanup.js';
import { setupDOMEventHandlers, removeDOMEventListeners, subscribeToEvents } from './facadeEvents.js';
import { initializeUI } from './facadeComponents.js';
import { createWrappedHandlers } from './facadeWrappers.js';

// CONFIG
export const FACADE_CONFIG = {
    INITIALIZATION_TIMEOUT: 5000,
    FORCE_CLOSE_DELAY: 500,
    ERROR_CODES: {
        ALREADY_ACTIVE: 'FACADE_ALREADY_ACTIVE',
        INIT_FAILED: 'FACADE_INIT_FAILED',
        UI_ISOLATION_FAILED: 'UI_ISOLATION_FAILED',
        CONTROLLER_FAILED: 'CONTROLLER_FAILED'
    }
};

// OPERATIONS
export const createHybridFacade = () => {
    // Facade state
    const state = createFacadeState();
    const tracer = createUITracer('hybridFacade');
    const { wrappedHandleClose, wrappedHandleRestart } = createWrappedHandlers(state, tracer);
    
    return {
        startLearnMode: async (testPath, onBeforeStart, onAfterClose, options = {}) => {
            return await executeStartLearnMode(state, testPath, onBeforeStart, onAfterClose, options, wrappedHandleClose, wrappedHandleRestart, tracer);
        },
        
        forceClose: async () => {
            await forceCleanup(state, () => removeDOMEventListeners(state), () => resetFacadeState(state), tracer);
            tracer.trace('forceClose:success');
        },
        
        getState: () => {
            return createStateSnapshot(state);
        }
    };
};

// HELPERS
const createFacadeState = () => ({
    isActive: false,
    controller: null,
    eventCoordinator: null,
    isolationManager: null,
    domCloseHandler: null,
    domRestartHandler: null,
    currentTestPath: null,
    options: { mode: 'select', showHints: false }  // Write Mode options
});

const resetFacadeState = (state) => {
    state.isActive = false;
    state.controller = null;
    state.eventCoordinator = null;
    state.isolationManager = null;
    state.domCloseHandler = null;
    state.domRestartHandler = null;
    state.currentTestPath = null;
    state.options = { mode: 'select', showHints: false };
};

const createStateSnapshot = (state) => ({
    isActive: state.isActive,
    hasController: !!state.controller,
    hasEventCoordinator: !!state.eventCoordinator,
    hasIsolationManager: !!state.isolationManager,
    currentTestPath: state.currentTestPath, // For debugging
    isolationState: state.isolationManager?.getState() || null
});

const executeStartLearnMode = async (state, testPath, onBeforeStart, onAfterClose, options, wrappedHandleClose, wrappedHandleRestart, tracer) => {
    // Merge options with defaults
    const mergedOptions = { mode: 'select', showHints: false, ...options };
    tracer.trace('startLearnMode:begin', { testPath, options: mergedOptions });

    // Delegate validation to Utils layer
    validateStartParams(testPath, state.isActive, tracer);

    try {
        // CRITICAL: set testPath and options at the VERY BEGINNING
        state.currentTestPath = testPath;
        state.options = mergedOptions;
        tracer.trace('testPath:set', { testPath: state.currentTestPath, mode: mergedOptions.mode });

        const managers = createManagers(createEventCoordinator, createIsolationManager, onBeforeStart, onAfterClose);
        state.eventCoordinator = managers.eventCoordinator;
        state.isolationManager = managers.isolationManager;

        subscribeToEvents(state.eventCoordinator, wrappedHandleClose);
        setupDOMEventHandlers(state, wrappedHandleClose, wrappedHandleRestart, tracer);

        // Pass options to initializeUI
        state.controller = await initializeUI(testPath, state.isolationManager, createHybridController, renderInitialUI, state.eventCoordinator, tracer, mergedOptions);

        activateFacade(state, testPath);

        tracer.trace('startLearnMode:success', {
            isActive: state.isActive,
            hasTestPath: !!state.currentTestPath,
            testPath: state.currentTestPath,
            mode: mergedOptions.mode
        });
        return true;

    } catch (error) {
        tracer.trace('startLearnMode:criticalError', { error: error.message });
        await forceCleanup(state, () => removeDOMEventListeners(state), () => resetFacadeState(state), tracer);
        throw new Error(`${FACADE_CONFIG.ERROR_CODES.INIT_FAILED}: ${error.message}`);
    }
}; 