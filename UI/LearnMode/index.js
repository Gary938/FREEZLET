// index.js - Main LearnMode architecture API

// IMPORTS
import * as Core from './Core/index.js';
import * as Components from './Components/index.js';
import * as Controllers from './Controllers/index.js';
import * as Config from './Config/index.js';
import * as Utils from './Utils/index.js';
import * as Facade from './Facade/index.js';
import * as Bridge from './Bridge/index.js';

// MAIN MODULES
export {
    // Core layer
    createCoreAPI,
    createUIState,
    updateUIState,
    composeComponents,
    
    // Components layer
    createComponentsAPI,
    createQuestionComponent,
    createResultsComponent, 
    createScreenLayout,
    createLoadingElement,
    createErrorElement,
    createExampleElement,
    COMPONENTS_CONFIG,
    QUESTION_CONFIG,
    RESULTS_CONFIG,
    SCREEN_CONFIG,
    ELEMENTS_CONFIG,
    
    // Controllers layer
    createHybridController,
    createBusinessBridge,
    HYBRID_CONTROLLER_CONFIG,
    BUSINESS_BRIDGE_CONFIG,
    
    // Config layer
    createConfigAPI,
    UI_SCREEN_TYPES,
    UI_ACTION_TYPES,
    UI_VALIDATION_RULES,
    
    // Utils layer
    createUtilsAPI,
    createUITracer,
    isValidQuestionData,
    validateDOMStructure,
    createScreenError,
    createResultsError,
    UTILS_CONFIG,
    TRACER_CONFIG,
    
    // Facade layer
    createFacadeAPI,
    createHybridFacade,
    createEventCoordinator,
    createIsolationManager,
    FACADE_CONFIG,
    EVENT_COORDINATOR_CONFIG,
    ISOLATION_CONFIG,
    
    // Bridge layer
    createElectronBridge,
    ELECTRON_BRIDGE_CONFIG
} from './Core/index.js';

export * from './Components/index.js';
export * from './Controllers/index.js';
export * from './Config/index.js';
export * from './Utils/index.js';
export * from './Facade/index.js';
export * from './Bridge/index.js';

// MAIN API
export const createHybridLearnModeAPI = (initialData = null) => {
    const core = Core.createCoreAPI(initialData);
    const components = Components.createComponentsAPI();
    const config = Config.createConfigAPI();
    const utils = Utils.createUtilsAPI();
    const facade = Facade.createFacadeAPI();
    const bridge = Bridge.createElectronBridge();
    
    return {
        // Main API
        core,
        components,
        config,
        utils,
        facade,
        bridge,
        
        // Convenience methods
        startTest: async (testPath, onBeforeStart = null, onAfterClose = null) => {
            const hybridFacade = facade.createHybridFacade();
            return hybridFacade.startLearnMode(testPath, onBeforeStart, onAfterClose);
        },
        
        // Direct facade access
        startWithIsolation: facade.createHybridFacade,
        
        // Architecture information
        info: {
            version: '4.0.0-hybrid-ultimate',
            stage: 'Stage 4 - Facade Layer Complete',
            totalModules: 35,
            layers: 7,
            aiCompliant: true,
            features: [
                'Hybrid Pattern Ultimate',
                'UI Isolation Management', 
                'Event Coordination System',
                'Business Bridge Integration',
                'Centralized Error Handling',
                'Immutable State Management',
                'AI-Optimized Architecture'
            ]
        }
    };
}; 