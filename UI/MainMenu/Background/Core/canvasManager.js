// UI/MainMenu/Background/Core/canvasManager.js
// Canvas element management

/**
 * Canvas manager for floating elements
 */
export class CanvasManager {
  constructor() {
    this.canvas = null;
    this.ctx = null;
    this.width = 0;
    this.height = 0;
    this.resizeHandler = null;
  }

  /**
   * Initializes canvas
   * @param {string} containerId - Container ID for canvas (optional)
   * @returns {boolean}
   */
  initialize(containerId = null) {
    // Create canvas element
    this.canvas = document.createElement('canvas');
    this.canvas.id = 'floatingQuestionsCanvas';
    this.canvas.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 1;
      pointer-events: none;
    `;

    // Insert into DOM
    const container = containerId ? document.getElementById(containerId) : document.body;
    if (!container) {
      console.error('[CanvasManager] Container not found');
      return false;
    }

    // Insert as first element
    container.insertBefore(this.canvas, container.firstChild);

    // Get context
    this.ctx = this.canvas.getContext('2d');
    if (!this.ctx) {
      console.error('[CanvasManager] Failed to get 2D context');
      return false;
    }

    // Set dimensions
    this._updateSize();

    // Listen for window resize
    this.resizeHandler = this._onResize.bind(this);
    window.addEventListener('resize', this.resizeHandler);

    return true;
  }

  /**
   * Updates canvas dimensions
   */
  _updateSize() {
    const dpr = window.devicePixelRatio || 1;
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    // Set dimensions considering DPR for clarity
    this.canvas.width = this.width * dpr;
    this.canvas.height = this.height * dpr;

    // Scale context
    this.ctx.scale(dpr, dpr);
  }

  /**
   * Window resize handler
   */
  _onResize() {
    this._updateSize();
    if (this.onResize) {
      this.onResize(this.width, this.height);
    }
  }

  /**
   * Sets callback for resize event
   * @param {Function} callback
   */
  setResizeCallback(callback) {
    this.onResize = callback;
  }

  /**
   * Clears canvas
   */
  clear() {
    this.ctx.clearRect(0, 0, this.width, this.height);
  }

  /**
   * Returns drawing context
   * @returns {CanvasRenderingContext2D}
   */
  getContext() {
    return this.ctx;
  }

  /**
   * Returns dimensions
   * @returns {{width: number, height: number}}
   */
  getSize() {
    return { width: this.width, height: this.height };
  }

  /**
   * Returns bounds for physics
   * @returns {{width: number, height: number}}
   */
  getBounds() {
    return { width: this.width, height: this.height };
  }

  /**
   * Destroys canvas
   */
  destroy() {
    if (this.resizeHandler) {
      window.removeEventListener('resize', this.resizeHandler);
      this.resizeHandler = null;
    }

    if (this.canvas && this.canvas.parentNode) {
      this.canvas.parentNode.removeChild(this.canvas);
    }

    this.canvas = null;
    this.ctx = null;
  }
}
