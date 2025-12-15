// PatternExecutor/ExampleIntegration.js - Example system integration with business layer

// IMPORTS
import { UI_ACTION_TYPES } from '../../../Config/uiTypes.js';

// OPERATIONS
export const checkAndHandleExampleInResponse = (businessResult, coreAPI, tracer) => {
    // Guard clauses
    if (!businessResult?.success || !businessResult.data) {
        tracer.trace('exampleCheck:noValidData', { 
            hasResult: !!businessResult,
            hasData: !!businessResult?.data 
        });
        return null;
    }
    
    return processExampleFromBusinessResult(businessResult, coreAPI, tracer);
};

export const executeExampleDisplayAction = (examplePayload, coreAPI, tracer) => {
    try {
        return performExampleDisplayAction(examplePayload, coreAPI, tracer);
    } catch (error) {
        tracer.trace('exampleDisplay:error', { error: error.message });
        return createFailedActionResult(error);
    }
};

// HELPERS
const processExampleFromBusinessResult = (businessResult, coreAPI, tracer) => {
    const showExample = businessResult.data.showExample;
    
    if (!showExample?.text) {
        return null;
    }
    
    const examplePayload = {
        exampleText: showExample.text,
        questionData: businessResult.data
    };
    
    tracer.trace('exampleCheck:processing', { 
        hasExample: true,
        questionId: businessResult.data.id 
    });
    
    return executeExampleDisplayAction(examplePayload, coreAPI, tracer);
};

const performExampleDisplayAction = (examplePayload, coreAPI, tracer) => {
    const newState = coreAPI.updateState({
        type: UI_ACTION_TYPES.DISPLAY_EXAMPLE,
        payload: examplePayload
    });
    
    const newComposition = coreAPI.getCurrentComposition();
    
    tracer.trace('exampleDisplay:success', { 
        screenType: newState?.currentScreen,
        hasComposition: !!newComposition
    });
    
    return createSuccessActionResult(newState, newComposition);
};

const createSuccessActionResult = (state, composition) => ({
    success: true,
    state: state,
    composition: composition,
    actionType: UI_ACTION_TYPES.DISPLAY_EXAMPLE
});

const createFailedActionResult = (error) => ({
    success: false,
    error: error.message,
    actionType: UI_ACTION_TYPES.DISPLAY_EXAMPLE
}); 