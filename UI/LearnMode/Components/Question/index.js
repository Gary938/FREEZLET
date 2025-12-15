// Components/Question/index.js - Centralized Question module export

// IMPORTS
import { createQuestionComponent, cleanupQuestion, updateQuestionData, QUESTION_CONFIG } from './questionComponent.js';
import {
    disableAllAnswerButtons,
    enableAllAnswerButtons,
    resetEffects
} from './effectsButtons.js';
import {
    renderQuestionToDOM,
    createQuestionContainer
} from './questionRenderer.js';
import { attachAnswerHandlers } from './questionHandlers.js';

// Direct exports for external use
export {
    createQuestionComponent,
    cleanupQuestion,
    updateQuestionData,
    renderQuestionToDOM,
    createQuestionContainer,
    attachAnswerHandlers,
    disableAllAnswerButtons,
    enableAllAnswerButtons,
    resetEffects,
    QUESTION_CONFIG
}; 