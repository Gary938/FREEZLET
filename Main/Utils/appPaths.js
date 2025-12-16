// Main/Utils/appPaths.js — Application paths utility for dev/production
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { app } from "electron";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Get base path for user data (writable: Tests, Progress, MyBackground)
 * In dev: project root
 * In production: app.getPath('userData') → ~/.config/freezlet/
 */
export const getBasePath = () => {
  if (app.isPackaged) {
    return app.getPath('userData');
  } else {
    // Dev: go up from Main/Utils to project root
    return path.join(__dirname, "../..");
  }
};

/**
 * Get path to initial/bundled resources (read-only in production)
 * Used for copying initial Tests to userData on first launch
 */
export const getResourcesPath = () => {
  if (app.isPackaged) {
    return process.resourcesPath;
  } else {
    return path.join(__dirname, "../..");
  }
};

/**
 * Get base path for app code and bundled assets (UI, CSS, etc.)
 * In dev: project root
 * In production: app.asar path
 */
export const getAppBasePath = () => {
  if (app.isPackaged) {
    return app.getAppPath();
  } else {
    return path.join(__dirname, "../..");
  }
};

/**
 * Get path to Tests directory
 */
export const getTestsPath = () => {
  return path.join(getBasePath(), "Tests");
};

/**
 * Get path to Progress directory (database)
 */
export const getProgressPath = () => {
  return path.join(getBasePath(), "Progress");
};

/**
 * Get path to database file
 */
export const getDbPath = () => {
  return path.join(getProgressPath(), "structure.db");
};

/**
 * Get path to MyBackground directory (user backgrounds)
 */
export const getMyBackgroundPath = () => {
  return path.join(getBasePath(), "MyBackground");
};

/**
 * Get path to UI Assets Content (bundled backgrounds)
 */
export const getUIAssetsContentPath = () => {
  return path.join(getAppBasePath(), "UI", "LearnMode", "Assets", "Content");
};

/**
 * Get path to logs directory
 */
export const getLogsPath = () => {
  return path.join(getBasePath(), "logs");
};

/**
 * Get path to initial/bundled Tests (for first-launch copy)
 */
export const getInitialTestsPath = () => {
  if (app.isPackaged) {
    return path.join(process.resourcesPath, "Tests");
  }
  return null;
};

/**
 * Get path to initial/bundled MyBackground (for first-launch copy)
 */
export const getInitialMyBackgroundPath = () => {
  if (app.isPackaged) {
    return path.join(process.resourcesPath, "MyBackground");
  }
  return null;
};

/**
 * Get path to initial/bundled Progress (for first-launch copy)
 */
export const getInitialProgressPath = () => {
  if (app.isPackaged) {
    return path.join(process.resourcesPath, "Progress");
  }
  return null;
};

export default {
  getBasePath,
  getResourcesPath,
  getAppBasePath,
  getTestsPath,
  getProgressPath,
  getDbPath,
  getMyBackgroundPath,
  getUIAssetsContentPath,
  getLogsPath,
  getInitialTestsPath,
  getInitialMyBackgroundPath,
  getInitialProgressPath
};
