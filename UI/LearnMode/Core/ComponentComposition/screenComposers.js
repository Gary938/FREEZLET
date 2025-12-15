// Core/ComponentComposition/screenComposers.js - Composers by screen types

// IMPORTS
import { UI_SCREEN_TYPES } from '../../Config/uiTypes.js';
import { createQuestionComponent } from '../../Components/Question/index.js';
import { createWriteQuestionComponent } from '../../Components/WriteQuestion/index.js';
import { createResultsComponent } from '../../Components/Results/index.js';
import { createTransitionComponent } from '../../Components/Screen/index.js';
import { createPacmanComponent } from '../../Components/Pacman/index.js';
import { createBackgroundComponent } from '../../Components/Background/index.js';
import { createUITracer } from '../../Utils/uiTracer.js';
import { composeExampleScreen, createExampleScreenComposer } from './Example/index.js';
import { explodePacmanOnResults } from './screenComposersHelpers.js';

// OPERATIONS
export const composeQuestionScreen = (state, controllerAPI = null) => {
    const tracer = createUITracer('screenComposers');
    
    if (!state?.questionData) {
        return { main: null, type: 'error' };
    }
    
    const handleAnswerCallback = createAnswerCallback(controllerAPI);
    const questionComponent = createQuestionComponent(state.questionData, handleAnswerCallback);
    
    // 🆕 PAGINATION SUPPORT: check new pacman command format
    let pacmanComponent = null;
    if (state.pacmanData) {
        // If new initialization command with pagination received, process it
        if (state.pacmanData.action === 'init' && state.pacmanData.pagination) {
            tracer.trace('pacmanInit:paginationDetected', {
                totalQuestions: state.pacmanData.totalQuestions,
                needsPagination: state.pacmanData.pagination.needsPagination,
                firstPageGhosts: state.pacmanData.totalGhosts
            });
            
            // Create component and process initialization command
            pacmanComponent = createPacmanComponent(state.pacmanData);
            if (pacmanComponent?.processCommand) {
                pacmanComponent.processCommand(state.pacmanData);
            }
        } else {
            // Old format or regular data
            pacmanComponent = createPacmanComponent(state.pacmanData);
        }
    }
    
    // Save component reference in DOM element for direct access
    if (pacmanComponent) {
        pacmanComponent.element.setAttribute('data-component', 'pacman');
        pacmanComponent.element.pacmanComponent = pacmanComponent;
    }
    
    return {
        main: questionComponent,
        pacman: pacmanComponent,
        background: createBackgroundComponent(state.backgroundData, controllerAPI?.businessBridge),
        type: 'question'
    };
};

export const composeResultsScreen = (state, controllerAPI = null) => {
    const tracer = createUITracer('screenComposers');
    
    if (!state?.questionData) {
        return { main: null, type: 'error' };
    }
    
    const resultsComponent = createResultsComponent(state.questionData);
    
    if (controllerAPI && resultsComponent?.attachHandlers) {
        const handlers = createResultsHandlers(controllerAPI);
        resultsComponent.attachHandlers(handlers);
    }
    
    // 🎆 NEW: Pacman explosion on results display
    explodePacmanOnResults(tracer);
    
    return {
        main: resultsComponent,
        type: 'results'
    };
};

export const composeTransitionScreen = (state, controllerAPI = null) => {
    if (!state?.questionData) {
        return { main: null, type: 'error' };
    }

    const transitionComponent = createTransitionComponent(state.questionData, controllerAPI);

    return {
        main: transitionComponent,
        background: createBackgroundComponent(state.backgroundData, controllerAPI?.businessBridge),
        type: 'transition'
    };
};

export const composeWriteQuestionScreen = (state, controllerAPI = null) => {
    const tracer = createUITracer('screenComposers');

    if (!state?.questionData) {
        return { main: null, type: 'error' };
    }

    const handleAnswerCallback = createAnswerCallback(controllerAPI);

    // Get showHints option from controllerAPI or state
    const showHints = controllerAPI?.options?.showHints || state?.showHints || false;

    const writeQuestionComponent = createWriteQuestionComponent(
        state.questionData,
        handleAnswerCallback,
        { showHints }
    );

    // Pacman support (similar to composeQuestionScreen)
    let pacmanComponent = null;
    if (state.pacmanData) {
        if (state.pacmanData.action === 'init' && state.pacmanData.pagination) {
            tracer.trace('pacmanInit:paginationDetected:writeMode', {
                totalQuestions: state.pacmanData.totalQuestions,
                needsPagination: state.pacmanData.pagination.needsPagination
            });
            pacmanComponent = createPacmanComponent(state.pacmanData);
            if (pacmanComponent?.processCommand) {
                pacmanComponent.processCommand(state.pacmanData);
            }
        } else {
            pacmanComponent = createPacmanComponent(state.pacmanData);
        }
    }

    // Save component reference in DOM element
    if (pacmanComponent) {
        pacmanComponent.element.setAttribute('data-component', 'pacman');
        pacmanComponent.element.pacmanComponent = pacmanComponent;
    }

    return {
        main: writeQuestionComponent,
        pacman: pacmanComponent,
        background: createBackgroundComponent(state.backgroundData, controllerAPI?.businessBridge),
        type: 'write_question'
    };
};

// CONFIG - Table composers by screens
export const SCREEN_COMPOSERS = {
    [UI_SCREEN_TYPES.QUESTION]: composeQuestionScreen,
    [UI_SCREEN_TYPES.WRITE_QUESTION]: composeWriteQuestionScreen,
    [UI_SCREEN_TYPES.RESULTS]: composeResultsScreen,
    [UI_SCREEN_TYPES.TRANSITION]: composeTransitionScreen,
    // 🆕 INTEGRATION: Example composer from ExampleComposer.js
    ...createExampleScreenComposer()
};

// HELPERS
const createAnswerCallback = (controllerAPI) => {
    if (!controllerAPI) return null;

    return (result) => {
        const tracer = createUITracer('screenComposers');

        if (controllerAPI.handleUserAction) {
            controllerAPI.handleUserAction('SUBMIT_ANSWER', result)
                .then(response => {
                    if (response?.success && response?.hybrid?.components?.render) {
                        response.hybrid.components.render();
                    }
                })
                .catch(error => {
                    tracer.trace('answerCallback:error', { error: error.message });
                    console.error('Error sending answer:', error);
                });
        }
    };
};

const createResultsHandlers = (controllerAPI) => ({
    try_again: () => controllerAPI.handleUserAction('TRY_AGAIN'),
    next_stage: () => controllerAPI.handleUserAction('NEXT_STAGE'),
    close: () => controllerAPI.handleUserAction('CLOSE_LEARN_MODE')
});