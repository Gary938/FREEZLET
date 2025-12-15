// UI/MainMenu/Background/Config/floatingConfig.js
// Floating elements configuration

export const FLOATING_CONFIG = {
  // Number of elements
  questionCount: 10,
  formulaCount: 5,

  // Movement speed (pixels per frame) - slowed by 40%
  minSpeed: 0.24,
  maxSpeed: 0.6,

  // Font sizes
  questionFontSize: { min: 16, max: 22 },
  formulaFontSize: { min: 22, max: 30 },

  // Visual parameters
  baseOpacity: 0.75,
  fontFamily: "'Segoe UI', 'Noto Sans', Arial, sans-serif",

  // Color schemes
  colors: {
    questions: ['#ffffff', '#e0e7ff', '#c7d2fe', '#a5b4fc'],
    formulas: ['#fef08a', '#fde047', '#facc15'],
    glow: ['#00ffff', '#ff00ff', '#00ff88', '#ffaa00']
  },

  // Glow parameters on collision
  glow: {
    maxIntensity: 1.0,
    fadeSpeed: 0.03,
    blurRadius: 25
  },

  // Particle parameters
  particles: {
    count: 6,
    minSpeed: 1.5,
    maxSpeed: 2.5,
    fadeSpeed: 0.025,
    minSize: 2,
    maxSize: 4
  },

  // Screen edge padding for spawning
  spawnPadding: 50
};
