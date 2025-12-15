// Facade/HybridFacade/facadeCleanup.js - Facade cleanup operations

// CONFIG
export const CLEANUP_CONFIG = {
    CLEANUP_TIMEOUT: 2000,
    ERROR_CODES: {
        CLEANUP_FAILED: 'FACADE_CLEANUP_FAILED',
        FORCE_CLEANUP_FAILED: 'FACADE_FORCE_CLEANUP_FAILED'
    }
};

// OPERATIONS
export const cleanupComponents = async (state, resetState) => {
    if (state.eventCoordinator) {
        state.eventCoordinator.cleanup();
    }
    
    if (state.isolationManager) {
        await state.isolationManager.showMainUI();
    }
    
    // CRITICAL: Force remove LearnMode DOM elements
    forceClearLearnModeDOMElements();
    
    resetState();
};

export const forceCleanupAll = async (state) => {
    if (state.controller?.cleanup) {
        state.controller.cleanup();
    }
    
    if (state.isolationManager) {
        await state.isolationManager.showMainUI();
    }
    
    if (state.eventCoordinator) {
        state.eventCoordinator.cleanup();
    }
    
    // CRITICAL: Force remove LearnMode DOM elements
    forceClearLearnModeDOMElements();
};

export const forceCleanup = async (state, removeDOMEventListeners, resetState, tracer) => {
    try {
        removeDOMEventListeners();
        await forceCleanupAll(state);
    } catch (error) {
        tracer.trace('forceCleanup:error', { error: error.message });
    } finally {
        // CRITICAL: Force remove LearnMode DOM elements
        forceClearLearnModeDOMElements();
        resetState();
    }
};

export const cleanupForRestart = (state) => {
    // Save critical testPath BEFORE cleanup
    const preservedTestPath = state.currentTestPath;
    
    if (state.controller) {
        state.controller = null;
    }
    
    if (state.eventCoordinator) {
        state.eventCoordinator.cleanup();
        state.eventCoordinator = null;
    }
    
    // Restore testPath AFTER cleanup
    state.currentTestPath = preservedTestPath;
};

// HELPERS
const forceClearLearnModeDOMElements = () => {
    // Remove main LearnMode container (outerArea)
    const outerArea = document.getElementById('outerArea');
    if (outerArea) {
        outerArea.remove();
    }
    
    // Remove hybridQuestionArea if remaining
    const hybridQuestionArea = document.getElementById('hybridQuestionArea');
    if (hybridQuestionArea) {
        hybridQuestionArea.remove();
    }
    
    // Remove close button if remaining
    const closeButton = document.getElementById('closeLearnMode');
    if (closeButton) {
        closeButton.remove();
    }
    
    // Remove LearnMode-related classes from all elements
    const elementsWithLearnModeClasses = document.querySelectorAll('[class*="learn-mode"]');
    elementsWithLearnModeClasses.forEach(element => {
        const classList = Array.from(element.classList);
        classList.forEach(className => {
            if (className.includes('learn-mode')) {
                element.classList.remove(className);
            }
        });
        
        // If element has no classes left, remove it
        if (element.classList.length === 0) {
            element.remove();
        }
    });
}; 