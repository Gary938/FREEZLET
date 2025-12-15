// Core/ComponentComposition/index.js - Centralized export of component composition

// CORE OPERATIONS
export { 
    composeComponents, 
    createComponentComposition
} from './compositionManager.js';

// SCREEN COMPOSERS - single access point for composers
export { 
    SCREEN_COMPOSERS
} from './screenComposers.js';

// HELPERS
export { 
    createEmptyComposition, 
    createPlaceholderComponent 
} from './compositionHelpers.js';

// 🆕 EXAMPLE SYSTEM
export {
    composeExampleScreen,
    createExampleComponent,
    createExampleScreenComposer,
    EXAMPLE_COMPOSER_CONFIG
} from './Example/index.js'; 