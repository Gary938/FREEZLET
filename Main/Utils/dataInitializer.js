// Main/Utils/dataInitializer.js — Initialize user data on first launch
import fs from 'fs';
import { app } from 'electron';
import {
  getTestsPath,
  getMyBackgroundPath,
  getProgressPath,
  getInitialTestsPath,
  getInitialMyBackgroundPath,
  getInitialProgressPath
} from './appPaths.js';

/**
 * Initialize user data on first launch (copy from resources to userData)
 * Called before database initialization
 */
export function initializeUserData() {
  // In dev mode, data is already in place
  if (!app.isPackaged) {
    return;
  }

  console.log('[dataInitializer] Checking user data initialization...');

  // Copy Tests from resources to userData if not exists
  const testsPath = getTestsPath();
  const initialTestsPath = getInitialTestsPath();

  if (!fs.existsSync(testsPath) && initialTestsPath && fs.existsSync(initialTestsPath)) {
    try {
      fs.cpSync(initialTestsPath, testsPath, { recursive: true });
      console.log(`[dataInitializer] Copied initial Tests to ${testsPath}`);
    } catch (error) {
      console.error(`[dataInitializer] Failed to copy Tests: ${error.message}`);
    }
  }

  // Copy MyBackground from resources to userData if not exists
  const myBgPath = getMyBackgroundPath();
  const initialMyBgPath = getInitialMyBackgroundPath();

  if (!fs.existsSync(myBgPath) && initialMyBgPath && fs.existsSync(initialMyBgPath)) {
    try {
      fs.cpSync(initialMyBgPath, myBgPath, { recursive: true });
      console.log(`[dataInitializer] Copied initial MyBackground to ${myBgPath}`);
    } catch (error) {
      console.error(`[dataInitializer] Failed to copy MyBackground: ${error.message}`);
    }
  } else if (!fs.existsSync(myBgPath)) {
    // Create empty MyBackground folder if no initial data
    try {
      fs.mkdirSync(myBgPath, { recursive: true });
      console.log(`[dataInitializer] Created empty MyBackground at ${myBgPath}`);
    } catch (error) {
      console.error(`[dataInitializer] Failed to create MyBackground: ${error.message}`);
    }
  }

  // Copy Progress (with initial DB) from resources to userData if not exists
  const progressPath = getProgressPath();
  const initialProgressPath = getInitialProgressPath();

  if (!fs.existsSync(progressPath) && initialProgressPath && fs.existsSync(initialProgressPath)) {
    try {
      fs.cpSync(initialProgressPath, progressPath, { recursive: true });
      console.log(`[dataInitializer] Copied initial Progress to ${progressPath}`);
    } catch (error) {
      console.error(`[dataInitializer] Failed to copy Progress: ${error.message}`);
    }
  } else if (!fs.existsSync(progressPath)) {
    // Create empty Progress folder if no initial data (db.js will create DB)
    try {
      fs.mkdirSync(progressPath, { recursive: true });
      console.log(`[dataInitializer] Created empty Progress directory at ${progressPath}`);
    } catch (error) {
      console.error(`[dataInitializer] Failed to create Progress: ${error.message}`);
    }
  }

  console.log('[dataInitializer] User data initialization complete');
}

export default { initializeUserData };
