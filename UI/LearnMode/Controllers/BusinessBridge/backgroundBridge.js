// Controllers/BusinessBridge/backgroundBridge.js - Background integration with business layer

// IMPORTS
import { createUITracer } from '../../Utils/uiTracer.js';

// CONFIG
export const BACKGROUND_BRIDGE_CONFIG = {
    ELECTRON_API_METHOD: 'setBackgroundMode',
    ERROR_CODES: {
        NO_ELECTRON_API: 'NO_ELECTRON_API',
        INVALID_MODE: 'INVALID_MODE',
        BRIDGE_ERROR: 'BRIDGE_ERROR'
    },
    VALID_MODES: ['story', 'random', 'custom']
};

// OPERATIONS
export const createBackgroundBridge = () => {
    const tracer = createUITracer('backgroundBridge');
    
    return {
        setBackgroundMode: async (mode) => {
            // Guard clauses
            if (!mode || typeof mode !== 'string') {
                tracer.trace('setBackgroundMode:invalidMode', { mode });
                return createErrorResult(BACKGROUND_BRIDGE_CONFIG.ERROR_CODES.INVALID_MODE);
            }
            
            if (!BACKGROUND_BRIDGE_CONFIG.VALID_MODES.includes(mode)) {
                tracer.trace('setBackgroundMode:unsupportedMode', { mode });
                return createErrorResult(BACKGROUND_BRIDGE_CONFIG.ERROR_CODES.INVALID_MODE);
            }
            
            if (!window.electron?.learnMode) {
                tracer.trace('setBackgroundMode:noElectronAPI');
                return createErrorResult(BACKGROUND_BRIDGE_CONFIG.ERROR_CODES.NO_ELECTRON_API);
            }
            
            tracer.trace('setBackgroundMode:start', { mode });
            
            try {
                const result = await window.electron.learnMode.setBackgroundMode(mode);
                
                if (result?.success) {
                    tracer.trace('setBackgroundMode:success', { 
                        mode: result.mode,
                        hasBackgroundPath: !!result.backgroundPath 
                    });
                    
                    return {
                        success: true,
                        data: {
                            mode: result.mode,
                            backgroundPath: result.backgroundPath
                        }
                    };
                } else {
                    tracer.trace('setBackgroundMode:businessError', { 
                        error: result?.error 
                    });
                    return createErrorResult(result?.error || 'Unknown business error');
                }
                
            } catch (error) {
                tracer.trace('setBackgroundMode:error', { error: error.message });
                return createErrorResult(error.message);
            }
        }
    };
};

// HELPERS
const createErrorResult = (errorMessage) => ({
    success: false,
    error: errorMessage,
    data: null
}); 