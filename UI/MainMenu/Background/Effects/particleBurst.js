// UI/MainMenu/Background/Effects/particleBurst.js
// Particle effect on wall collision

import { FLOATING_CONFIG } from '../Config/floatingConfig.js';
import { randomRange } from '../Utils/randomUtils.js';

/**
 * Particle manager for "explosion" effect on collision
 */
export class ParticleBurst {
  constructor() {
    this.particles = [];
    this.config = FLOATING_CONFIG.particles;
  }

  /**
   * Creates new particle burst at specified point
   * @param {number} x - X coordinate
   * @param {number} y - Y coordinate
   * @param {string} color - particle color
   */
  spawn(x, y, color) {
    const { count, minSpeed, maxSpeed, minSize, maxSize } = this.config;

    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 / count) * i + randomRange(-0.3, 0.3);
      const speed = randomRange(minSpeed, maxSpeed);

      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1.0,
        color,
        size: randomRange(minSize, maxSize)
      });
    }
  }

  /**
   * Updates state of all particles
   */
  update() {
    const { fadeSpeed } = this.config;

    this.particles = this.particles.filter(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.life -= fadeSpeed;

      // Deceleration
      p.vx *= 0.97;
      p.vy *= 0.97;

      return p.life > 0;
    });
  }

  /**
   * Renders all particles
   * @param {CanvasRenderingContext2D} ctx
   */
  draw(ctx) {
    ctx.save();

    this.particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.life * 0.8;
      ctx.fill();
    });

    ctx.restore();
  }

  /**
   * Clears all particles
   */
  clear() {
    this.particles = [];
  }

  /**
   * Checks if there are active particles
   * @returns {boolean}
   */
  hasParticles() {
    return this.particles.length > 0;
  }
}
