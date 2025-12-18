// 📁 Main/Main/createMainWindow.js — create the main Electron window

import { BrowserWindow } from "electron";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { mainLogger } from "../loggerHub.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

mainLogger.ready("Main/Main/createMainWindow.js loaded");

/**
 * Creates the main application window
 * @param {boolean} isDev - Development mode flag
 * @returns {BrowserWindow} Main window object
 */
export function createMainWindow(isDev = false) {
  try {
    // Create new window
    const mainWindow = new BrowserWindow({
      width: 1280,
      height: 720,
      minWidth: 900,
      minHeight: 600,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        sandbox: true,
        preload: path.join(__dirname, '../../dist/preload.bundle.js')
      }
    });

    // Load main HTML file
    mainWindow.loadFile('index.html');

    // Use logger to log window creation (once)
    mainLogger.info('Main window created');

    // Open DevTools in development mode
    if (isDev) {
      mainWindow.webContents.openDevTools();
    }

    // IMPORTANT: Return created window
    return mainWindow;
  } catch (err) {
    mainLogger.error('Error creating window', err.message);
    // Return null even on error, not undefined
    return null;
  }
}
