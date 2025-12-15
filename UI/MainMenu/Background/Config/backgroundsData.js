// UI/MainMenu/Background/Config/backgroundsData.js
// Paths to background images and CSS fallback gradients

const BASE_PATH = 'CSS/Content/MainMenu/Backgrounds';

export const BACKGROUNDS = {
  cosmos: [
    `${BASE_PATH}/Cosmos/cosmos_1.jpg`,
    `${BASE_PATH}/Cosmos/cosmos_2.jpg`,
    `${BASE_PATH}/Cosmos/cosmos_3.jpg`,
    `${BASE_PATH}/Cosmos/cosmos_4.jpg`,
    `${BASE_PATH}/Cosmos/cosmos_5.jpg`
  ],
  abstract: [
    `${BASE_PATH}/Abstract/abstract_1.jpg`,
    `${BASE_PATH}/Abstract/abstract_2.jpg`,
    `${BASE_PATH}/Abstract/abstract_3.jpg`,
    `${BASE_PATH}/Abstract/abstract_4.jpg`,
    `${BASE_PATH}/Abstract/abstract_5.jpg`
  ]
};

// Light UI text colors for each background (lightened versions of main colors)
export const UI_TEXT_COLORS = {
  cosmos: [
    '#88AAFF',  // 1. Deep Space - light blue
    '#CC99FF',  // 2. Nebula - light purple
    '#FFAA99',  // 3. Red Nebula - light coral
    '#99FFCC',  // 4. Aurora - light mint
    '#FFDD99'   // 5. Supernova - light gold
  ],
  abstract: [
    '#99EEFF',  // 6. Cyan Electric - light cyan
    '#FF99DD',  // 7. Magenta Pulse - light pink
    '#99CCFF',  // 8. Ocean Depth - light blue
    '#FFAACC',  // 9. Cosmic Pink - light pink
    '#AAFFCC'   // 10. Emerald Night - light emerald
  ]
};

// CSS gradients - 5 fundamentally different cosmic themes
export const FALLBACK_GRADIENTS = {
  cosmos: [
    // 1. Deep Space (blue) - deep space
    'linear-gradient(135deg, #000008 0%, #000820 30%, #001040 50%, #000825 70%, #000510 100%)',
    // 2. Nebula (purple) - nebula
    'linear-gradient(160deg, #080010 0%, #150828 30%, #280840 50%, #180525 70%, #0a0012 100%)',
    // 3. Red Nebula (red) - red nebula / Mars
    'linear-gradient(135deg, #0a0000 0%, #200505 25%, #351010 50%, #250808 75%, #0f0202 100%)',
    // 4. Aurora (green) - northern lights
    'linear-gradient(180deg, #000a05 0%, #052818 30%, #084530 50%, #053520 70%, #001008 100%)',
    // 5. Supernova (gold) - supernova explosion
    'linear-gradient(45deg, #0a0500 0%, #1a1005 25%, #302515 50%, #201008 75%, #080300 100%)'
  ],
  abstract: [
    // 6. Cyan Electric - electric cyan
    'linear-gradient(135deg, #000505 0%, #051520 30%, #0a2535 50%, #051518 70%, #000808 100%)',
    // 7. Magenta Pulse - magenta pulse
    'linear-gradient(180deg, #0a0008 0%, #1a0520 30%, #2a0835 50%, #150418 70%, #050005 100%)',
    // 8. Ocean Depth - ocean depths
    'linear-gradient(160deg, #000305 0%, #000a18 30%, #001528 50%, #000a15 70%, #000208 100%)',
    // 9. Cosmic Pink - cosmic pink
    'linear-gradient(135deg, #080005 0%, #180815 30%, #280a20 50%, #150510 70%, #080005 100%)',
    // 10. Emerald Night - emerald night
    'linear-gradient(45deg, #000805 0%, #031a10 30%, #052a18 50%, #021508 70%, #000502 100%)'
  ]
};

/**
 * Gets all paths to background images
 * @returns {string[]}
 */
export function getAllBackgrounds() {
  return [...BACKGROUNDS.cosmos, ...BACKGROUNDS.abstract];
}

/**
 * Gets random background
 * @returns {string}
 */
export function getRandomBackground() {
  const all = getAllBackgrounds();
  return all[Math.floor(Math.random() * all.length)];
}

/**
 * Gets random fallback gradient
 * @returns {string}
 */
export function getRandomFallbackGradient() {
  const allGradients = [...FALLBACK_GRADIENTS.cosmos, ...FALLBACK_GRADIENTS.abstract];
  return allGradients[Math.floor(Math.random() * allGradients.length)];
}

/**
 * Gets fallback gradient by index (corresponds to image index)
 * @param {number} index
 * @returns {string}
 */
export function getFallbackGradientByIndex(index) {
  const allGradients = [...FALLBACK_GRADIENTS.cosmos, ...FALLBACK_GRADIENTS.abstract];
  return allGradients[index % allGradients.length];
}

/**
 * Gets light UI text color by background index
 * @param {number} index
 * @returns {string}
 */
export function getUITextColorByIndex(index) {
  const allColors = [...UI_TEXT_COLORS.cosmos, ...UI_TEXT_COLORS.abstract];
  return allColors[index % allColors.length];
}

/**
 * Gets random background index (0-9)
 * @returns {number}
 */
export function getRandomBackgroundIndex() {
  return Math.floor(Math.random() * 10);
}
