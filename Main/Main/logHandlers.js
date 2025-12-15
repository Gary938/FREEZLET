// 📁 Main/Main/logHandlers.js — IPC handlers for logging

import { ipcMain } from "electron";
import { mainLogger } from "../loggerHub.js";

mainLogger.ready("Main/Main/logHandlers.js loaded");

/**
 * Registers all IPC handlers related to logging
 */
export function registerLogHandlers() {
    // 📝 Handler for renderer logs through logging system
    ipcMain.on("log-message", (_, { level, namespace, message, data }) => {
        if (mainLogger[level]) {
            mainLogger[level](namespace, message, data);
        } else {
            mainLogger.info(namespace, message, data);
        }
    });

    mainLogger.info("LogHandlers", "Logging handlers registered");
} 