// Core/ComponentComposition/Example/exampleRenderer.js - Example rendering

// IMPORTS
import { createUITracer } from '../../../Utils/uiTracer.js';

// OPERATIONS
export const renderExampleToDOM = (exampleElement, tracer) => {
    const questionArea = document.getElementById('hybridQuestionArea');
    
    if (!questionArea) {
        tracer.trace('renderExample:noQuestionArea');
        return false;
    }
    
    try {
        // Clear area and add example
        questionArea.innerHTML = '';
        questionArea.appendChild(exampleElement);
        
        tracer.trace('renderExample:success');
        return true;
        
    } catch (error) {
        tracer.trace('renderExample:error', { error: error.message });
        return false;
    }
};

export const cleanupExampleComponent = (exampleElement, autoTransitionHandler, tracer) => {
    try {
        // Cancel auto-transition if still active
        if (autoTransitionHandler) {
            clearTimeout(autoTransitionHandler);
            tracer.trace('cleanup:cancelAutoTransition');
        }
        
        // Remove DOM element
        if (exampleElement?.parentNode) {
            exampleElement.parentNode.removeChild(exampleElement);
            tracer.trace('cleanup:removedFromDOM');
        }
        
        return true;
        
    } catch (error) {
        tracer.trace('cleanup:error', { error: error.message });
        return false;
    }
};

export const createExampleComponentAPI = (element, handler, metadata) => {
    const tracer = createUITracer('ExampleRenderer');
    
    return {
        element,
        render: () => renderExampleToDOM(element, tracer),
        cleanup: () => cleanupExampleComponent(element, handler, tracer),
        metadata
    };
};

// HELPERS
const createExampleMetadata = (exampleData, autoTransitionHandler) => ({
    type: 'example',
    questionId: exampleData.questionId,
    hasAutoTransition: !!autoTransitionHandler
});

export { createExampleMetadata }; 