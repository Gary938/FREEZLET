// Components/Screen/screenRenderer.js - LearnMode screen DOM rendering

// IMPORTS
import { createUITracer } from '../../Utils/uiTracer.js';
import { createScreenLayout } from './screenLayout.js';

// CONFIG
export const RENDERER_CONFIG = {
    RENDER_TIMEOUT: 1000,
    ATTACH_DELAY: 100,
    COMPONENT_MOUNT_DELAY: 50
};

// OPERATIONS
export const createScreenAndAttachToDOM = async () => {
    const layout = createScreenLayout();
    layout.attachToDOM();
    return layout;
};

export const renderComponents = (controller, tracer) => {
    // Guard clauses
    if (!controller) {
        tracer.trace('renderComponents:noController');
        return;
    }
    
    const currentState = controller.getState();
    const composition = controller.getCurrentComposition();
    
    if (composition?.render) {
        composition.render();
        tracer.trace('renderComponents:success');
    } else {
        tracer.trace('renderComponents:noRender', { hasComposition: !!composition });
    }
};

export const renderInitialUI = async (controller, eventCoordinator, tracer) => {
    // Guard clauses
    if (!controller) {
        tracer.trace('renderInitialUI:noController');
        return null;
    }
    
    const layout = await createScreenAndAttachToDOM();
    
    // Import handler from screenHandlers
    const { attachCloseButtonHandler } = await import('./screenHandlers.js');
    await attachCloseButtonHandler(layout, eventCoordinator, tracer);
    
    renderComponents(controller, tracer);
    return layout;
}; 