// Bridge/index.js - Centralized export of Bridge layer

// IMPORTS
import { createElectronBridge, BRIDGE_CONFIG } from './electronBridge.js';
import { createUITracer } from '../Utils/uiTracer.js';

// OPERATIONS - Direct exports
export {
    createElectronBridge,
    BRIDGE_CONFIG
} from './electronBridge.js';

// OPERATIONS - API for Bridge layer
export const createBridgeAPI = () => {
    const tracer = createUITracer('bridgeAPI');
    const electronBridge = createElectronBridge();
    
    tracer.trace('bridgeAPICreated', {
        available: electronBridge.isAvailable(),
        methods: ['startTest', 'submitAnswerResult', 'clearCurrentTest', 'hasActiveTest']
    });
    
    return {
        // Main bridge
        electron: electronBridge,
        
        // API status
        isElectronAvailable: electronBridge.isAvailable,
        
        // Convenience methods
        checkAvailability: async () => {
            if (!electronBridge.isAvailable()) {
                return { available: false, reason: 'ELECTRON_API_NOT_FOUND' };
            }
            
            try {
                await electronBridge.hasActiveTest();
                return { available: true };
            } catch (error) {
                return { available: false, reason: error.code || 'API_ERROR' };
            }
        },
        
        // Bridge information
        info: {
            version: '2.0.0-bridge',
            timeout: BRIDGE_CONFIG.API_TIMEOUT,
            methods: 4
        }
    };
};

// HELPERS - Static checks
export const validateElectronEnvironment = () => {
    const checks = {
        hasWindow: typeof window !== 'undefined',
        hasElectron: !!window?.electron,
        hasLearnModeAPI: !!window?.electron?.learnMode,
        apiMethods: window?.electron?.learnMode ? 
            Object.keys(window.electron.learnMode).length : 0
    };
    
    return {
        isValid: checks.hasWindow && checks.hasElectron && checks.hasLearnModeAPI,
        checks,
        timestamp: Date.now()
    };
}; 