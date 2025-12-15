// StateTransformers/baseTransformers.js - Basic immutable transformations

import { trace } from '../../Utils/tracer.js';

// CONFIG
const BASE_TRANSFORM_CONFIG = {
    TRACE_ENABLED: true
};

// OPERATIONS
export const updateQuestions = (state, questionUpdates) => {
    if (BASE_TRANSFORM_CONFIG.TRACE_ENABLED) {
        trace('updateQuestions', { stateId: state.id });
    }
    
    return {
        ...state,
        questions: {
            ...state.questions,
            ...questionUpdates
        }
    };
};

export const updateStats = (state, statUpdates) => {
    if (BASE_TRANSFORM_CONFIG.TRACE_ENABLED) {
        trace('updateStats', { stateId: state.id });
    }
    
    return {
        ...state,
        stats: {
            ...state.stats,
            ...statUpdates
        }
    };
};

export const updateMeta = (state, metaUpdates) => {
    return {
        ...state,
        meta: {
            ...state.meta,
            ...metaUpdates
        }
    };
}; 