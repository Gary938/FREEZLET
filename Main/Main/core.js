// 📁 Main/Main/core.js — main functions for Main process

import { app, BrowserWindow } from "electron";
import { mainLogger } from "../loggerHub.js";
import { createMainWindow } from "./createMainWindow.js";
import { setupAppLifecycle } from "./lifecycle.js";

mainLogger.ready("Main/Main/core.js loaded");

// Track errors and warnings during initialization
let hasErrors = false;
let hasWarnings = false;

/**
 * Sets up log interception for tracking errors and warnings
 */
export function setupLogInterception() {
    // Intercept error and warning logs
    const originalError = mainLogger.error;
    const originalWarn = mainLogger.warn;

    mainLogger.error = function(...args) {
        hasErrors = true;
        return originalError.apply(this, args);
    };

    mainLogger.warn = function(...args) {
        hasWarnings = true;
        return originalWarn.apply(this, args);
    };
}

/**
 * Initializes main application components
 * @param {boolean} isDev - Development mode flag
 */
export async function initializeApp(isDev) {
    try {
        mainLogger.info("main", "Application initialization");
        mainLogger.debug("main", "Starting initialization process", { timestamp: new Date().toISOString() });
        
        // Registration of new IPC handlers already done on import
        mainLogger.info("main", "New IPC handlers registered");
        mainLogger.debug("main", "Active windows count: " + BrowserWindow.getAllWindows().length);
        
        // IMPORTANT: First set up lifecycle
        setupAppLifecycle(isDev);
        
        // Then create window without await, as function may not return promise
        try {
            // Create window and explicitly pass isDev parameter
            const mainWindow = createMainWindow(isDev);
            mainLogger.debug("main", `Main window created: isDev=${isDev}`, { size: { width: 1280, height: 720 } });
            
            if (mainWindow && mainWindow.webContents) {
                // Subscribe to window ready event
                mainWindow.webContents.on('did-finish-load', () => {
                    // Output init stats only if no errors and warnings
                    if (!hasErrors && !hasWarnings) {
                        mainLogger.debug("System", "Initialization stats", {
                            errors: hasErrors,
                            warnings: hasWarnings,
                            startupTime: Date.now() - app.getAppMetrics()[0].timestamp
                        });
                    }
                });
            } else {
                // Log info if window was not created correctly
                mainLogger.warn("main", "Window created but has no webContents or returned undefined");
            }
        } catch (windowError) {
            mainLogger.error("main", `Window creation error: ${windowError.message}`);
        }
        
        mainLogger.info("main", "Application initialized");
    } catch (err) {
        mainLogger.error("main", `Initialization error: ${err.message}`);
        app.quit();
    }
} 