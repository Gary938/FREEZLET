// Core/stateManager.js - UI state management (NOT test state!)

// IMPORTS
import { createUITracer } from '../Utils/uiTracer.js';
import { UI_SCREEN_TYPES, UI_ACTION_TYPES, UI_INTERACTION_STATES, UI_MODE_TYPES } from '../Config/uiTypes.js';
import { createExampleStateTransformer, createExampleToQuestionTransformer } from './ExampleTransformers.js';

// OPERATIONS
export const createUIState = (businessData, options = {}) => {
    const tracer = createUITracer('stateManager');
    tracer.trace('createUIState', { hasData: !!businessData, mode: options.mode });

    return {
        ...createUIControlState(options),
        ...createBusinessDataState(businessData),
        userInteraction: createFreshInteraction(),
        effects: createFreshEffects(),
        options  // Store options for later use
    };
};

export const updateUIState = (state, action) => {
    const tracer = createUITracer('stateManager');
    tracer.trace('updateUIState', { actionType: action.type });
    
    // Guard clauses
    if (!state) return createUIState();
    if (!action?.type) return state;
    
    const transformer = UI_STATE_TRANSFORMERS[action.type];
    return transformer ? transformer(state, action.payload) : state;
};

// CONFIG - Table state transformations
export const UI_STATE_TRANSFORMERS = {
    [UI_ACTION_TYPES.SELECT_ANSWER]: (state, answerIndex) => ({
        ...state,
        userInteraction: {
            ...state.userInteraction,
            selectedAnswer: answerIndex,
            attempts: [...state.userInteraction.attempts, answerIndex]
        },
        interactionState: UI_INTERACTION_STATES.PROCESSING
    }),
    
    [UI_ACTION_TYPES.SHOW_EFFECTS]: (state, effectType) => ({
        ...state,
        showingEffects: true,
        effects: { ...state.effects, [effectType]: true }
    }),
    
    [UI_ACTION_TYPES.NEW_QUESTION]: (state, questionData) =>
        createScreenState(state, UI_SCREEN_TYPES.QUESTION, questionData, UI_INTERACTION_STATES.INTERACTIVE),

    [UI_ACTION_TYPES.NEW_WRITE_QUESTION]: (state, questionData) =>
        createScreenState(state, UI_SCREEN_TYPES.WRITE_QUESTION, questionData, UI_INTERACTION_STATES.INTERACTIVE),

    [UI_ACTION_TYPES.SHOW_RESULTS]: (state, resultsData) =>
        createScreenState(state, UI_SCREEN_TYPES.RESULTS, resultsData, UI_INTERACTION_STATES.INTERACTIVE),
    
    [UI_ACTION_TYPES.SHOW_TRANSITION]: (state, transitionData) => 
        createScreenState(state, UI_SCREEN_TYPES.TRANSITION, transitionData, UI_INTERACTION_STATES.WAITING),
    
    [UI_ACTION_TYPES.BACKGROUND_UPDATE]: (state, backgroundData) => ({
        ...state,
        backgroundData: backgroundData
    }),
    
    ...createExampleStateTransformer(),
    ...createExampleToQuestionTransformer()
};

// HELPERS
const createUIControlState = (options = {}) => ({
    currentScreen: options.mode === UI_MODE_TYPES.WRITE
        ? UI_SCREEN_TYPES.WRITE_QUESTION
        : UI_SCREEN_TYPES.QUESTION,
    interactionState: UI_INTERACTION_STATES.INTERACTIVE,
    showingEffects: false
});

const createBusinessDataState = (businessData) => ({
    questionData: businessData || null,
    pacmanData: businessData?.pacman || null,
    backgroundData: businessData?.background || null
});

const createScreenState = (state, screenType, data, interactionState) => ({
    ...state,
    currentScreen: screenType,
    questionData: data,
    pacmanData: data?.pacman || null,
    backgroundData: data?.background || state.backgroundData || null,
    interactionState,
    showingEffects: false,
    userInteraction: createFreshInteraction(),
    effects: createFreshEffects()
});

export const createFreshInteraction = () => ({
    selectedAnswer: null,
    attempts: [],
    startTime: Date.now()
});

export const createFreshEffects = () => ({
    correctAnimation: false,
    incorrectAnimation: false,
    exampleShowing: false
}); 