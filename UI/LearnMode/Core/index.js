// Core/index.js - Centralized exports of Core layer

// IMPORTS
import { 
    createUIState, 
    updateUIState, 
    UI_STATE_TRANSFORMERS
} from './stateManager.js';

import { 
    EXAMPLE_TRANSFORMER_CONFIG,
    createExampleStateTransformer,
    transformToExampleState 
} from './ExampleTransformers.js';

import { 
    composeComponents, 
    createComponentComposition,
    SCREEN_COMPOSERS
} from './ComponentComposition/index.js';



// OPERATIONS - Grouped exports
export {
    // State Management
    createUIState,
    updateUIState,
    UI_STATE_TRANSFORMERS,
    
    // Component Composition  
    composeComponents,
    createComponentComposition,
    SCREEN_COMPOSERS,
    
    // 🆕 Example System
    EXAMPLE_TRANSFORMER_CONFIG,
    createExampleStateTransformer,
    transformToExampleState
};

// HELPERS - Convenience API for quick use
export const createCoreAPI = (initialData = null, controllerAPI = null, options = {}) => {
    let currentState = createUIState(initialData, options);  // Pass options to createUIState

    return {
        // State - immutable architecture
        get state() { return currentState; },  // Getter for current state
        getState: () => currentState,
        updateState: (action) => {
            currentState = updateUIState(currentState, action);  // Immutable update
            return currentState;
        },

        // Component composition
        compose: (uiState) => composeComponents(uiState || currentState, controllerAPI),
        getCurrentComposition: () => composeComponents(currentState, controllerAPI),


        // Cleanup to free resources
        cleanup: () => {
            // Empty function for compatibility
        }
    };
}; 