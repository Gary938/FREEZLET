// Core/ExampleTransformers.js - State transformers for example system

// IMPORTS
import { UI_SCREEN_TYPES, UI_ACTION_TYPES, UI_INTERACTION_STATES } from '../Config/uiTypes.js';
import { createFreshInteraction, createFreshEffects } from './stateManager.js';

// CONFIG
export const EXAMPLE_TRANSFORMER_CONFIG = {
    EXAMPLE_TIMEOUT: 3000,          // 3 seconds example display
    AUTO_TRANSITION: true,          // Automatic transition to question
    PRESERVE_QUESTION_DATA: true    // Preserve question data when showing example
};

// OPERATIONS
export const createExampleStateTransformer = () => {
    return {
        [UI_ACTION_TYPES.DISPLAY_EXAMPLE]: transformToExampleState
    };
};

export const transformToExampleState = (state, examplePayload) => {
    // Guard clauses
    if (!examplePayload?.exampleText) return state;
    if (!examplePayload?.questionData) return state;
    
    return {
        ...state,
        ...createExampleScreenState(examplePayload),
        ...createExampleDataState(examplePayload),
        ...createExampleInteractionState()
    };
};

export const createExampleToQuestionTransformer = () => {
    return {
        [UI_ACTION_TYPES.NEW_QUESTION]: transformExampleToQuestion,
        [UI_ACTION_TYPES.NEW_WRITE_QUESTION]: transformExampleToWriteQuestion
    };
};

export const transformExampleToWriteQuestion = (state, questionData) => {
    const finalQuestionData = resolveQuestionData(state, questionData);

    return {
        ...state,
        ...createWriteQuestionScreenState(finalQuestionData),
        ...cleanupExampleState(),
        ...createQuestionInteractionState()
    };
};

export const transformExampleToQuestion = (state, questionData) => {
    const finalQuestionData = resolveQuestionData(state, questionData);
    
    return {
        ...state,
        ...createQuestionScreenState(finalQuestionData),
        ...cleanupExampleState(),
        ...createQuestionInteractionState()
    };
};

// HELPERS
const createExampleScreenState = (examplePayload) => ({
    currentScreen: UI_SCREEN_TYPES.EXAMPLE,
    interactionState: UI_INTERACTION_STATES.WAITING,
    showingEffects: false
});

const createExampleDataState = (examplePayload) => ({
    exampleData: {
        text: examplePayload.exampleText,
        questionId: examplePayload.questionData.id,
        showTime: Date.now(),
        autoTransition: EXAMPLE_TRANSFORMER_CONFIG.AUTO_TRANSITION
    },
    pendingQuestionData: examplePayload.questionData,
    questionData: examplePayload.questionData
});

const createExampleInteractionState = () => ({
    effects: {
        ...createFreshEffects(),
        exampleShowing: true
    },
    userInteraction: createFreshInteraction()
});

const resolveQuestionData = (state, questionData) => {
    return state.exampleData?.questionId ? 
        (state.pendingQuestionData || questionData) : 
        questionData;
};

const createQuestionScreenState = (finalQuestionData) => ({
    currentScreen: UI_SCREEN_TYPES.QUESTION,
    questionData: finalQuestionData,
    pacmanData: finalQuestionData?.pacman || null,
    backgroundData: finalQuestionData?.background || null
});

const createWriteQuestionScreenState = (finalQuestionData) => ({
    currentScreen: UI_SCREEN_TYPES.WRITE_QUESTION,
    questionData: finalQuestionData,
    pacmanData: finalQuestionData?.pacman || null,
    backgroundData: finalQuestionData?.background || null
});

const cleanupExampleState = () => ({
    exampleData: null,
    pendingQuestionData: null
});

const createQuestionInteractionState = () => ({
    interactionState: UI_INTERACTION_STATES.INTERACTIVE,
    showingEffects: false,
    effects: createFreshEffects(),
    userInteraction: createFreshInteraction()
}); 