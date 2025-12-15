// State/stateStore.js - Immutable state store

import { trace } from '../../Utils/tracer.js';

// CONFIG
const STATES = new Map();
const PATHS = new Map();
const EXAMPLES = new Map();

// Session timeout configuration
const SESSION_CONFIG = {
    TIMEOUT_MS: 3600000,        // 1 hour session timeout
    CLEANUP_INTERVAL_MS: 300000 // Check every 5 minutes
};

// Session cleanup - prevents memory leaks from abandoned sessions
let cleanupIntervalId = null;

const cleanupExpiredSessions = () => {
    const now = Date.now();
    const toDelete = [];  // Phase 1: collect IDs to delete

    // Phase 1: Identify expired sessions (safe iteration)
    STATES.forEach((state, stateId) => {
        const sessionAge = now - (state.meta?.startTime || 0);
        if (sessionAge > SESSION_CONFIG.TIMEOUT_MS) {
            toDelete.push(stateId);
        }
    });

    // Phase 2: Delete collected sessions (no concurrent modification)
    toDelete.forEach(stateId => {
        trace('sessionExpired', { stateId });
        STATES.delete(stateId);
        PATHS.delete(stateId);
        EXAMPLES.delete(stateId);
    });

    if (toDelete.length > 0) {
        trace('sessionCleanup', { cleanedCount: toDelete.length, remainingSessions: STATES.size });
    }
};

// Start cleanup interval (called on first state creation)
const startCleanupInterval = () => {
    if (cleanupIntervalId) return; // Already running

    cleanupIntervalId = setInterval(cleanupExpiredSessions, SESSION_CONFIG.CLEANUP_INTERVAL_MS);
    trace('cleanupIntervalStarted', { intervalMs: SESSION_CONFIG.CLEANUP_INTERVAL_MS });
};

// Stop cleanup interval (for testing/shutdown)
export const stopCleanupInterval = () => {
    if (cleanupIntervalId) {
        clearInterval(cleanupIntervalId);
        cleanupIntervalId = null;
        trace('cleanupIntervalStopped');
    }
};

// Clear all sessions (for shutdown)
export const clearAllSessions = () => {
    const sessionCount = STATES.size;

    STATES.clear();
    PATHS.clear();
    EXAMPLES.clear();

    trace('allSessionsCleared', { sessionCount });
    return sessionCount;
};

// Deep clone question (for complete isolation)
const deepCloneQuestion = (q) => ({
    ...q,
    options: [...q.options],
    examples: q.examples ? [...q.examples] : []
});

// Deep clone for state (including question objects)
const deepCloneState = (state) => ({
    ...state,
    stats: {
        ...state.stats,
        attempted: [...state.stats.attempted],
        correct: [...state.stats.correct]
    },
    questions: {
        ...state.questions,
        all: state.questions.all.map(deepCloneQuestion),
        remaining: state.questions.remaining.map(deepCloneQuestion),
        current: state.questions.current.map(deepCloneQuestion),
        incorrect: state.questions.incorrect.map(deepCloneQuestion)
    },
    meta: { ...state.meta },
    extensions: { ...state.extensions }
});

// OPERATIONS
export const storeState = (state, testPath) => {
    const stateId = state.id;

    STATES.set(stateId, deepCloneState(state));
    PATHS.set(stateId, testPath);

    // Start cleanup interval on first session
    startCleanupInterval();

    trace('storeState', { stateId, testPath });
    return stateId;
};

export const getState = (stateId) => {
    const state = STATES.get(stateId);
    return state ? deepCloneState(state) : null;
};

export const getPath = (stateId) => {
    return PATHS.get(stateId) || null;
};

export const updateState = (stateId, newState) => {
    if (!STATES.has(stateId)) return false;

    STATES.set(stateId, deepCloneState(newState));
    trace('updateState', { stateId });
    return true;
};

export const hasState = (stateId) => {
    return STATES.has(stateId);
};

export const clearState = (stateId) => {
    const state = STATES.get(stateId);
    const path = PATHS.get(stateId);

    const info = {
        id: stateId,
        path: path
    };

    try {
        // Clear arrays to help garbage collection (optional optimization)
        if (state) {
            state.stats.attempted.length = 0;
            state.stats.correct.length = 0;
            state.questions.all.length = 0;
            state.questions.remaining.length = 0;
            state.questions.current.length = 0;
            state.questions.incorrect.length = 0;
        }
    } finally {
        // ALWAYS delete from Maps to prevent memory leaks
        STATES.delete(stateId);
        PATHS.delete(stateId);
        EXAMPLES.delete(stateId);

        trace('clearState', info);
    }

    return info;
};

export const setPendingExample = (stateId, example) => {
    EXAMPLES.set(stateId, example);
    trace('setPendingExample', { stateId, example });
};

// Get pending example WITHOUT deletion (safe for retry)
export const getPendingExample = (stateId) => {
    const example = EXAMPLES.get(stateId);

    if (example) {
        trace('getPendingExample', { stateId, example });
    }

    return example;
};

// Explicit pending example deletion (called after successful question submission)
export const clearPendingExample = (stateId) => {
    const hadExample = EXAMPLES.has(stateId);
    EXAMPLES.delete(stateId);

    if (hadExample) {
        trace('clearPendingExample', { stateId });
    }

    return hadExample;
};

// Get AND delete pending example (for backward compatibility, deprecated)
export const consumePendingExample = (stateId) => {
    const example = EXAMPLES.get(stateId);
    EXAMPLES.delete(stateId);

    if (example) {
        trace('consumePendingExample', { stateId, example });
    }

    return example;
}; 