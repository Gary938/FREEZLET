// Utils/facadeValidator.js - LearnMode facade parameter validation

// CONFIG
export const VALIDATION_CONFIG = {
    ERROR_CODES: {
        ALREADY_ACTIVE: 'FACADE_ALREADY_ACTIVE',
        INVALID_TEST_PATH: 'INVALID_TEST_PATH'
    },
    MIN_TEST_PATH_LENGTH: 3,
    ALLOWED_TEST_PATH_TYPES: ['string']
};

// OPERATIONS
export const validateStartParams = (testPath, isActive, tracer) => {
    // Guard clause - activity check
    if (isActive) {
        const error = 'LearnMode is already active, use forceClose() to force close';
        tracer.trace('validation:error', { 
            error: VALIDATION_CONFIG.ERROR_CODES.ALREADY_ACTIVE,
            isActive 
        });
        throw new Error(error);
    }
    
    // Guard clause - testPath presence check
    if (!testPath) {
        const error = 'testPath is required';
        tracer.trace('validation:error', { 
            error: VALIDATION_CONFIG.ERROR_CODES.INVALID_TEST_PATH,
            testPath: null 
        });
        throw new Error(error);
    }
    
    // Guard clause - testPath type check
    if (typeof testPath !== 'string') {
        const error = 'testPath must be a string';
        tracer.trace('validation:error', { 
            error: VALIDATION_CONFIG.ERROR_CODES.INVALID_TEST_PATH,
            testPathType: typeof testPath 
        });
        throw new Error(error);
    }
    
    // Guard clause - testPath length check
    if (testPath.length < VALIDATION_CONFIG.MIN_TEST_PATH_LENGTH) {
        const error = `testPath must contain at least ${VALIDATION_CONFIG.MIN_TEST_PATH_LENGTH} characters`;
        tracer.trace('validation:error', { 
            error: VALIDATION_CONFIG.ERROR_CODES.INVALID_TEST_PATH,
            testPathLength: testPath.length 
        });
        throw new Error(error);
    }
    
    tracer.trace('validation:success', { testPath, isActive });
};

export const validateFacadeState = (state, tracer) => {
    // Guard clauses
    if (!state) {
        tracer.trace('validateFacadeState:noState');
        return false;
    }
    
    const requiredFields = ['isActive', 'hasController', 'hasEventCoordinator', 'hasIsolationManager'];
    
    for (const field of requiredFields) {
        if (!(field in state)) {
            tracer.trace('validateFacadeState:missingField', { field });
            return false;
        }
    }
    
    tracer.trace('validateFacadeState:success');
    return true;
}; 