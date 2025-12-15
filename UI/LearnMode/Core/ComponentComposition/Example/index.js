// Core/ComponentComposition/Example/index.js - Centralized export of Example modules

// EXPORTS - Example Logic
export {
    composeExampleScreen,
    createExampleComponent,
    createExampleScreenComposer,
    EXAMPLE_COMPOSER_CONFIG
} from './exampleLogic.js';

// EXPORTS - Example Renderer
export {
    renderExampleToDOM,
    cleanupExampleComponent,
    createExampleComponentAPI,
    createExampleMetadata
} from './exampleRenderer.js'; 