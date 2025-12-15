// IsolationManager/isolationConfig.js - UI isolation configuration

// CONFIG
export const ISOLATION_CONFIG = {
    TIMEOUT: 1000,
    ANIMATION_DELAY: 300,
    ERROR_CODES: {
        INVALID_CALLBACK: 'INVALID_CALLBACK',
        TIMEOUT_ERROR: 'ISOLATION_TIMEOUT_ERROR',
        CREATION_FAILED: 'CREATION_FAILED'
    }
};

// OPERATIONS
export const getIsolationConfig = () => ISOLATION_CONFIG;
export const getErrorCode = (type) => ISOLATION_CONFIG.ERROR_CODES[type] || 'UNKNOWN_ERROR';
export const getTimeout = () => ISOLATION_CONFIG.TIMEOUT;
export const getAnimationDelay = () => ISOLATION_CONFIG.ANIMATION_DELAY; 