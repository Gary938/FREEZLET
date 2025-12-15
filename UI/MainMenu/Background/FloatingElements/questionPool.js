// UI/MainMenu/Background/FloatingElements/questionPool.js
// Pool of floating questions and formulas

import { FloatingQuestion } from './floatingQuestion.js';
import { FLOATING_CONFIG } from '../Config/floatingConfig.js';
import { getRandomQuestions, getRandomFormulas } from '../Config/questionsData.js';
import { randomRange, randomVelocity, randomElement } from '../Utils/randomUtils.js';

/**
 * Creates and manages pool of floating elements
 */
export class QuestionPool {
  /**
   * @param {number} canvasWidth
   * @param {number} canvasHeight
   */
  constructor(canvasWidth, canvasHeight) {
    this.width = canvasWidth;
    this.height = canvasHeight;
    this.elements = [];
  }

  /**
   * Initializes pool with elements
   */
  initialize() {
    const { questionCount, formulaCount, spawnPadding } = FLOATING_CONFIG;

    // Get random questions and formulas
    const questions = getRandomQuestions(questionCount);
    const formulas = getRandomFormulas(formulaCount);

    // Create floating questions
    questions.forEach(text => {
      const element = this._createFloatingElement(text, false);
      this.elements.push(element);
    });

    // Create floating formulas
    formulas.forEach(text => {
      const element = this._createFloatingElement(text, true);
      this.elements.push(element);
    });
  }

  /**
   * Creates one floating element
   * @param {string} text
   * @param {boolean} isFormula
   * @returns {FloatingQuestion}
   */
  _createFloatingElement(text, isFormula) {
    const config = FLOATING_CONFIG;
    const { spawnPadding } = config;

    // Font size
    const fontSizeRange = isFormula ? config.formulaFontSize : config.questionFontSize;
    const fontSize = randomRange(fontSizeRange.min, fontSizeRange.max);

    // Position (with padding from edges)
    const x = randomRange(spawnPadding, this.width - spawnPadding - 200);
    const y = randomRange(spawnPadding + fontSize, this.height - spawnPadding);

    // Velocity
    const vx = randomVelocity(config.minSpeed, config.maxSpeed);
    const vy = randomVelocity(config.minSpeed, config.maxSpeed);

    // Color
    const colorPalette = isFormula ? config.colors.formulas : config.colors.questions;
    const color = randomElement(colorPalette);

    // Glow color
    const glowColor = randomElement(config.colors.glow);

    return new FloatingQuestion(text, {
      x,
      y,
      vx,
      vy,
      fontSize,
      color,
      opacity: config.baseOpacity,
      glowColor,
      isFormula
    });
  }

  /**
   * Updates all elements
   * @param {Object} bounds - bounds {width, height}
   * @param {Function} onCollision - callback on collision
   */
  update(bounds, onCollision) {
    this.elements.forEach(element => {
      element.update(bounds, onCollision);
    });
  }

  /**
   * Renders all elements
   * @param {CanvasRenderingContext2D} ctx
   */
  draw(ctx) {
    this.elements.forEach(element => {
      element.draw(ctx);
    });
  }

  /**
   * Updates area dimensions
   * @param {number} width
   * @param {number} height
   */
  resize(width, height) {
    this.width = width;
    this.height = height;

    // Adjust element positions so they don't go out of bounds
    this.elements.forEach(element => {
      if (element.x > width - element.width) {
        element.x = width - element.width - 10;
      }
      if (element.y > height) {
        element.y = height - 10;
      }
    });
  }

  /**
   * Clears pool
   */
  clear() {
    this.elements = [];
  }

  /**
   * Returns element count
   * @returns {number}
   */
  getCount() {
    return this.elements.length;
  }
}
