// Effects/EatingEffects/index.js - Centralized eating effects export

// Core eating effects
export { 
    createEatingEffects,
    createGhostDisappearEffect,
    scareRemainingGhosts 
} from './eatingCore.js';

// Popup effects
export { 
    createPopupNumber,
    createMultiplePopups 
} from './popupEffects.js';

// Flash effects
export { 
    createFlashEffect,
    createMultipleFlashes,
    createColoredFlash 
} from './flashEffects.js';

// Crumbs effects
export { 
    createCrumbsEffect,
    createCustomCrumbs 
} from './crumbsEffects.js'; 