// Interactive/Background/FileSystem/StoryManagement/selector.js - Story selection and switching

import { scanDirectories } from '../../Utils/fileScanner.js';
import { getFirstSlideInStory } from './slideManager.js';
import { createSuccessResult, createErrorResult } from '../../../../Core/errorHandler.js';
import { trace } from '../../../../Utils/tracer.js';
import { PATHS } from '../../Config/backgroundConfig.js';
import path from 'path';

// OPERATIONS
export const selectRandomStory = async () => {
    trace('selectRandomStory', {});

    const storiesResult = await scanDirectories(PATHS.STORIES);
    if (!storiesResult.success) {
        return createErrorResult(storiesResult.error, 'SCAN_ERROR');
    }

    const { directories } = storiesResult.data;
    if (directories.length === 0) {
        return createErrorResult('No available stories', 'NO_STORIES');
    }

    const selectedStory = selectRandomFromArray(directories);
    const selectedStoryPath = path.join(PATHS.STORIES, selectedStory);

    trace('randomStorySelected', {
        selectedStory,
        total: directories.length
    });

    return createSuccessResult({ selectedStoryPath, selectedStory });
};

export const selectNextStory = async (currentPath) => {
    trace('selectNextStory', { currentPath });

    const otherStoriesResult = await findOtherStories(currentPath);
    if (!otherStoriesResult.success) {
        return otherStoriesResult;
    }

    const { otherStories, currentStoryPath } = otherStoriesResult.data;

    // If no other stories - start current from beginning (cyclic view)
    if (otherStories.length === 0) {
        return await getFirstSlideInStory(currentStoryPath);
    }

    return await initializeSelectedStory(otherStories, path.basename(currentStoryPath));
};

// HELPERS
const selectRandomFromArray = (array) => {
    const randomIndex = Math.floor(Math.random() * array.length);
    return array[randomIndex];
};

const extractStoryPath = (currentPath) => {
    let workingPath = currentPath;
    // Convert relative paths to absolute
    if (!path.isAbsolute(currentPath)) {
        workingPath = path.join(process.cwd(), currentPath);
    }
    return path.dirname(workingPath);
};

const findOtherStories = async (currentPath) => {
    const currentStoryPath = extractStoryPath(currentPath);
    const storiesResult = await scanDirectories(PATHS.STORIES);

    if (!storiesResult.success) {
        return createErrorResult(storiesResult.error, 'SCAN_ERROR');
    }

    const { directories } = storiesResult.data;
    const currentStoryName = path.basename(currentStoryPath);
    const otherStories = directories.filter(name => name !== currentStoryName);

    return createSuccessResult({ otherStories, currentStoryPath });
};

const initializeSelectedStory = async (otherStories, currentStoryName) => {
    const nextStoryName = selectRandomFromArray(otherStories);
    const nextStoryPath = path.join(PATHS.STORIES, nextStoryName);

    trace('nextRandomStory', {
        currentStory: currentStoryName,
        nextStory: nextStoryName,
        availableStories: otherStories.length
    });

    return await getFirstSlideInStory(nextStoryPath);
}; 