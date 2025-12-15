// UI/MainMenu/Background/Core/backgroundLoader.js
// Loading and managing background image

import {
  getRandomBackground,
  getRandomFallbackGradient,
  getAllBackgrounds,
  getFallbackGradientByIndex,
  getUITextColorByIndex,
  getRandomBackgroundIndex
} from '../Config/backgroundsData.js';

/**
 * Background image loader
 */
export class BackgroundLoader {
  constructor() {
    this.backgroundLayer = null;
    this.currentImage = null;
    this.isLoaded = false;
    this.currentIndex = -1;
  }

  /**
   * Initializes background layer
   * @returns {boolean}
   */
  initialize() {
    // Create div for background
    this.backgroundLayer = document.createElement('div');
    this.backgroundLayer.id = 'mainMenuBackgroundLayer';
    this.backgroundLayer.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 0;
      background-size: cover;
      background-position: center;
      background-repeat: no-repeat;
      transition: opacity 0.5s ease;
    `;

    // Insert as first element in body
    document.body.insertBefore(this.backgroundLayer, document.body.firstChild);

    return true;
  }

  /**
   * Loads random background (tries image first, then fallback)
   * @param {boolean} useFallbackOnly - use only CSS gradients
   * @returns {Promise<boolean>}
   */
  async loadRandomBackground(useFallbackOnly = true) {
    // Generate random background index (0-9)
    this.currentIndex = getRandomBackgroundIndex();

    // If no images - use CSS gradient immediately (no console errors)
    if (useFallbackOnly) {
      this._applyFallbackGradient(this.currentIndex);
      this._applyUITextColor(this.currentIndex);
      this.isLoaded = true;
      return true;
    }

    const imagePath = getRandomBackground();
    const allBackgrounds = getAllBackgrounds();
    const imageIndex = allBackgrounds.indexOf(imagePath);
    this.currentIndex = imageIndex;

    try {
      const loaded = await this._preloadImage(imagePath);

      if (loaded) {
        this._applyImage(imagePath);
        this._applyUITextColor(this.currentIndex);
        this.isLoaded = true;
        return true;
      } else {
        // Use fallback gradient
        this._applyFallbackGradient(this.currentIndex);
        this._applyUITextColor(this.currentIndex);
        this.isLoaded = true;
        return true;
      }
    } catch (error) {
      this._applyFallbackGradient(this.currentIndex);
      this._applyUITextColor(this.currentIndex);
      this.isLoaded = true;
      return true;
    }
  }

  /**
   * Preloads image
   * @param {string} path
   * @returns {Promise<boolean>}
   */
  _preloadImage(path) {
    return new Promise((resolve) => {
      const img = new Image();

      const timeout = setTimeout(() => {
        resolve(false);
      }, 5000); // 5 seconds timeout

      img.onload = () => {
        clearTimeout(timeout);
        this.currentImage = img;
        resolve(true);
      };

      img.onerror = () => {
        clearTimeout(timeout);
        resolve(false);
      };

      img.src = path;
    });
  }

  /**
   * Applies image to background
   * @param {string} path
   */
  _applyImage(path) {
    if (!this.backgroundLayer) return;

    this.backgroundLayer.style.backgroundImage = `url("${path}")`;
    this.backgroundLayer.style.backgroundColor = '#0a0a1a';
  }

  /**
   * Applies fallback gradient
   * @param {number} index
   */
  _applyFallbackGradient(index = -1) {
    if (!this.backgroundLayer) return;

    const gradient = index >= 0
      ? getFallbackGradientByIndex(index)
      : getRandomFallbackGradient();

    this.backgroundLayer.style.backgroundImage = gradient;
    this.backgroundLayer.style.backgroundColor = '#0a0a1a';
  }

  /**
   * Applies UI text color depending on background
   * @param {number} index
   */
  _applyUITextColor(index) {
    const textColor = getUITextColorByIndex(index);
    document.documentElement.style.setProperty('--ui-text-color', textColor);
  }

  /**
   * Sets background opacity
   * @param {number} opacity - value from 0 to 1
   */
  setOpacity(opacity) {
    if (this.backgroundLayer) {
      this.backgroundLayer.style.opacity = opacity.toString();
    }
  }

  /**
   * Shows background
   */
  show() {
    this.setOpacity(1);
  }

  /**
   * Hides background
   */
  hide() {
    this.setOpacity(0);
  }

  /**
   * Checks if background is loaded
   * @returns {boolean}
   */
  isBackgroundLoaded() {
    return this.isLoaded;
  }

  /**
   * Destroys background layer
   */
  destroy() {
    if (this.backgroundLayer && this.backgroundLayer.parentNode) {
      this.backgroundLayer.parentNode.removeChild(this.backgroundLayer);
    }

    this.backgroundLayer = null;
    this.currentImage = null;
    this.isLoaded = false;
  }
}
