// UI/MainMenu/Background/Core/animationLoop.js
// Animation loop on requestAnimationFrame

/**
 * Animation loop manager
 */
export class AnimationLoop {
  constructor() {
    this.isRunning = false;
    this.animationFrameId = null;
    this.lastTime = 0;
    this.updateCallback = null;
    this.renderCallback = null;
    this.fps = 0;
    this.frameCount = 0;
    this.fpsUpdateTime = 0;
  }

  /**
   * Sets callback for logic update
   * @param {Function} callback - function (deltaTime) => void
   */
  setUpdateCallback(callback) {
    this.updateCallback = callback;
  }

  /**
   * Sets callback for rendering
   * @param {Function} callback - function () => void
   */
  setRenderCallback(callback) {
    this.renderCallback = callback;
  }

  /**
   * Starts animation loop
   */
  start() {
    if (this.isRunning) return;

    this.isRunning = true;
    this.lastTime = performance.now();
    this.fpsUpdateTime = this.lastTime;
    this.frameCount = 0;

    this._loop();
  }

  /**
   * Stops animation loop
   */
  stop() {
    this.isRunning = false;

    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  /**
   * Main loop
   */
  _loop() {
    if (!this.isRunning) return;

    const currentTime = performance.now();
    const deltaTime = (currentTime - this.lastTime) / 1000; // in seconds
    this.lastTime = currentTime;

    // FPS counting
    this.frameCount++;
    if (currentTime - this.fpsUpdateTime >= 1000) {
      this.fps = this.frameCount;
      this.frameCount = 0;
      this.fpsUpdateTime = currentTime;
    }

    // Update
    if (this.updateCallback) {
      this.updateCallback(deltaTime);
    }

    // Render
    if (this.renderCallback) {
      this.renderCallback();
    }

    // Next frame
    this.animationFrameId = requestAnimationFrame(() => this._loop());
  }

  /**
   * Returns current FPS
   * @returns {number}
   */
  getFPS() {
    return this.fps;
  }

  /**
   * Checks if loop is running
   * @returns {boolean}
   */
  isActive() {
    return this.isRunning;
  }

  /**
   * Pauses loop
   */
  pause() {
    this.stop();
  }

  /**
   * Resumes loop
   */
  resume() {
    this.start();
  }
}
