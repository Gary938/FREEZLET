// Main/mainHub.js (main process central hub)

import { app, BrowserWindow } from "electron";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";
import { dirname } from "path";
import fs from "fs/promises";
import fsSync from "fs";
import { mainLogger } from './loggerHub.js';
import { clearLogFiles } from './Logger/utils.js';
import { ipcLogger, hijackIPCLogging, initLearnModeLogging, setupExceptionHandling } from "./loggerHub.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const isDev = !app.isPackaged;

// Полное отключение Vulkan и WebGPU (Dawn на Linux использует Vulkan как backend)
app.commandLine.appendSwitch('disable-vulkan');
app.commandLine.appendSwitch('disable-features', 'Vulkan,VulkanFromANGLE,DefaultANGLEVulkan,WebGPU');

// Initialize logger with settings - use local paths
const projectRoot = path.resolve(__dirname, '../');
mainLogger.init({
  logDirectory: path.join(projectRoot, 'logs'),
  legacyLogFile: path.join(projectRoot, 'debug.log'),
  aiLogFile: path.join(projectRoot, 'ai_debug.jsonl'),
  minLogLevel: process.env.NODE_ENV === 'production' ? 'info' : 'trace',
  captureIPC: true,
  appVersion: app.getVersion()
});

// 🛡️ Enable global IPC handler logging through new system
hijackIPCLogging();

// 🛡️ Set up unhandled exception interception
setupExceptionHandling(mainLogger);

// Initialize learn mode log monitoring
initLearnModeLogging();

// Clear log files on startup
const legacyLogPath = path.join(projectRoot, 'debug.log');
const aiLogPath = path.join(projectRoot, 'ai_debug.jsonl');
clearLogFiles(legacyLogPath, aiLogPath);
mainLogger.info('System', 'Log files cleared on startup');

// Log startup information
mainLogger.info('Main', 'Application starting...');

// Register main directories for logging
mainLogger.directory("Main");
mainLogger.directory("IPC");
mainLogger.directory("UI");
mainLogger.directory("FileManager");
mainLogger.directory("renderer");

mainLogger.ready("Main/mainHub.js started");

// 🔄 Import IPC module with controllers directly
mainLogger.info('Handler', 'Registering IPC handlers');
import { setupControllersIPC } from './Controllers/controllersRegistrar.js';
setupControllersIPC();
mainLogger.success('Handler', 'IPC handlers registered successfully');

// Import all necessary functions from Main module
import {
    setupLogInterception,
    initializeApp,
    registerLogHandlers
} from "./Main/index.js";

// Register logging handlers
registerLogHandlers();

// Set up log interception
setupLogInterception();

// Start initialization when app is ready
app.whenReady().then(() => initializeApp(isDev));
