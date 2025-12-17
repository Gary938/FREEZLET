// Config/uiTypes.js - UI types and constants

// CONFIG - LearnMode modes
export const UI_MODE_TYPES = {
    SELECT: 'select',   // Standard mode with option selection
    WRITE: 'write'      // Mode with text answer input
};

// CONFIG - UI screen types
export const UI_SCREEN_TYPES = {
    QUESTION: 'question',
    WRITE_QUESTION: 'write_question',  // Answer input screen for Write Mode
    LOADING: 'loading',
    RESULTS: 'results',
    ERROR: 'error',
    EXAMPLE: 'example',
    TRANSITION: 'transition'
};

// CONFIG - UI action types
export const UI_ACTION_TYPES = {
    SELECT_ANSWER: 'SELECT_ANSWER',
    SHOW_EFFECTS: 'SHOW_EFFECTS',
    SUBMIT_ANSWER: 'SUBMIT_ANSWER',
    SUBMIT_RESULT: 'SUBMIT_RESULT',
    NEW_QUESTION: 'NEW_QUESTION',
    NEW_WRITE_QUESTION: 'NEW_WRITE_QUESTION',  // New question for Write Mode
    SHOW_RESULTS: 'SHOW_RESULTS',
    SHOW_TRANSITION: 'SHOW_TRANSITION',
    BACKGROUND_UPDATE: 'BACKGROUND_UPDATE',
    TRY_AGAIN: 'TRY_AGAIN',
    NEXT_STAGE: 'NEXT_STAGE',
    CLOSE_LEARN_MODE: 'CLOSE_LEARN_MODE',
    DISPLAY_EXAMPLE: 'DISPLAY_EXAMPLE',
    HANDLE_ERROR: 'HANDLE_ERROR'
};

// CONFIG - UI effect types
export const UI_EFFECT_TYPES = {
    CORRECT_ANIMATION: 'correctAnimation',
    INCORRECT_ANIMATION: 'incorrectAnimation',
    EXAMPLE_SHOWING: 'exampleShowing',
    LOADING_SPINNER: 'loadingSpinner',
    ERROR_FLASH: 'errorFlash'
};

// CONFIG - Interaction states
export const UI_INTERACTION_STATES = {
    INTERACTIVE: 'interactive',
    DISABLED: 'disabled',
    PROCESSING: 'processing',
    ERROR: 'error',
    WAITING: 'waiting'
};

// CONFIG - Timing constants (from old UI analysis)
export const UI_TIMINGS = {
    EFFECT_DURATION: 2000,          // Answer effects duration
    TRANSITION_DELAY: 500,          // Delay between block transitions
    LOADING_MIN_TIME: 300,          // Minimum loading display time
    ERROR_DISPLAY_TIME: 5000,       // Error display time
    EXAMPLE_DISPLAY_TIME: 1700,     // Example display time
    ANIMATION_DELAY: 100            // Delay for CSS animations
};

// CONFIG - CSS classes for states
export const UI_CSS_CLASSES = {
    CORRECT_ANSWER: 'flash-correct',
    INCORRECT_ANSWER: 'flash-incorrect',
    DISABLED_BUTTON: 'disabled',
    LOADING_STATE: 'loading',
    ERROR_STATE: 'error',
    EXAMPLE_DISPLAY: 'example-showing'
};

// CONFIG - UI sizes and limits
export const UI_LIMITS = {
    MAX_ANSWER_LENGTH: 200,
    MAX_QUESTION_LENGTH: 1000,
    MIN_OPTIONS_COUNT: 2,
    MAX_OPTIONS_COUNT: 4,
    MAX_EXAMPLES_COUNT: 5
}; 