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
import { getLogsPath } from './Utils/appPaths.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const isDev = !app.isPackaged;

// Полное отключение Vulkan и WebGPU (Dawn на Linux использует Vulkan как backend)
app.commandLine.appendSwitch('disable-vulkan');
app.commandLine.appendSwitch('disable-features', 'Vulkan,VulkanFromANGLE,DefaultANGLEVulkan,WebGPU');

// Get log paths - use userData in production, project root in dev
const projectRoot = path.resolve(__dirname, '../');
const logsDir = isDev ? path.join(projectRoot, 'logs') : getLogsPath();
const legacyLogPath = isDev ? path.join(projectRoot, 'debug.log') : null;
const aiLogPath = isDev ? path.join(projectRoot, 'ai_debug.jsonl') : null;

// Initialize logger with correct paths
mainLogger.init({
  logDirectory: logsDir,
  legacyLogFile: legacyLogPath,
  aiLogFile: aiLogPath,
  useLegacyLogFile: isDev,
  useAiLogFile: isDev,
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

// Clear ALL log files on startup (including logs/ directory)
const clearAllLogs = () => {
  try {
    // Clear legacy logs in dev mode
    if (isDev && legacyLogPath) {
      clearLogFiles(legacyLogPath, aiLogPath);
    }

    // Clear logs in logs/ directory
    if (fsSync.existsSync(logsDir)) {
      const logFiles = fsSync.readdirSync(logsDir);
      for (const file of logFiles) {
        if (file.endsWith('.log')) {
          const filePath = path.join(logsDir, file);
          fsSync.writeFileSync(filePath, '', 'utf8');
        }
      }
    }
    return true;
  } catch (error) {
    console.error('Error clearing log files:', error);
    return false;
  }
};

clearAllLogs();
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
