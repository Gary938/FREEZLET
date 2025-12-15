// Controllers/BusinessBridge/index.js - Centralized export of BusinessBridge

// IMPORTS
import { createBusinessBridge, BUSINESS_BRIDGE_CONFIG } from './businessBridge.js';

// OPERATIONS - Direct exports
export {
    createBusinessBridge,
    BUSINESS_BRIDGE_CONFIG
} from './businessBridge.js';

export {
    createBackgroundBridge,
    BACKGROUND_BRIDGE_CONFIG
} from './backgroundBridge.js'; 