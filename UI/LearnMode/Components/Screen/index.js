// Components/Screen/index.js - Centralized Screen component export

// EXPORTS - Screen Layout
export {
    createScreenLayout,
    attachLayoutToDOM,
    SCREEN_CONFIG
} from './screenLayout.js';

// EXPORTS - Screen Elements
export {
    createLoadingElement,
    createErrorElement,
    createExampleElement,
    renderElementToQuestionArea,
    clearQuestionArea,
    showLoading,
    showError,
    showExample,
    ELEMENTS_CONFIG
} from './screenElements.js';

// EXPORTS - Screen Transitions
export {
    createBlockTransition,
    renderBlockTransition,
    attachNextBlockHandler,
    removeNextBlockHandler,
    playNextBlockVideo,
    createTransitionComponent,
    TRANSITIONS_CONFIG
} from './Transitions/index.js';

// EXPORTS - Screen Renderer
export {
    createScreenAndAttachToDOM,
    renderComponents,
    renderInitialUI,
    RENDERER_CONFIG
} from './screenRenderer.js';

// EXPORTS - Screen Handlers
export {
    attachCloseButtonHandler,
    removeCloseButtonHandler,
    HANDLERS_CONFIG
} from './screenHandlers.js';

// HELPERS - Convenience API for Screen component
export const createScreenAPI = () => {
    const layout = createScreenLayout();
    
    return {
        // Layout management
        layout,
        attachToDOM: layout.attachToDOM,
        cleanup: layout.cleanup,
        
        // Screen elements
        showLoading: (text) => showLoading(text),
        showError: (message) => showError(message),
        showExample: (text) => showExample(text),
        clearContent: () => clearQuestionArea(),
        
        // Transitions
        showBlockTransition: (blockData) => renderBlockTransition(blockData),
        onNextBlock: (handler) => attachNextBlockHandler(handler),
        removeNextBlockHandler: () => removeNextBlockHandler(),
        
        // Information
        info: {
            type: 'screen',
            hasLayout: !!layout.outerArea,
            isAttached: !!document.getElementById('outerArea')
        }
    };
}; 