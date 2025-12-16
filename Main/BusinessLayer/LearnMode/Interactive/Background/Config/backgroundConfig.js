// Interactive/Background/Config/backgroundConfig.js - Background system configuration

import path from 'path';
import { getUIAssetsContentPath } from '../../../../../Utils/appPaths.js';

// CONFIG
export const BACKGROUND_CONFIG = {
    BACKGROUNDS_PATH: getUIAssetsContentPath(),
    SUPPORTED_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.webp', '.gif'],
    DEFAULT_MODE: 'random',
    MODES: ['random', 'story', 'custom']
};

export const PATHS = {
    get RANDOM() { 
        return path.join(BACKGROUND_CONFIG.BACKGROUNDS_PATH, 'Random'); 
    },
    get STORIES() { 
        return path.join(BACKGROUND_CONFIG.BACKGROUNDS_PATH, 'Stories'); 
    }
};

// VALIDATION RULES
export const VALIDATION_RULES = {
    MODE: { 
        required: true, 
        allowedValues: BACKGROUND_CONFIG.MODES 
    },
    PATH: { 
        required: true, 
        minLength: 1 
    }
}; 