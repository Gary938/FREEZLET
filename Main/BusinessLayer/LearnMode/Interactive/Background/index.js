// Interactive/Background/index.js - Central Background module exports

import { triggerBackgroundChange } from './backgroundTrigger.js';
import { getCurrentMode, setBackgroundMode, getBackgroundState } from './modeManager.js';
import { loadBackgroundState, saveBackgroundState } from './DB/backgroundState.js';
import { selectRandomBackground } from './FileSystem/index.js';
import { getNextStorySlide } from './FileSystem/index.js';

// MAIN OPERATIONS
export { triggerBackgroundChange };

// MODE MANAGEMENT  
export { getCurrentMode, setBackgroundMode, getBackgroundState };

// DB OPERATIONS
export { loadBackgroundState, saveBackgroundState };

// FILE SYSTEM OPERATIONS
export { selectRandomBackground, getNextStorySlide }; 