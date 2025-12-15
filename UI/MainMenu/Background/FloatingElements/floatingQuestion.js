// UI/MainMenu/Background/FloatingElements/floatingQuestion.js
// Floating question/formula class with effects

import { FLOATING_CONFIG } from '../Config/floatingConfig.js';
import { clamp } from '../Utils/mathUtils.js';

/**
 * Floating text element (question or formula)
 */
export class FloatingQuestion {
  /**
   * @param {string} text - question/formula text
   * @param {Object} config - configuration
   * @param {number} config.x - initial X coordinate
   * @param {number} config.y - initial Y coordinate
   * @param {number} config.vx - velocity along X
   * @param {number} config.vy - velocity along Y
   * @param {number} config.fontSize - font size
   * @param {string} config.color - text color
   * @param {number} config.opacity - opacity
   * @param {string} config.glowColor - glow color
   * @param {boolean} config.isFormula - is formula (different style)
   */
  constructor(text, config) {
    this.text = text;
    this.x = config.x;
    this.y = config.y;
    this.vx = config.vx;
    this.vy = config.vy;
    this.fontSize = config.fontSize;
    this.color = config.color;
    this.opacity = config.opacity || FLOATING_CONFIG.baseOpacity;
    this.isFormula = config.isFormula || false;

    // Dimensions (calculated on first render)
    this.width = 0;
    this.height = this.fontSize;

    // Glow effect
    this.glowIntensity = 0;
    this.glowColor = config.glowColor || '#00ffff';
    this.glowConfig = FLOATING_CONFIG.glow;
  }

  /**
   * Updates position and state
   * @param {Object} bounds - area bounds {width, height}
   * @param {Function} onCollision - callback on collision (x, y, color)
   */
  update(bounds, onCollision) {
    // Movement
    this.x += this.vx;
    this.y += this.vy;

    // Glow decay
    if (this.glowIntensity > 0) {
      this.glowIntensity -= this.glowConfig.fadeSpeed;
      this.glowIntensity = Math.max(0, this.glowIntensity);
    }

    // Check collisions with boundaries
    let collided = false;
    let collisionX = this.x;
    let collisionY = this.y;

    // Left/right boundary
    if (this.x <= 0) {
      this.x = 0;
      this.vx *= -1;
      collided = true;
      collisionX = 0;
    } else if (this.x >= bounds.width - this.width) {
      this.x = bounds.width - this.width;
      this.vx *= -1;
      collided = true;
      collisionX = bounds.width;
    }

    // Top/bottom boundary
    if (this.y <= this.height) {
      this.y = this.height;
      this.vy *= -1;
      collided = true;
      collisionY = 0;
    } else if (this.y >= bounds.height) {
      this.y = bounds.height;
      this.vy *= -1;
      collided = true;
      collisionY = bounds.height;
    }

    // Effect on collision
    if (collided) {
      this.glowIntensity = this.glowConfig.maxIntensity;
      if (onCollision) {
        onCollision(collisionX, collisionY, this.glowColor);
      }
    }
  }

  /**
   * Renders element on canvas
   * @param {CanvasRenderingContext2D} ctx
   */
  draw(ctx) {
    ctx.save();

    // Font
    const fontWeight = this.isFormula ? 'bold' : 'normal';
    ctx.font = `${fontWeight} ${this.fontSize}px ${FLOATING_CONFIG.fontFamily}`;

    // Measure text width
    const metrics = ctx.measureText(this.text);
    this.width = metrics.width;

    // Glow on collision
    if (this.glowIntensity > 0) {
      ctx.shadowColor = this.glowColor;
      ctx.shadowBlur = this.glowConfig.blurRadius * this.glowIntensity;
    }

    // Opacity
    ctx.globalAlpha = this.opacity;

    // Draw text
    ctx.fillStyle = this.color;
    ctx.fillText(this.text, this.x, this.y);

    ctx.restore();
  }

  /**
   * Checks if element is glowing
   * @returns {boolean}
   */
  isGlowing() {
    return this.glowIntensity > 0;
  }

  /**
   * Sets new position
   * @param {number} x
   * @param {number} y
   */
  setPosition(x, y) {
    this.x = x;
    this.y = y;
  }

  /**
   * Sets velocity
   * @param {number} vx
   * @param {number} vy
   */
  setVelocity(vx, vy) {
    this.vx = vx;
    this.vy = vy;
  }
}
