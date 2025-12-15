// Config/animationConfig.js - UI animation configuration

// IMPORTS
import { UI_EFFECT_TYPES, UI_TIMINGS, UI_CSS_CLASSES } from './uiTypes.js';

// CONFIG - Animation effects configuration
export const ANIMATION_CONFIG = {
    [UI_EFFECT_TYPES.CORRECT_ANIMATION]: {
        cssClass: UI_CSS_CLASSES.CORRECT_ANSWER,
        duration: UI_TIMINGS.EFFECT_DURATION,
        delay: UI_TIMINGS.ANIMATION_DELAY,
        removeAfter: true
    },
    [UI_EFFECT_TYPES.INCORRECT_ANIMATION]: {
        cssClass: UI_CSS_CLASSES.INCORRECT_ANSWER,
        duration: UI_TIMINGS.EFFECT_DURATION,
        delay: UI_TIMINGS.ANIMATION_DELAY,
        removeAfter: true
    },
    [UI_EFFECT_TYPES.EXAMPLE_SHOWING]: {
        cssClass: UI_CSS_CLASSES.EXAMPLE_DISPLAY,
        duration: UI_TIMINGS.EXAMPLE_DISPLAY_TIME,
        delay: 0,
        removeAfter: true
    },
    [UI_EFFECT_TYPES.LOADING_SPINNER]: {
        cssClass: UI_CSS_CLASSES.LOADING_STATE,
        duration: UI_TIMINGS.LOADING_MIN_TIME,
        delay: 0,
        removeAfter: false
    },
    [UI_EFFECT_TYPES.ERROR_FLASH]: {
        cssClass: UI_CSS_CLASSES.ERROR_STATE,
        duration: UI_TIMINGS.ERROR_DISPLAY_TIME,
        delay: UI_TIMINGS.ANIMATION_DELAY,
        removeAfter: true
    }
};

// CONFIG - Screen transition settings
export const TRANSITION_CONFIG = {
    fadeIn: {
        duration: UI_TIMINGS.TRANSITION_DELAY,
        easing: 'ease-in',
        properties: ['opacity']
    },
    fadeOut: {
        duration: UI_TIMINGS.TRANSITION_DELAY,
        easing: 'ease-out',
        properties: ['opacity']
    },
    slideIn: {
        duration: UI_TIMINGS.TRANSITION_DELAY,
        easing: 'ease-in-out',
        properties: ['transform', 'opacity']
    }
};

// CONFIG - Button interactivity settings
export const INTERACTION_CONFIG = {
    disableDelay: UI_TIMINGS.ANIMATION_DELAY,
    enableDelay: UI_TIMINGS.ANIMATION_DELAY * 2,
    hoverEffectDuration: 200,
    clickEffectDuration: 150
}; 