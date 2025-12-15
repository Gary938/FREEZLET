// PatternExecutor/businessIntegration.js - Business layer integration

// IMPORTS
import { UI_ACTION_TYPES, UI_MODE_TYPES } from '../../../Config/uiTypes.js';
import { checkAndHandleExampleInResponse } from './ExampleIntegration.js';

// CONFIG
const RESPONSE_MAPPING = {
    'final_stats': UI_ACTION_TYPES.SHOW_RESULTS,
    'next_block': UI_ACTION_TYPES.SHOW_TRANSITION,
    'default': UI_ACTION_TYPES.NEW_QUESTION
};

const WRITE_MODE_RESPONSE_MAPPING = {
    'final_stats': UI_ACTION_TYPES.SHOW_RESULTS,
    'next_block': UI_ACTION_TYPES.SHOW_TRANSITION,
    'default': UI_ACTION_TYPES.NEW_WRITE_QUESTION
};

// OPERATIONS
export const handleBusinessIntegration = async (answerResult, newState, components, businessBridge, coreAPI, tracer) => {
    try {
        const businessResult = await businessBridge.submitAnswerResult(answerResult);
        
        if (!businessResult.success) {
            return createBusinessResult(false, newState, components, businessResult);
        }
        
        // 🆕 INTEGRATION: Check examples from ExampleIntegration.js
        const exampleResult = checkAndHandleExampleInResponse(businessResult, coreAPI, tracer);
        
        if (exampleResult && exampleResult.success) {
            tracer.trace('businessIntegration:exampleShown', { 
                actionType: exampleResult.actionType,
                screenType: exampleResult.state?.currentScreen 
            });
            
            // If example shown, return result with example state
            return createBusinessResult(true, exampleResult.state, exampleResult.composition, businessResult);
        }
        
        // Standard processing without example
        // Check mode from state to use correct action type
        const currentMode = coreAPI.getState()?.options?.mode;
        const { actionType, payload } = mapBusinessResponse(businessResult, currentMode);
        
        // 🆕 FIX: Merge background data with main data BEFORE update
        let enhancedPayload = payload;
        if (businessResult.data?.background) {
            tracer.trace('businessIntegration:backgroundDetected', { 
                backgroundData: businessResult.data.background 
            });
            enhancedPayload = {
                ...payload,
                background: businessResult.data.background
            };
        }
        
        // One state update instead of two
        let updatedState = coreAPI.updateState({ type: actionType, payload: enhancedPayload });
        
        const finalComponents = coreAPI.getCurrentComposition();
        
        return createBusinessResult(true, updatedState, finalComponents, businessResult);
        
    } catch (error) {
        tracer.trace('businessIntegration:error', { error: error.message });
        return createBusinessResult(false, newState, components, { error: error.message });
    }
};

// HELPERS
const mapBusinessResponse = (businessResult, mode = null) => {
    const { type, data } = businessResult;
    // Use write mode mapping if mode is 'write'
    const mapping = mode === UI_MODE_TYPES.WRITE ? WRITE_MODE_RESPONSE_MAPPING : RESPONSE_MAPPING;
    const actionType = mapping[type] || mapping.default;

    return { actionType, payload: data };
};

const createBusinessResult = (success, state, components, businessData = null) => ({
    success,
    hybrid: {
        state,
        components,
        businessData,
        timestamp: Date.now()
    }
}); 