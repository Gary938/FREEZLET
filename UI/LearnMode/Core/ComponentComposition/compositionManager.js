// Core/ComponentComposition/compositionManager.js - Main composition management

// IMPORTS
import { createUITracer } from '../../Utils/uiTracer.js';
import { UI_SCREEN_TYPES } from '../../Config/uiTypes.js';
import { SCREEN_COMPOSERS } from './screenComposers.js';
import { createEmptyComposition } from './compositionHelpers.js';

// CONFIG removed - constants not used

// OPERATIONS
export const composeComponents = (uiState, controllerAPI) => {
    const tracer = createUITracer('compositionManager');
    
    // Guard clauses
    if (!uiState?.currentScreen) {
        tracer.trace('composeComponents:noScreen');
        return createEmptyComposition();
    }
    
    const composer = SCREEN_COMPOSERS[uiState.currentScreen];
    if (!composer) {
        tracer.trace('composeComponents:noComposer', { 
            currentScreen: uiState.currentScreen
        });
        return createEmptyComposition();
    }
    
    try {
        const rawComposition = composer(uiState, controllerAPI);
        const finalComposition = rawComposition ? 
            createComponentComposition(rawComposition) : 
            createEmptyComposition();
        
        tracer.trace('composeComponents:success', { 
            hasComposition: !!finalComposition
        });
        
        return finalComposition;
    } catch (error) {
        tracer.trace('composeComponents:composerError', { 
            error: error.message
        });
        return createEmptyComposition();
    }
};

export const createComponentComposition = (components) => {
    const tracer = createUITracer('compositionManager');
    
    // Guard clauses
    if (!components || typeof components !== 'object') {
        tracer.trace('createComponentComposition:invalidComponents');
        return createEmptyComposition();
    }
    
    const composition = {
        ...components,
        render: () => renderAllComponents(components),
        cleanup: () => cleanupAllComponents(components)
    };
    
    return composition;
};

// HELPERS
const renderAllComponents = (components) => {
    const tracer = createUITracer('compositionManager');
    let renderedCount = 0;
    let errorCount = 0;
    
    try {
        Object.values(components).forEach((component, index) => {
            if (component?.render) {
                try {
                    component.render();
                    renderedCount++;
                } catch (error) {
                    errorCount++;
                    tracer.trace('renderAllComponents:renderError', { 
                        index,
                        error: error.message
                    });
                }
            }
        });
    } catch (loopError) {
        tracer.trace('renderAllComponents:loopError', {
            error: loopError.message
        });
    }
    
    if (errorCount > 0) {
        tracer.trace('renderAllComponents:complete', {
            renderedCount,
            errorCount
        });
    }
};

const cleanupAllComponents = (components) => {
    Object.values(components).forEach(component => {
        if (component?.cleanup) component.cleanup();
    });
}; 