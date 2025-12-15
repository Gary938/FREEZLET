// Interactive/Background/backgroundTrigger.js - Background change triggers

import { getCurrentMode } from './modeManager.js';
import { selectRandomBackground } from './FileSystem/randomSelector.js';
import { getNextStorySlide } from './FileSystem/StoryManagement/index.js';
import { selectRandomMyBackground, getMyBackgroundSettings } from '../MyBackground/index.js';
import { createSuccessResult, createErrorResult } from '../../Core/errorHandler.js';
import { trace } from '../../Utils/tracer.js';

// OPERATIONS
export const triggerBackgroundChange = async () => {
    trace('triggerBackgroundChange', {});

    const modeResult = getCurrentMode();
    if (!modeResult.success) {
        return createErrorResult(`Failed to get mode: ${modeResult.error}`, 'MODE_ERROR');
    }

    const { mode } = modeResult.data;

    if (mode === 'random') {
        return await processRandomMode();
    }

    if (mode === 'story') {
        return await processStoryMode();
    }

    if (mode === 'custom') {
        return await processCustomMode();
    }

    return createErrorResult(`Unknown mode: ${mode}`, 'UNKNOWN_MODE');
};

// HELPERS
const processRandomMode = async () => {
    trace('processRandomMode', {});

    const randomResult = await selectRandomBackground();
    if (!randomResult.success) {
        return createErrorResult(randomResult.error, 'RANDOM_ERROR');
    }

    return createSuccessResult({
        backgroundPath: randomResult.data.backgroundPath,
        mode: 'random'
    });
};

const processStoryMode = async () => {
    trace('processStoryMode', {});

    const storyResult = await getNextStorySlide();
    if (!storyResult.success) {
        return createErrorResult(storyResult.error, 'STORY_ERROR');
    }

    return createSuccessResult({
        backgroundPath: storyResult.data.backgroundPath,
        mode: 'story'
    });
};

const processCustomMode = async () => {
    trace('processCustomMode', {});

    const settingsResult = getMyBackgroundSettings();
    if (!settingsResult.success) {
        return createSuccessResult({ backgroundPath: null, mode: 'custom', noChange: true });
    }

    if (!settingsResult.data.randomMode) {
        return createSuccessResult({ backgroundPath: null, mode: 'custom', noChange: true });
    }

    const randomResult = await selectRandomMyBackground();
    if (!randomResult.success) {
        return createErrorResult(randomResult.error, 'CUSTOM_RANDOM_ERROR');
    }

    return createSuccessResult({
        backgroundPath: randomResult.data.backgroundPath,
        mode: 'custom'
    });
}; 