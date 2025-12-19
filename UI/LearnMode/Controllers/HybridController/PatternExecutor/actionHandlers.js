// PatternExecutor/actionHandlers.js - Hybrid Pattern action handlers

// IMPORTS
import { UI_ACTION_TYPES } from '../../../Config/uiTypes.js';

// OPERATIONS
export const handleRestartAction = async (actionType, tracer) => {
    const eventMap = {
        [UI_ACTION_TYPES.TRY_AGAIN]: { reason: 'try_again', action: 'try_again' },
        [UI_ACTION_TYPES.NEXT_STAGE]: { reason: 'next_stage', action: 'next_stage' }
    };

    const eventData = eventMap[actionType];

    // Guard clause - check for unknown action type
    if (!eventData) {
        tracer.trace('handleRestartAction:error', { error: 'UNKNOWN_ACTION_TYPE', actionType });
        return createActionResult(false, null, null, { error: 'UNKNOWN_ACTION_TYPE' });
    }

    dispatchLearnModeEvent('hybrid:LEARN_MODE_RESTART', eventData);
    return createActionResult(true, null, null, { action: eventData.action });
};

export const handleCloseLearnMode = async (tracer) => {
    dispatchLearnModeEvent('hybrid:LEARN_MODE_CLOSE', { reason: 'user_close' });
    return createActionResult(true, null, null, { action: 'close' });
};

// HELPERS
const dispatchLearnModeEvent = (eventType, detail) => {
    const event = new CustomEvent(eventType, {
        detail,
        bubbles: true,
        cancelable: true
    });
    
    document.dispatchEvent(event);
};

const createActionResult = (success, state, components, businessData = null) => ({
    success,
    hybrid: {
        state,
        components,
        businessData,
        timestamp: Date.now()
    }
}); 