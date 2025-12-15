// Controllers/HybridController/HybridController/businessInitializer.js - Business layer initialization

// IMPORTS
import { createBusinessBridge, createBackgroundBridge } from '../../BusinessBridge/index.js';

// OPERATIONS
export const initializeBusinessLayer = async (testPath) => {
    const businessBridge = await initializeBusinessBridge();
    const businessData = await startBusinessTest(businessBridge, testPath);
    return { businessBridge, businessData };
};

export const initializeBusinessBridge = async () => {
    const businessBridge = createBusinessBridge();
    if (!businessBridge.isAvailable()) {
        throw new Error('BUSINESS_BRIDGE_UNAVAILABLE');
    }
    
    // Add backgroundBridge as method
    businessBridge.setBackgroundMode = createBackgroundBridge().setBackgroundMode;
    
    return businessBridge;
};

export const startBusinessTest = async (businessBridge, testPath) => {
    const businessData = await businessBridge.startTest(testPath);
    if (!businessData.success) {
        throw new Error(`START_TEST_FAILED: ${businessData.error?.message}`);
    }
    return businessData;
}; 