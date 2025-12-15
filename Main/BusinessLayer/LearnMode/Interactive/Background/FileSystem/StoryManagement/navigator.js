// Interactive/Background/FileSystem/StoryManagement/navigator.js - Main story navigation

import { loadBackgroundState } from '../../DB/backgroundState.js';
import { selectRandomStory } from './selector.js';
import { findNextSlide, getFirstSlideInStory } from './slideManager.js';
import { createSuccessResult, createErrorResult } from '../../../../Core/errorHandler.js';
import { trace } from '../../../../Utils/tracer.js';

// OPERATIONS
export const getNextStorySlide = async () => {
    trace('getNextStorySlide', {});

    const currentState = loadBackgroundState();
    if (!currentState.success) {
        return createErrorResult(currentState.error, 'STATE_ERROR');
    }

    const { currentPath } = currentState.data;

    if (!currentPath) {
        return await getFirstAvailableStorySlide();
    }

    return await findNextSlide(currentPath);
};

export const getFirstStorySlide = async () => {
    trace('getFirstStorySlide', {});

    return await getFirstAvailableStorySlide();
};

// HELPERS
const getFirstAvailableStorySlide = async () => {
    const storyResult = await selectRandomStory();
    if (!storyResult.success) {
        return createErrorResult(storyResult.error, 'STORY_SELECTION_ERROR');
    }

    const { selectedStoryPath } = storyResult.data;

    trace('selectedRandomStory', {
        storyPath: selectedStoryPath
    });

    return await getFirstSlideInStory(selectedStoryPath);
}; 