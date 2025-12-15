// Core/stateManager.js - State management API layer

import { createTestState, STATE_STATUS } from './State/stateFactory.js';
import {
    storeState,
    getState,
    getPath,
    updateState as updateStateInStore,
    hasState,
    clearState as clearStateInStore,
    setPendingExample as setPendingExampleInStore,
    getPendingExample as getPendingExampleFromStore,
    clearPendingExample as clearPendingExampleFromStore
} from './State/stateStore.js';
import { getStateInfo as getStateInfoFromQueries } from './State/stateQueries.js';
import { trace } from '../Utils/tracer.js';

// CONFIG
const STATE_MANAGER_CONFIG = {
    NO_STATE_ID: null
};

// STATE TRACKING
let currentStateId = STATE_MANAGER_CONFIG.NO_STATE_ID;

// OPERATIONS
export const createState = (questions, stage, testPath) => {
    // Race condition protection: clear previous state before creating new
    if (currentStateId && hasState(currentStateId)) {
        trace('createState:clearingPrevious', { previousStateId: currentStateId });
        clearStateInStore(currentStateId);
    }

    const state = createTestState(questions, stage);
    const stateId = storeState(state, testPath);

    currentStateId = stateId;

    trace('createState', { stateId, stage });
    return state;
};

// Returns state object or null. Use hasActiveTest() to check before calling.
export const getCurrentState = () => {
    if (!currentStateId) return null;
    return getState(currentStateId);
};

export const getCurrentPath = () => {
    if (!currentStateId) return null;
    return getPath(currentStateId);
};

export const hasActiveTest = () => {
    return currentStateId !== STATE_MANAGER_CONFIG.NO_STATE_ID && hasState(currentStateId);
};

export const updateCurrentState = (newState) => {
    if (!currentStateId) return false;

    // Validate state structure before saving
    if (!isValidState(newState)) {
        trace('updateCurrentState:invalidState', {
            hasState: !!newState,
            hasQuestions: !!newState?.questions,
            hasStats: !!newState?.stats,
            hasMeta: !!newState?.meta
        });
        return false;
    }

    return updateStateInStore(currentStateId, newState);
};

// Validate minimal required state structure
const isValidState = (state) => {
    if (!state || typeof state !== 'object') return false;

    // Check required top-level properties
    if (!state.id || !state.questions || !state.stats || !state.meta) return false;

    // Check questions structure
    const q = state.questions;
    if (!Array.isArray(q.all) || !Array.isArray(q.remaining) ||
        !Array.isArray(q.current) || !Array.isArray(q.incorrect)) return false;

    // Check stats structure
    const s = state.stats;
    if (!Array.isArray(s.attempted) || !Array.isArray(s.correct)) return false;

    // Check meta structure
    if (typeof state.meta.blockCount !== 'number') return false;

    return true;
};



export const setPendingExample = (example) => {
    if (!currentStateId) return;
    setPendingExampleInStore(currentStateId, example);
};

export const getPendingExample = () => {
    if (!currentStateId) return STATE_MANAGER_CONFIG.NO_STATE_ID;
    return getPendingExampleFromStore(currentStateId);
};

export const clearPendingExample = () => {
    if (!currentStateId) return false;
    return clearPendingExampleFromStore(currentStateId);
};

export const getStateInfo = () => {
    const state = getCurrentState();
    return getStateInfoFromQueries(state);
};

export const clearState = () => {
    if (!currentStateId) return STATE_MANAGER_CONFIG.NO_STATE_ID;
    
    const info = clearStateInStore(currentStateId);
    currentStateId = STATE_MANAGER_CONFIG.NO_STATE_ID;
    
    return info;
};

// TYPES EXPORT
export { STATE_STATUS }; 