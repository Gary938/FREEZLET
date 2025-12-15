// 📁 Main/Main/index.js — module entry point for Main process

import { mainLogger } from "../loggerHub.js";

// Export all components from submodules
export { createMainWindow } from "./createMainWindow.js";
export { setupAppLifecycle } from "./lifecycle.js";
export { setupLogInterception, initializeApp } from "./core.js";
export { registerLogHandlers } from "./logHandlers.js";

mainLogger.ready("Main/Main/index.js loaded"); 