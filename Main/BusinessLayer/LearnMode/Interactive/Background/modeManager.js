// Interactive/Background/modeManager.js - Background mode management

import { loadBackgroundState, saveBackgroundState } from './DB/backgroundState.js';
import { validateMode } from './Utils/pathValidator.js';
import { selectRandomBackground } from './FileSystem/randomSelector.js';
import { getFirstStorySlide } from './FileSystem/StoryManagement/index.js';
import { getCurrentMyBackground } from '../MyBackground/index.js';
import { createSuccessResult, createErrorResult } from '../../Core/errorHandler.js';
import { trace } from '../../Utils/tracer.js';

// OPERATIONS
export const getCurrentMode = () => {
    trace('getCurrentMode', {});
    
    const stateResult = loadBackgroundState();
    if (!stateResult.success) {
        return createErrorResult(stateResult.error, 'STATE_ERROR');
    }
    
    return createSuccessResult({ mode: stateResult.data.mode });
};

export const setBackgroundMode = async (newMode) => {
    trace('setBackgroundMode', { newMode });

    const validation = validateMode(newMode);
    if (!validation.success) {
        return validation;
    }

    let backgroundPath = '';

    // Get image depending on mode
    if (newMode === 'story') {
        const storyResult = await getFirstStorySlide();
        if (!storyResult.success) {
            return createErrorResult(storyResult.error, 'STORY_ERROR');
        }
        backgroundPath = storyResult.data.backgroundPath;
    } else if (newMode === 'random') {
        const randomResult = await selectRandomBackground();
        if (!randomResult.success) {
            return createErrorResult(randomResult.error, 'RANDOM_ERROR');
        }
        backgroundPath = randomResult.data.backgroundPath;
    } else if (newMode === 'custom') {
        // For custom mode - keep current path from MyBackground
        const customResult = getCurrentMyBackground();
        if (customResult.success && customResult.data.currentPath) {
            backgroundPath = customResult.data.currentPath;
        }
    }

    const saveResult = saveBackgroundState(backgroundPath, newMode);
    if (!saveResult.success) {
        return createErrorResult(saveResult.error, 'SAVE_ERROR');
    }

    return createSuccessResult({
        mode: newMode,
        backgroundPath: backgroundPath,
        hasBackgroundPath: !!backgroundPath
    });
};

export const getBackgroundState = () => {
    trace('getBackgroundState', {});
    
    const stateResult = loadBackgroundState();
    if (!stateResult.success) {
        return createErrorResult(stateResult.error, 'STATE_ERROR');
    }
    
    // Return in format UI expects
    return createSuccessResult({
        backgroundPath: stateResult.data.currentPath || '',
        mode: stateResult.data.mode || 'random'
    });
}; 