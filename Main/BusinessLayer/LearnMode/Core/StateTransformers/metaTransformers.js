// StateTransformers/metaTransformers.js - Metadata transformations

import { updateMeta } from './baseTransformers.js';

// CONFIG
const META_CONFIG = {
    INCREMENT_STEP: 1,
    MIN_BLOCK_COUNT: 0
};

// OPERATIONS
export const incrementBlockCount = (state) => {
    return updateMeta(state, {
        blockCount: state.meta.blockCount + META_CONFIG.INCREMENT_STEP
    });
};

export const setBlockCount = (state, count) => {
    const validCount = Math.max(count, META_CONFIG.MIN_BLOCK_COUNT);
    
    return updateMeta(state, {
        blockCount: validCount
    });
}; 