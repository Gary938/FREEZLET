// Main/BusinessLayer/FileSystem/backgroundService.js
// Service for working with background images

import fs from 'fs/promises';
import path from 'path';
import { mainLogger } from '../../loggerHub.js';
import { db } from '../../db.js';

// Constants
const TABLE = "backgroundState";

// Logger for module
const logger = {
  info: (message) => mainLogger.info('BusinessLayer:FileSystem:backgroundService', message),
  warn: (message) => mainLogger.warn('BusinessLayer:FileSystem:backgroundService', message),
  error: (message, data) => mainLogger.error('BusinessLayer:FileSystem:backgroundService', message, data),
  debug: (message) => mainLogger.debug('BusinessLayer:FileSystem:backgroundService', message),
  success: (message) => mainLogger.success('BusinessLayer:FileSystem:backgroundService', message)
};

/**
 * Service for working with background images
 */
export const backgroundService = {
  /**
   * Get current background state
   * @returns {Promise<Object>} Operation result with current background state {success: boolean, currentPath: string, mode: string, error?: string}
   */
  async getBackgroundState() {
    try {
      const row = db.prepare(`SELECT currentPath, mode FROM ${TABLE} WHERE id = 1`).get();
      
      // Check for null/undefined and replace with correct default values
      const mode = row?.mode || "random";
      let currentPath = row?.currentPath || "";
      
      // Ensure path doesn't contain undefined
      if (!currentPath || currentPath.includes('undefined')) {
        // Just use empty string instead of fallback path
        currentPath = "";
        logger.warn(`Invalid image path, using empty string`);
      }
      
      logger.debug(`Got background state: ${JSON.stringify({currentPath, mode})}`);
      
      return { 
        success: true, 
        currentPath, 
        mode 
      };
    } catch (error) {
      logger.error(`Error getting background state: ${error.message}`, error);
      return { 
        success: false, 
        currentPath: "", 
        mode: "random", 
        error: error.message 
      };
    }
  },

  /**
   * Save path to background image
   * @param {string} imagePath - Image path
   * @returns {Promise<Object>} Operation result {success: boolean, error?: string}
   */
  async saveBackgroundPath(imagePath) {
    try {
      db.prepare(`
        INSERT INTO ${TABLE} (id, currentPath)
        VALUES (1, ?)
        ON CONFLICT(id) DO UPDATE SET currentPath = excluded.currentPath
      `).run(imagePath);
      
      return { success: true };
    } catch (error) {
      logger.error(`Error saving background path: ${error.message}`, error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Get background display mode
   * @returns {Promise<Object>} Operation result {success: boolean, mode: string, error?: string}
   */
  async getBackgroundMode() {
    try {
      const row = db.prepare(`SELECT mode FROM ${TABLE} WHERE id = 1`).get();
      const mode = row?.mode || "random";
      
      return { success: true, mode };
    } catch (error) {
      logger.error(`Error getting background mode: ${error.message}`, error);
      return { success: false, mode: "random", error: error.message };
    }
  },

  /**
   * Save background display mode
   * @param {string} mode - Background display mode ("fixed", "random", "story")
   * @returns {Promise<Object>} Operation result {success: boolean, error?: string}
   */
  async saveBackgroundMode(mode) {
    try {
      // Get current path from DB
      const existing = db.prepare(`SELECT currentPath, mode FROM ${TABLE} WHERE id = 1`).get();
      let currentPath = existing?.currentPath || "";
      const oldMode = existing?.mode || "random";
      
      // Update image path according to mode
      logger.info(`Updating image path for mode: ${mode}`);
      
      try {
        if (mode === "random") {
          // For random mode find image in Random folder
          const randomFolder = path.join(process.cwd(), "UI", "LearnMode", "Assets", "Content", "Random");
          const folderExists = await fs.access(randomFolder).then(() => true).catch(() => false);
          
          if (folderExists) {
            const files = await fs.readdir(randomFolder);
            const images = files.filter(f => /\.(jpg|jpeg|png|webp|gif)$/i.test(f));
            
            if (images.length > 0) {
              const randomImage = images[Math.floor(Math.random() * images.length)];
              currentPath = `UI/LearnMode/Assets/Content/Random/${randomImage}`;
              logger.info(`Random background set: ${currentPath}`);
            } else {
              // If no images, use empty string
              currentPath = "";
              logger.warn(`No images found in Random folder, path cleared`);
            }
          } else {
            // If no folder, use empty string
            currentPath = "";
            logger.warn(`Random folder does not exist, path cleared`);
          }
        } else if (mode === "story") {
          // For story mode find image in Stories subfolders
          const storiesMainFolder = path.join(process.cwd(), "UI", "LearnMode", "Assets", "Content", "Stories");
          const folderExists = await fs.access(storiesMainFolder).then(() => true).catch(() => false);
          
          if (folderExists) {
            // Get list of subfolders in Stories
            const subfolders = await fs.readdir(storiesMainFolder);
            
            // Filter only directories and only with required name format
            const storyFolders = [];
            
            for (const subfolder of subfolders) {
              if (!/^Story\d+$/i.test(subfolder)) {
                continue; // Skip folders with unsuitable names
              }
              
              // Check that this is a directory, not a file
              const subfolderPath = path.join(storiesMainFolder, subfolder);
              try {
                const stats = await fs.stat(subfolderPath);
                if (stats.isDirectory()) {
                  const files = await fs.readdir(subfolderPath);
                  const images = files.filter(f => /\.(jpg|jpeg|png|webp|gif)$/i.test(f));
                  
                  if (images.length > 0) {
                    // Found subfolder with images
                    storyFolders.push({
                      folder: subfolder,
                      hasImages: true,
                      imageCount: images.length,
                      firstImage: images.find(img => /^1\.(jpg|jpeg|png|webp|gif)$/i.test(img)) || images[0]
                    });
                  }
                }
              } catch (err) {
                logger.warn(`Error checking subfolder ${subfolder}: ${err.message}`);
                continue;
              }
            }
            
            logger.info(`Found ${storyFolders.length} subfolders with stories`);
            
            if (storyFolders.length > 0) {
              // Select random folder from available
              const randomIndex = Math.floor(Math.random() * storyFolders.length);
              const selectedStory = storyFolders[randomIndex];
              
              currentPath = `UI/LearnMode/Assets/Content/Stories/${selectedStory.folder}/${selectedStory.firstImage}`;
              logger.info(`Story background set from random subfolder ${selectedStory.folder} (${randomIndex+1} of ${storyFolders.length}): ${currentPath}`);
            } else {
              // If no subfolder with images found, use empty string
              currentPath = "";
              logger.warn(`No subfolders with images found in Stories, path cleared`);
            }
          } else {
            // If no Stories folder, use empty string
            currentPath = "";
            logger.warn(`Stories folder does not exist, path cleared`);
          }
        } else if (mode === "fixed" && oldMode !== "fixed") {
          // If switching to fixed, save current path
          logger.info(`Fixed background mode: image path will remain: ${currentPath}`);
        }
      } catch (err) {
        logger.error(`Error updating image path: ${err.message}`);
        // Don't change current path on error if it exists
        if (!currentPath) {
          currentPath = ""; // If no current path, use empty string
        }
      }
      
      // Update mode and path in DB
      db.prepare(`
        INSERT INTO ${TABLE} (id, currentPath, mode)
        VALUES (1, ?, ?)
        ON CONFLICT(id) DO UPDATE SET mode = excluded.mode, currentPath = excluded.currentPath
      `).run(currentPath, mode);
      
      return { success: true };
    } catch (error) {
      logger.error(`Error saving background mode: ${error.message}`, error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Get random background image from folder
   * @param {string} [folderPath] - Path to images folder (optional)
   * @returns {Promise<Object>} Operation result {success: boolean, path: string|null, error?: string}
   */
  async getRandomBackground(folderPath) {
    try {
      const defaultPath = path.join(process.cwd(), "UI", "TestRunner", "Assets", "Content", "WEBp");
      const targetPath = (typeof folderPath === "string" && folderPath.trim()) ? folderPath : defaultPath;
      
      const files = await fs.readdir(targetPath);
      const images = files.filter((f) => f.match(/\.(jpg|jpeg|png|webp)$/i));
      
      if (images.length === 0) {
        logger.warn(`No images found in folder ${targetPath}`);
        return { success: false, path: null, error: 'Images not found' };
      }
      
      const index = Math.floor(Math.random() * images.length);
      const fileName = images[index];
      const imagePath = `UI/TestRunner/Assets/Content/WEBp/${fileName}`;
      
      return { success: true, path: imagePath };
    } catch (error) {
      logger.error(`Error getting random background: ${error.message}`, error);
      return { success: false, path: null, error: error.message };
    }
  }
};

// Export individual functions for convenience
export const { 
  getBackgroundState, 
  saveBackgroundPath, 
  getBackgroundMode, 
  saveBackgroundMode, 
  getRandomBackground 
} = backgroundService; 