// Components/Background/index.js - Centralized Background system export

// IMPORTS for internal use
import { createBackgroundController } from './backgroundController.js';
import { createUITracer } from '../../Utils/uiTracer.js';

// EXPORTS - Background components
export { 
    createBackgroundRenderer,
    BACKGROUND_RENDERER_CONFIG 
} from './backgroundRenderer.js';

export { 
    createBackgroundSelector,
    BACKGROUND_SELECTOR_CONFIG 
} from './backgroundSelector.js';

export { 
    createBackgroundController,
    BACKGROUND_CONTROLLER_CONFIG 
} from './backgroundController.js';

// MAIN FACTORY - Main factory for Background component creation
export const createBackgroundComponent = (backgroundData, businessBridge = null) => {
    const tracer = createUITracer('backgroundComponent');
    const controller = createBackgroundController(businessBridge);
    
    return {
        type: 'background',
        data: backgroundData,
        
        render: () => {
            // Find outerArea ourselves like in Pacman component
            const outerAreaElement = document.getElementById('outerArea');
            if (!outerAreaElement) {
                tracer.trace('render:noOuterArea');
                return false;
            }
            
            const initialized = controller.initialize(outerAreaElement);
            if (initialized && backgroundData) {
                controller.handleBackgroundData(backgroundData);
                tracer.trace('render:success', { 
                    hasBackgroundData: !!backgroundData,
                    mode: backgroundData?.mode,
                    hasPath: !!backgroundData?.currentPath
                });
            } else if (initialized && !backgroundData) {
                // Normal situation - background already set, no new data
                tracer.trace('render:noNewData', { 
                    initialized: true,
                    hasBackgroundData: false,
                    reason: 'background_preserved_from_previous_state'
                });
            } else {
                tracer.trace('render:failed', { 
                    initialized,
                    hasBackgroundData: !!backgroundData
                });
            }
            return initialized;
        },
        
        updateState: (newBackgroundData) => {
            if (newBackgroundData) {
                controller.handleBackgroundData(newBackgroundData);
            }
        },
        
        cleanup: () => {
            controller.cleanup();
        },
        
        // Access to internal controller for direct management
        getController: () => controller
    };
}; 