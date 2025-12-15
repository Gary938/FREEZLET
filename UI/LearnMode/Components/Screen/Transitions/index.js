// Components/Screen/Transitions/index.js - Centralized export

// Renderer module - DOM creation and rendering
export { 
    createBlockTransition,
    renderBlockTransition,
    showTransitionElement,
    RENDERER_CONFIG
} from './transitionRenderer.js';

// Handlers module - event handling
export { 
    attachNextBlockHandler,
    removeNextBlockHandler,
    HANDLERS_CONFIG
} from './transitionHandlers.js';

// Video module - video management
export { 
    playNextBlockVideo,
    VIDEO_CONFIG
} from './transitionVideo.js';

// Logic module - main component logic
export { 
    createTransitionComponent,
    LOGIC_CONFIG
} from './transitionLogic.js';

// Combined configuration for backward compatibility
export const TRANSITIONS_CONFIG = {
    NEXT_BLOCK_ID: 'nextBlock',
    NEXT_BLOCK_VIDEO_ID: 'nextBlockVideo',
    NEXT_BLOCK_BTN_ID: 'nextBlockBtn',
    VIDEO_SRC: 'UI/LearnMode/Assets/Content/Video/NextBlock.mp4',
    BUTTON_TEXT: 'NEXT BLOCK',
    AUTO_ADVANCE_DELAY: 1600
}; 