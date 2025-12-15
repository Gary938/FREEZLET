// Facade/HybridFacade/facadeLifecycle.js - Facade lifecycle management

// CONFIG
export const LIFECYCLE_CONFIG = {
    ERROR_CODES: {
        CLOSE_FAILED: 'FACADE_CLOSE_FAILED',
        RESTART_FAILED: 'FACADE_RESTART_FAILED',
        NO_TEST_PATH: 'NO_TEST_PATH_FOR_RESTART'
    },
    RESTART_TIMEOUT: 3000
};

// OPERATIONS
export const handleClose = async (state, cleanupComponents, forceCleanup, tracer) => {
    tracer.trace('handleClose:begin', { isActive: state.isActive });
    
    try {
        await cleanupComponents();
        tracer.trace('handleClose:success');
    } catch (error) {
        tracer.trace('handleClose:error', { error: error.message });
        await forceCleanup();
    }
};

export const handleRestart = async (state, cleanupForRestart, recreateComponents, activateFacade, tracer, reason) => {
    let testPathToRestart = state.currentTestPath;
    
    // Restore testPath from DOM if missing
    if (!testPathToRestart) {
        const resultsContainer = document.querySelector('#finalResults');
        if (resultsContainer && resultsContainer.dataset.testPath) {
            testPathToRestart = resultsContainer.dataset.testPath;
            tracer.trace('handleRestart:testPathRestored', { 
                restoredPath: testPathToRestart 
            });
        }
    }
    
    tracer.trace('handleRestart:begin', { 
        reason, 
        hasTestPath: !!testPathToRestart 
    });
    
    try {
        if (!testPathToRestart) {
            throw new Error('No test path available for restart');
        }
        
        cleanupForRestart();
        await recreateComponents(testPathToRestart);
        activateFacade(testPathToRestart);
        
        tracer.trace('handleRestart:success', { reason });
    } catch (error) {
        tracer.trace('handleRestart:error', { 
            error: error.message, 
            reason 
        });
        throw error;
    }
};

export const activateFacade = (state, testPath) => {
    state.isActive = true;
    
    if (state.eventCoordinator) {
        state.eventCoordinator.dispatch('FACADE_READY', { 
            testPath, 
            timestamp: Date.now() 
        });
    }
};

export const createManagers = (createEventCoordinator, createIsolationManager, onBeforeStart, onAfterClose) => {
    const eventCoordinator = createEventCoordinator();
    const isolationManager = createIsolationManager(onBeforeStart, onAfterClose);
    
    return { eventCoordinator, isolationManager };
}; 