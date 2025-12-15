// Facade/EventCoordinator/eventTypes.js - Event configuration and types

// CONFIG
export const EVENT_COORDINATOR_CONFIG = {
    MAX_LISTENERS: 20,
    EVENT_TIMEOUT: 3000,
    CLEANUP_DELAY: 100,
    EVENT_PREFIX: 'hybrid'
};

// TYPES - Hybrid Pattern Ultimate events
export const HYBRID_EVENTS = {
    // Facade lifecycle
    FACADE_READY: 'facade_ready',
    LEARN_MODE_CLOSE: 'learn_mode_close',
    
    // Controller events
    CONTROLLER_READY: 'controller_ready',
    CONTROLLER_ERROR: 'controller_error',
    
    // UI component events
    QUESTION_DISPLAYED: 'question_displayed',
    ANSWER_SELECTED: 'answer_selected',
    RESULTS_SHOWN: 'results_shown',
    
    // UI isolation events
    UI_HIDDEN: 'ui_hidden',
    UI_RESTORED: 'ui_restored',
    
    // Error events
    ISOLATION_ERROR: 'isolation_error',
    FORCE_CLOSE: 'force_close'
}; 