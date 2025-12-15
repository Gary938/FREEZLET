// Config/index.js - Centralized exports of Config layer

// IMPORTS
import {
    UI_SCREEN_TYPES,
    UI_ACTION_TYPES,
    UI_EFFECT_TYPES,
    UI_INTERACTION_STATES,
    UI_TIMINGS,
    UI_CSS_CLASSES,
    UI_LIMITS
} from './uiTypes.js';

import {
    UI_VALIDATION_RULES,
    UI_DATA_VALIDATORS,
    validateActionPayload,
    validateUIData
} from './uiValidation.js';

import {
    ANIMATION_CONFIG,
    TRANSITION_CONFIG,
    INTERACTION_CONFIG
} from './animationConfig.js';

// OPERATIONS - Grouped exports
export {
    // UI types and constants
    UI_SCREEN_TYPES,
    UI_ACTION_TYPES,
    UI_EFFECT_TYPES,
    UI_INTERACTION_STATES,
    UI_TIMINGS,
    UI_CSS_CLASSES,
    UI_LIMITS,
    
    // UI validation
    UI_VALIDATION_RULES,
    UI_DATA_VALIDATORS,
    validateActionPayload,
    validateUIData,
    
    // UI animations
    ANIMATION_CONFIG,
    TRANSITION_CONFIG,
    INTERACTION_CONFIG
};

// HELPERS - Convenience API
export const createConfigAPI = () => ({
    screenTypes: UI_SCREEN_TYPES,
    actionTypes: UI_ACTION_TYPES,
    effectTypes: UI_EFFECT_TYPES,
    timings: UI_TIMINGS,
    cssClasses: UI_CSS_CLASSES,
    validateAction: validateActionPayload,
    validateData: validateUIData,
    getAnimationConfig: (effectType) => ANIMATION_CONFIG[effectType],
    getTransitionConfig: (transitionType) => TRANSITION_CONFIG[transitionType]
}); 