// Components/index.js - Centralized export of all UI components

// IMPORTS
import { createUITracer } from '../Utils/uiTracer.js';

// CONFIG
export const COMPONENTS_CONFIG = {
    LOAD_TIMEOUT: 3000,
    RENDER_TIMEOUT: 5000
};

// EXPORTS - Question Component
export {
    createQuestionComponent,
    attachAnswerHandlers,
    QUESTION_CONFIG
} from './Question/index.js';

// EXPORTS - Screen Component  
export {
    createScreenLayout,
    createScreenAPI,
    attachLayoutToDOM,
    createLoadingElement,
    createErrorElement,
    createExampleElement,
    showLoading,
    showError,
    showExample,
    createBlockTransition,
    renderBlockTransition,
    attachNextBlockHandler,
    removeNextBlockHandler,
    playNextBlockVideo,
    SCREEN_CONFIG,
    ELEMENTS_CONFIG,
    TRANSITIONS_CONFIG
} from './Screen/index.js';

// EXPORTS - Results Component
export {
    createResultsComponent,
    createResultsAPI,
    renderResultsToDOM,
    RESULTS_CONFIG
} from './Results/index.js';

// EXPORTS - Pacman Component
export {
    createPacmanComponent,
    initializePacmanFromGhosts,
    handleAnswerResult,
    createPacman,
    createPacmanWithAPI,
    initializePacman,
    generatePacmanCommand,
    processPacmanCommand,
    animatePacmanMovement,
    PACMAN_CONFIG,
    PACMAN_COMMANDS,
    ANIMATION_CONFIG
} from './Pacman/index.js';

// EXPORTS - Background Component
export {
    createBackgroundComponent,
    createBackgroundController,
    createBackgroundRenderer,
    createBackgroundSelector,
    BACKGROUND_CONTROLLER_CONFIG,
    BACKGROUND_RENDERER_CONFIG,
    BACKGROUND_SELECTOR_CONFIG
} from './Background/index.js';

// OPERATIONS
export const createComponentsAPI = () => {
    const tracer = createUITracer('components');
    tracer.trace('createComponentsAPI:start');
    
    return {
        // Question component
        createQuestion: createQuestionComponent,

        // Screen component
        createScreen: createScreenLayout,
        screenAPI: createScreenAPI,
        
        // Results component
        createResults: createResultsComponent,
        resultsAPI: createResultsAPI,
        
        // Pacman component
        createPacman: createPacmanComponent,
        initializePacman: initializePacmanFromGhosts,
        pacmanAPI: createPacmanWithAPI,
        
        // Background component
        createBackground: createBackgroundComponent,
        backgroundController: createBackgroundController,
        
        // Utility functions
        showLoading,
        showError,
        showExample,
        
        // Configuration
        config: COMPONENTS_CONFIG
    };
}; 