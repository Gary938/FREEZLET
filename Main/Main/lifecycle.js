// 📁 Main/Main/lifecycle.js — app lifecycle handling

import { app, BrowserWindow } from "electron";
import { createMainWindow } from "./createMainWindow.js";
import { mainLogger } from "../loggerHub.js";
import { stopCleanupInterval, clearAllSessions } from "../BusinessLayer/LearnMode/Core/State/stateStore.js";

mainLogger.ready("Main/Main/lifecycle.js loaded");

export function setupAppLifecycle(isDev) {
    // Removed main window creation to avoid duplication
    // Window is now created only in main.js

    // Handle app activation (for macOS)
    app.on("activate", () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createMainWindow(isDev);
        }
    });

    // Close app when all windows closed (except macOS)
    app.on("window-all-closed", () => {
        // Cleanup LearnMode sessions before quit
        stopCleanupInterval();
        clearAllSessions();

        if (process.platform !== "darwin") {
            app.quit();
        }
    });
}
