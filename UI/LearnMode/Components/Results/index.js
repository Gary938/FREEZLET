// Components/Results/index.js - Centralized Results export

// IMPORTS
import { createUITracer } from '../../Utils/uiTracer.js';
import { UI_SCREEN_TYPES } from '../../Config/uiTypes.js';
import { createResultsDisplay, renderResultsToDOM } from './resultsRenderer.js';
import { attachResultsHandlers } from './resultsButtons.js';

// CONFIG
export const RESULTS_CONFIG = {
    CONTAINER_ID: 'finalResults',
    CONTAINER_CLASS: 'final-results-container',
    STATS_CLASS: 'final-stats'
};

// EXPORTS - Results Buttons  
export {
    createFinalButtons,
    BUTTONS_CONFIG
} from './resultsButtons.js';

// EXPORTS - Results Renderer (main rendering)
export {
    renderResultsToDOM,
    createResultsDisplay
} from './resultsRenderer.js';

// OPERATIONS
export const createResultsComponent = (resultsData) => {
    const tracer = createUITracer('resultsComponent');
    tracer.trace('createResultsComponent', { hasData: !!resultsData });
    
    if (!resultsData) return null;
    
    const container = document.createElement('div');
    container.id = RESULTS_CONFIG.CONTAINER_ID;
    container.className = RESULTS_CONFIG.CONTAINER_CLASS;
    
    // Save testPath in DOM for restart recovery
    if (resultsData.testPath) {
        container.dataset.testPath = resultsData.testPath;
    }
    
    const display = createResultsDisplay(resultsData);
    if (display && display.element) {
        container.appendChild(display.element);
    }
    
    return {
        element: container,
        render: () => renderResultsToDOM(container),
        attachHandlers: (handlers) => attachResultsHandlers(container, handlers)
    };
};

export const createResultsAPI = (resultsData) => {
    const component = createResultsComponent(resultsData);
    
    return {
        component,
        render: component?.render,
        attachHandlers: component?.attachHandlers,
        type: UI_SCREEN_TYPES.RESULTS
    };
}; 