// Controllers/BusinessBridge/businessErrorHandlers.js - Business bridge error handling

// OPERATIONS
export const createBusinessErrorHandlers = () => {
    return {
        createUnavailableBridge: () => ({
            isAvailable: () => false,
            startTest: async () => createBridgeError('BRIDGE_UNAVAILABLE', 'Electron bridge is not available'),
            submitAnswerResult: async () => createBridgeError('BRIDGE_UNAVAILABLE', 'Electron bridge is not available')
        }),
        
        createValidationError: (code, message) => ({
            success: false,
            error: {
                code,
                message,
                category: 'VALIDATION_ERROR',
                timestamp: Date.now()
            }
        }),
        
        createApiError: (method, error) => ({
            success: false,
            error: {
                code: error.code || 'API_ERROR',
                message: error.message || 'Unknown API error',
                method,
                category: 'API_ERROR',
                timestamp: Date.now()
            }
        }),
        
        createBridgeError: (code, message) => ({
            success: false,
            error: {
                code,
                message,
                category: 'BRIDGE_ERROR',
                timestamp: Date.now()
            }
        })
    };
};

// HELPERS - Direct functions for backward compatibility
export const createValidationError = (code, message) => ({
    success: false,
    error: {
        code,
        message,
        category: 'VALIDATION_ERROR',
        timestamp: Date.now()
    }
});

export const createApiError = (method, error) => ({
    success: false,
    error: {
        code: error.code || 'API_ERROR',
        message: error.message || 'Unknown API error',
        method,
        category: 'API_ERROR',
        timestamp: Date.now()
    }
});

export const createBridgeError = (code, message) => ({
    success: false,
    error: {
        code,
        message,
        category: 'BRIDGE_ERROR',
        timestamp: Date.now()
    }
}); 