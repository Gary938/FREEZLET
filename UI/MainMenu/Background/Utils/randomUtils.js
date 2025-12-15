// UI/MainMenu/Background/Utils/randomUtils.js
// Utilities for working with random values

/**
 * Random number in range [min, max]
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
export function randomRange(min, max) {
  return min + Math.random() * (max - min);
}

/**
 * Random integer in range [min, max]
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
export function randomInt(min, max) {
  return Math.floor(randomRange(min, max + 1));
}

/**
 * Random element from array
 * @template T
 * @param {T[]} array
 * @returns {T}
 */
export function randomElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}

/**
 * Shuffles array (Fisher-Yates shuffle)
 * @template T
 * @param {T[]} array
 * @returns {T[]}
 */
export function shuffle(array) {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Random velocity (can be positive or negative)
 * @param {number} min - minimum absolute velocity
 * @param {number} max - maximum absolute velocity
 * @returns {number}
 */
export function randomVelocity(min, max) {
  const speed = randomRange(min, max);
  return Math.random() > 0.5 ? speed : -speed;
}

/**
 * Get N random elements from array (without repetition)
 * @template T
 * @param {T[]} array
 * @param {number} count
 * @returns {T[]}
 */
export function randomSample(array, count) {
  const shuffled = shuffle(array);
  return shuffled.slice(0, Math.min(count, array.length));
}
