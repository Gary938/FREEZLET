// PatternExecutor/patternCoordinator.js - Main Hybrid Pattern coordination

// IMPORTS
import { UI_ACTION_TYPES } from '../../../Config/uiTypes.js';
import { handleRestartAction, handleCloseLearnMode } from './actionHandlers.js';
import { handleBusinessIntegration } from './businessIntegration.js';

// CONFIG
export const PATTERN_CONFIG = {
    ACTION_TYPES: {
        RESTART_ACTIONS: [UI_ACTION_TYPES.TRY_AGAIN, UI_ACTION_TYPES.NEXT_STAGE],
        CLOSE_ACTION: UI_ACTION_TYPES.CLOSE_LEARN_MODE,
        BUSINESS_ACTION: UI_ACTION_TYPES.SUBMIT_ANSWER,
        RENDER_ACTIONS: [UI_ACTION_TYPES.NEW_QUESTION, UI_ACTION_TYPES.NEW_WRITE_QUESTION]
    },
    RESPONSE_MAPPING: {
        'final_stats': UI_ACTION_TYPES.SHOW_RESULTS,
        'next_block': UI_ACTION_TYPES.SHOW_TRANSITION,
        'default': UI_ACTION_TYPES.NEW_QUESTION
    }
};

// OPERATIONS
export const executeHybridPattern = async (actionType, payload, { businessBridge, coreAPI, tracer }) => {
    try {
        // Guard clauses for different action types
        if (isRestartAction(actionType)) {
            return handleRestartAction(actionType, tracer);
        }
        
        if (actionType === PATTERN_CONFIG.ACTION_TYPES.CLOSE_ACTION) {
            return handleCloseLearnMode(tracer);
        }
        
        // State update and component composition
        const { newState, components } = updateStateAndCompose(actionType, payload, coreAPI);
        
        // Rendering for NEW_QUESTION and NEW_WRITE_QUESTION
        if (PATTERN_CONFIG.ACTION_TYPES.RENDER_ACTIONS.includes(actionType)) {
            renderComponents(components);
        }
        
        // Business integration for SUBMIT_ANSWER
        if (actionType === PATTERN_CONFIG.ACTION_TYPES.BUSINESS_ACTION) {
            return handleBusinessIntegration(payload, newState, components, businessBridge, coreAPI, tracer);
        }
        
        return createHybridResult(true, newState, components);
        
    } catch (error) {
        tracer.trace('hybridPattern:error', { error: error.message });
        return createHybridResult(false, null, null, { error: error.message });
    }
};

// HELPERS
const isRestartAction = (actionType) => {
    return PATTERN_CONFIG.ACTION_TYPES.RESTART_ACTIONS.includes(actionType);
};

const updateStateAndCompose = (actionType, payload, coreAPI) => {
    const action = { type: actionType, payload };
    const newState = coreAPI.updateState(action);
    const components = coreAPI.getCurrentComposition();
    
    return { newState, components };
};

const renderComponents = (components) => {
    if (components?.render) {
        components.render();
    }
};

export const createHybridResult = (success, state, components, businessData = null) => ({
    success,
    hybrid: {
        state,
        components,
        businessData,
        timestamp: Date.now()
    }
}); 