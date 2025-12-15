// UI/MainMenu/Background/Utils/mathUtils.js
// Math utilities for physics and geometry

/**
 * Clamps value within range
 * @param {number} value
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
export function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

/**
 * Linear interpolation
 * @param {number} a - start value
 * @param {number} b - end value
 * @param {number} t - coefficient (0-1)
 * @returns {number}
 */
export function lerp(a, b, t) {
  return a + (b - a) * t;
}

/**
 * Calculates distance between two points
 * @param {number} x1
 * @param {number} y1
 * @param {number} x2
 * @param {number} y2
 * @returns {number}
 */
export function distance(x1, y1, x2, y2) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Normalizes vector
 * @param {number} x
 * @param {number} y
 * @returns {{x: number, y: number}}
 */
export function normalize(x, y) {
  const len = Math.sqrt(x * x + y * y);
  if (len === 0) return { x: 0, y: 0 };
  return { x: x / len, y: y / len };
}

/**
 * Converts degrees to radians
 * @param {number} degrees
 * @returns {number}
 */
export function degToRad(degrees) {
  return degrees * (Math.PI / 180);
}

/**
 * Smooth decay (ease out)
 * @param {number} t - time (0-1)
 * @returns {number}
 */
export function easeOut(t) {
  return 1 - Math.pow(1 - t, 3);
}

/**
 * Smooth acceleration (ease in)
 * @param {number} t - time (0-1)
 * @returns {number}
 */
export function easeIn(t) {
  return t * t * t;
}
