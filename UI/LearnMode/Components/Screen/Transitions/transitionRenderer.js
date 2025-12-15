// Components/Screen/Transitions/transitionRenderer.js - DOM creation and rendering

// IMPORTS
import { createUITracer } from '../../../Utils/uiTracer.js';

// CONFIG
export const RENDERER_CONFIG = {
    NEXT_BLOCK_ID: 'nextBlock',
    NEXT_BLOCK_VIDEO_ID: 'nextBlockVideo',
    NEXT_BLOCK_BTN_ID: 'nextBlockBtn',
    VIDEO_SRC: 'UI/LearnMode/Assets/Content/Video/NextBlock.mp4',
    BUTTON_TEXT: 'NEXT BLOCK',
    TARGET_AREA_ID: 'hybridQuestionArea'
};

// OPERATIONS
export const createBlockTransition = (blockData) => {
    const tracer = createUITracer('transitionRenderer');
    
    const nextBlockDiv = document.createElement('div');
    nextBlockDiv.id = RENDERER_CONFIG.NEXT_BLOCK_ID;
    nextBlockDiv.innerHTML = createBlockTransitionHTML();
    
    tracer.trace('createBlockTransition', { 
        success: true,
        hasButton: nextBlockDiv.innerHTML.includes(RENDERER_CONFIG.NEXT_BLOCK_BTN_ID)
    });
    
    return nextBlockDiv;
};

export const renderBlockTransition = (blockData) => {
    const questionArea = document.getElementById(RENDERER_CONFIG.TARGET_AREA_ID);
    if (!questionArea) return false;
    
    const transitionElement = createBlockTransition(blockData);
    questionArea.innerHTML = '';
    questionArea.appendChild(transitionElement);
    
    return true;
};

export const showTransitionElement = (transitionElement) => {
    if (!transitionElement) return false;
    
    const questionArea = document.getElementById(RENDERER_CONFIG.TARGET_AREA_ID);
    if (!questionArea) return false;
    
    questionArea.innerHTML = '';
    questionArea.appendChild(transitionElement);
    return true;
};

// HELPERS
const createBlockTransitionHTML = () => {
    return `
        <div class="video-wrapper">
            <video id="${RENDERER_CONFIG.NEXT_BLOCK_VIDEO_ID}" class="next-block-video" autoplay muted playsinline>
                <source src="${RENDERER_CONFIG.VIDEO_SRC}" type="video/mp4">
            </video>
        </div>
        <button id="${RENDERER_CONFIG.NEXT_BLOCK_BTN_ID}">${RENDERER_CONFIG.BUTTON_TEXT}</button>
    `;
}; 