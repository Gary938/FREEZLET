// Components/Screen/screenLayout.js - Main screen structure

// IMPORTS
import { createUITracer } from '../../Utils/uiTracer.js';

// CONFIG
export const SCREEN_CONFIG = {
    OUTER_AREA_ID: 'outerArea',
    QUESTION_AREA_ID: 'hybridQuestionArea', 
    CLOSE_BUTTON_ID: 'closeLearnMode',
    OUTER_AREA_CLASS: 'learn-mode-outer-area',
    QUESTION_AREA_CLASS: 'learn-mode-question-area',
    CLOSE_BUTTON_CLASS: 'close-button'
};

// OPERATIONS
export const createScreenLayout = () => {
    const tracer = createUITracer('screenLayout');
    tracer.trace('createLayout');
    
    const layout = createCompleteStructure();
    
    return {
        outerArea: layout.outerArea,
        questionArea: layout.questionArea,
        closeButton: layout.closeButton,
        attachToDOM: () => attachLayoutToDOM(layout),
        cleanup: () => cleanupLayout(layout)
    };
};

export const attachLayoutToDOM = (layout) => {
    // Guard clauses
    if (!layout?.outerArea) return false;
    
    // Remove existing layout if present
    const existing = document.getElementById(SCREEN_CONFIG.OUTER_AREA_ID);
    if (existing) {
        existing.remove();
    }
    
    // Add new layout
    document.body.appendChild(layout.outerArea);
    return true;
};

// HELPERS
const createCompleteStructure = () => {
    const outerArea = createOuterArea();
    const questionArea = createQuestionArea();
    const closeButton = createCloseButton();
    
    // Assemble structure
    outerArea.appendChild(closeButton);
    outerArea.appendChild(questionArea);
    
    return {
        outerArea,
        questionArea,
        closeButton
    };
};

const createOuterArea = () => {
    const outerArea = document.createElement('div');
    outerArea.id = SCREEN_CONFIG.OUTER_AREA_ID;
    outerArea.className = SCREEN_CONFIG.OUTER_AREA_CLASS;
    return outerArea;
};

const createQuestionArea = () => {
    const questionArea = document.createElement('div');
    questionArea.id = SCREEN_CONFIG.QUESTION_AREA_ID;
    questionArea.className = SCREEN_CONFIG.QUESTION_AREA_CLASS;
    
    return questionArea;
};

const createCloseButton = () => {
    const closeButton = document.createElement('button');
    closeButton.id = SCREEN_CONFIG.CLOSE_BUTTON_ID;
    closeButton.textContent = '✖';
    closeButton.className = SCREEN_CONFIG.CLOSE_BUTTON_CLASS;
    
    return closeButton;
};

const cleanupLayout = (layout) => {
    if (layout?.outerArea?.parentNode) {
        layout.outerArea.parentNode.removeChild(layout.outerArea);
    }
}; 