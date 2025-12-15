// Core/ComponentComposition/Example/exampleLogic.js - Example composition logic

// IMPORTS
import { UI_SCREEN_TYPES, UI_ACTION_TYPES, UI_TIMINGS, UI_MODE_TYPES } from '../../../Config/uiTypes.js';
import { createExampleElement } from '../../../Components/Screen/screenElements.js';
import { createUITracer } from '../../../Utils/uiTracer.js';
import { createExampleComponentAPI, createExampleMetadata } from './exampleRenderer.js';

// CONFIG
export const EXAMPLE_COMPOSER_CONFIG = {
    AUTO_TRANSITION_DELAY: UI_TIMINGS.EXAMPLE_DISPLAY_TIME // 3000ms
};

// OPERATIONS
export const composeExampleScreen = (state, controllerAPI = null) => {
    const tracer = createUITracer('ExampleComposer');
    
    // Guard clauses
    if (!state?.exampleData) {
        tracer.trace('composeExample:noData', { hasState: !!state });
        return createErrorComposition('no_example_data');
    }
    
    if (!state.exampleData.text) {
        tracer.trace('composeExample:noText', { exampleData: state.exampleData });
        return createErrorComposition('no_example_text');
    }
    
    tracer.trace('composeExample:start', { 
        text: state.exampleData.text,
        questionId: state.exampleData.questionId 
    });
    
    const exampleComponent = createExampleComponent(state.exampleData, controllerAPI);
    const metadata = createCompositionMetadata(state.exampleData);
    
    return {
        main: exampleComponent,
        type: 'example',
        metadata
    };
};

export const createExampleComponent = (exampleData, controllerAPI) => {
    const tracer = createUITracer('ExampleComposer');
    const exampleElement = createExampleElement(exampleData.text);
    
    if (!exampleElement) {
        tracer.trace('createExampleComponent:noElement');
        return null;
    }
    
    const autoTransitionHandler = createAutoTransitionHandler(
        exampleData, 
        controllerAPI, 
        tracer
    );
    
    const metadata = createExampleMetadata(exampleData, autoTransitionHandler);
    
    return createExampleComponentAPI(exampleElement, autoTransitionHandler, metadata);
};

export const createExampleScreenComposer = () => {
    return {
        [UI_SCREEN_TYPES.EXAMPLE]: composeExampleScreen
    };
};

// HELPERS
const createAutoTransitionHandler = (exampleData, controllerAPI, tracer) => {
    if (!exampleData.autoTransition || !controllerAPI) {
        return null;
    }

    const transitionHandler = setTimeout(() => {
        // Check mode to use correct action type
        const actionType = controllerAPI.options?.mode === UI_MODE_TYPES.WRITE
            ? UI_ACTION_TYPES.NEW_WRITE_QUESTION
            : UI_ACTION_TYPES.NEW_QUESTION;

        tracer.trace('autoTransition:trigger', {
            questionId: exampleData.questionId,
            delay: EXAMPLE_COMPOSER_CONFIG.AUTO_TRANSITION_DELAY,
            actionType
        });

        if (controllerAPI.handleUserAction) {
            controllerAPI.handleUserAction(actionType, {
                fromExample: true,
                questionId: exampleData.questionId
            });
        }
    }, EXAMPLE_COMPOSER_CONFIG.AUTO_TRANSITION_DELAY);

    return transitionHandler;
};

const createCompositionMetadata = (exampleData) => ({
    questionId: exampleData.questionId,
    showTime: exampleData.showTime,
    autoTransition: exampleData.autoTransition
});

const createErrorComposition = (errorCode) => ({
    main: null,
    type: 'error',
    error: {
        code: errorCode,
        message: `Example composition failed: ${errorCode}`,
        timestamp: Date.now()
    }
}); 