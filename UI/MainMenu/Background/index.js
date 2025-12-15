// UI/MainMenu/Background/index.js
// Main module for main menu background with floating questions

import { CanvasManager } from './Core/canvasManager.js';
import { AnimationLoop } from './Core/animationLoop.js';
import { BackgroundLoader } from './Core/backgroundLoader.js';
import { QuestionPool } from './FloatingElements/questionPool.js';
import { ParticleBurst } from './Effects/particleBurst.js';

/**
 * Main class for main menu background
 */
export class MainMenuBackground {
  constructor() {
    this.canvasManager = null;
    this.animationLoop = null;
    this.backgroundLoader = null;
    this.questionPool = null;
    this.particleBurst = null;
    this.isInitialized = false;
    this.isPaused = false;
  }

  /**
   * Initializes all background components
   * @returns {Promise<boolean>}
   */
  async initialize() {
    if (this.isInitialized) {
      console.warn('[MainMenuBackground] Already initialized');
      return true;
    }

    try {
      // 1. Initialize background loader
      this.backgroundLoader = new BackgroundLoader();
      this.backgroundLoader.initialize();

      // 2. Load random background
      await this.backgroundLoader.loadRandomBackground();

      // 3. Initialize canvas
      this.canvasManager = new CanvasManager();
      const canvasInitialized = this.canvasManager.initialize();
      if (!canvasInitialized) {
        throw new Error('Failed to initialize canvas');
      }

      // 4. Get dimensions
      const { width, height } = this.canvasManager.getSize();

      // 5. Create floating elements pool
      this.questionPool = new QuestionPool(width, height);
      this.questionPool.initialize();

      // 6. Create particle manager
      this.particleBurst = new ParticleBurst();

      // 7. Set up resize handler
      this.canvasManager.setResizeCallback((newWidth, newHeight) => {
        this.questionPool.resize(newWidth, newHeight);
      });

      // 8. Initialize animation loop
      this.animationLoop = new AnimationLoop();
      this.animationLoop.setUpdateCallback(this._update.bind(this));
      this.animationLoop.setRenderCallback(this._render.bind(this));

      this.isInitialized = true;
      // Initialization logs are output to CMD via Main process

      return true;
    } catch (error) {
      console.error('[MainMenuBackground] Initialization failed:', error);
      this.destroy();
      return false;
    }
  }

  /**
   * Starts animation
   */
  start() {
    if (!this.isInitialized) {
      console.warn('[MainMenuBackground] Not initialized');
      return;
    }

    this.isPaused = false;
    this.animationLoop.start();
  }

  /**
   * Stops animation
   */
  stop() {
    if (this.animationLoop) {
      this.animationLoop.stop();
    }
    this.isPaused = true;
  }

  /**
   * Pauses animation
   */
  pause() {
    this.stop();
  }

  /**
   * Resumes animation
   */
  resume() {
    this.start();
  }

  /**
   * Logic update (called every frame)
   * @param {number} deltaTime
   */
  _update(deltaTime) {
    if (this.isPaused) return;

    const bounds = this.canvasManager.getBounds();

    // Update floating elements
    this.questionPool.update(bounds, (x, y, color) => {
      // Collision callback - create particles
      this.particleBurst.spawn(x, y, color);
    });

    // Update particles
    this.particleBurst.update();
  }

  /**
   * Rendering (called every frame)
   */
  _render() {
    if (this.isPaused) return;

    const ctx = this.canvasManager.getContext();

    // Clear canvas
    this.canvasManager.clear();

    // Draw particles (under text)
    this.particleBurst.draw(ctx);

    // Draw floating elements
    this.questionPool.draw(ctx);
  }

  /**
   * Hides background (for transition to Learn Mode)
   */
  hide() {
    this.stop();

    if (this.backgroundLoader) {
      this.backgroundLoader.hide();
    }

    if (this.canvasManager && this.canvasManager.canvas) {
      this.canvasManager.canvas.style.opacity = '0';
    }
  }

  /**
   * Shows background (when returning from Learn Mode)
   */
  show() {
    if (this.backgroundLoader) {
      this.backgroundLoader.show();
    }

    if (this.canvasManager && this.canvasManager.canvas) {
      this.canvasManager.canvas.style.opacity = '1';
    }

    this.start();
  }

  /**
   * Checks if background is initialized
   * @returns {boolean}
   */
  isReady() {
    return this.isInitialized;
  }

  /**
   * Checks if animation is running
   * @returns {boolean}
   */
  isRunning() {
    return this.animationLoop ? this.animationLoop.isActive() : false;
  }

  /**
   * Returns current FPS
   * @returns {number}
   */
  getFPS() {
    return this.animationLoop ? this.animationLoop.getFPS() : 0;
  }

  /**
   * Completely destroys background and releases resources
   */
  destroy() {
    // Stop animation
    if (this.animationLoop) {
      this.animationLoop.stop();
      this.animationLoop = null;
    }

    // Clear particles
    if (this.particleBurst) {
      this.particleBurst.clear();
      this.particleBurst = null;
    }

    // Clear questions pool
    if (this.questionPool) {
      this.questionPool.clear();
      this.questionPool = null;
    }

    // Destroy canvas
    if (this.canvasManager) {
      this.canvasManager.destroy();
      this.canvasManager = null;
    }

    // Destroy background
    if (this.backgroundLoader) {
      this.backgroundLoader.destroy();
      this.backgroundLoader = null;
    }

    this.isInitialized = false;
  }
}

// Singleton instance
let mainMenuBackgroundInstance = null;

/**
 * Gets or creates MainMenuBackground instance
 * @returns {MainMenuBackground}
 */
export function getMainMenuBackground() {
  if (!mainMenuBackgroundInstance) {
    mainMenuBackgroundInstance = new MainMenuBackground();
  }
  return mainMenuBackgroundInstance;
}

/**
 * Initializes and starts main menu background
 * @returns {Promise<MainMenuBackground>}
 */
export async function initializeMainMenuBackground() {
  const background = getMainMenuBackground();

  if (!background.isReady()) {
    const success = await background.initialize();
    if (success) {
      background.start();
    }
  }

  return background;
}

/**
 * Destroys background instance
 */
export function destroyMainMenuBackground() {
  if (mainMenuBackgroundInstance) {
    mainMenuBackgroundInstance.destroy();
    mainMenuBackgroundInstance = null;
  }
}
