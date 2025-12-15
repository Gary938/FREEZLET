// Controllers/BusinessBridge/businessBridge.js - Main bridge to business layer

// IMPORTS  
import { createElectronBridge } from '../../Bridge/index.js';
import { validateBusinessResponse } from '../../Utils/typeGuards.js';
import { createUITracer } from '../../Utils/uiTracer.js';
import { createBusinessErrorHandlers } from './businessErrorHandlers.js';

// CONFIG
export const BUSINESS_BRIDGE_CONFIG = {
    MAX_RETRIES: 2,
    VALIDATION_TIMEOUT: 3000,
    ERROR_CODES: {
        BRIDGE_UNAVAILABLE: 'BRIDGE_UNAVAILABLE',
        VALIDATION_FAILED: 'VALIDATION_FAILED',
        API_ERROR: 'API_ERROR'
    }
};

// OPERATIONS
export const createBusinessBridge = () => {
    const electronBridge = createElectronBridge();
    const tracer = createUITracer('businessBridge');
    const errorHandlers = createBusinessErrorHandlers();
    
    // Guard clause - Bridge availability check
    if (!electronBridge.isAvailable()) {
        tracer.trace('bridgeUnavailable');
        return errorHandlers.createUnavailableBridge();
    }
    
    tracer.trace('businessBridgeCreated', { bridgeAvailable: true });
    
    return {
        isAvailable: () => electronBridge.isAvailable(),
        
        startTest: async (testPath) => {
            tracer.trace('startTest:begin', { testPath });
            
            // Guard clauses
            if (!testPath || typeof testPath !== 'string') {
                return errorHandlers.createValidationError('INVALID_TEST_PATH', 'Test path must be a string');
            }
            
            try {
                const response = await electronBridge.startTest(testPath);
                const validation = validateBusinessResponse(response);
                
                if (!validation.success) {
                    tracer.trace('startTest:validationFailed', { error: validation.error });
                    return errorHandlers.createValidationError('RESPONSE_VALIDATION_FAILED', validation.error);
                }
                
                tracer.trace('startTest:success', { responseType: response.type });
                return response;
            } catch (error) {
                tracer.trace('startTest:error', { error: error.message });
                return errorHandlers.createApiError('startTest', error);
            }
        },
        
        submitAnswerResult: async (result) => {
            tracer.trace('submitAnswerResult:begin', { result });
            
            // Guard clauses
            if (!result || !['correct', 'incorrect'].includes(result)) {
                return errorHandlers.createValidationError('INVALID_ANSWER_RESULT', 'Result must be "correct" or "incorrect"');
            }
            
            try {
                const response = await electronBridge.submitAnswerResult(result);
                const validation = validateBusinessResponse(response);
                
                if (!validation.success) {
                    tracer.trace('submitAnswerResult:validationFailed', { error: validation.error });
                    return errorHandlers.createValidationError('RESPONSE_VALIDATION_FAILED', validation.error);
                }
                
                tracer.trace('submitAnswerResult:success', { responseType: response.type });
                return response;
            } catch (error) {
                tracer.trace('submitAnswerResult:error', { error: error.message });
                return errorHandlers.createApiError('submitAnswerResult', error);
            }
        }
    };
}; 