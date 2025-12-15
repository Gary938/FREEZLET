// Interactive/Background/FileSystem/StoryManagement/slideManager.js - Story slide management

import { scanImageFiles } from '../../Utils/fileScanner.js';
import { saveBackgroundState } from '../../DB/backgroundState.js';
import { selectNextStory } from './selector.js';
import { createSuccessResult, createErrorResult } from '../../../../Core/errorHandler.js';
import { trace } from '../../../../Utils/tracer.js';
import path from 'path';

// OPERATIONS
export const findNextSlide = async (currentPath) => {
    trace('findNextSlide', { currentPath });

    const slideInfo = extractSlideInfo(currentPath);
    const searchResult = await searchNextSlide(slideInfo.storyPath, slideInfo.currentNumber);

    if (!searchResult.success) {
        return await selectNextStory(currentPath);
    }

    return saveSlideAndReturn(searchResult.data.nextSlide);
};

export const getFirstSlideInStory = async (storyPath) => {
    trace('getFirstSlideInStory', { storyPath });

    const imagesResult = await scanImageFiles(storyPath);
    if (!imagesResult.success) {
        return createErrorResult(`No images in story: ${storyPath}`, 'NO_IMAGES');
    }

    const { imageFiles } = imagesResult.data;
    if (imageFiles.length === 0) {
        return createErrorResult(`Empty story: ${storyPath}`, 'EMPTY_STORY');
    }

    const firstSlide = imageFiles[0];
    return saveSlideAndReturn(firstSlide);
};

// HELPERS
const extractSlideInfo = (currentPath) => {
    const currentFileName = path.basename(currentPath, path.extname(currentPath));
    const currentNumber = parseInt(currentFileName, 10);

    let workingPath = currentPath;
    // Convert relative paths to absolute
    if (!path.isAbsolute(currentPath)) {
        workingPath = path.join(process.cwd(), currentPath);
    }

    const storyPath = path.dirname(workingPath);

    // If filename is not a number, start from 0
    return { currentNumber: isNaN(currentNumber) ? 0 : currentNumber, storyPath };
};

const searchNextSlide = async (storyPath, currentNumber) => {
    const imagesResult = await scanImageFiles(storyPath);
    if (!imagesResult.success) {
        return createErrorResult(imagesResult.error, 'SCAN_ERROR');
    }

    const nextSlideNumber = currentNumber + 1;
    return findSlideByNumber(imagesResult.data.imageFiles, nextSlideNumber);
};

const findSlideByNumber = (imageFiles, targetNumber) => {
    const slideIndex = imageFiles.findIndex(file => {
        const fileName = path.basename(file, path.extname(file));
        return parseInt(fileName) === targetNumber;
    });
    
    if (slideIndex === -1) {
        return createErrorResult('Next slide not found', 'NO_NEXT_SLIDE');
    }
    
    const foundSlide = imageFiles[slideIndex];
    return createSuccessResult({ nextSlide: foundSlide });
};

const saveSlideAndReturn = (slidePath) => {
    const saveResult = saveBackgroundState(slidePath, 'story');
    
    if (!saveResult.success) {
        return createErrorResult(saveResult.error, 'SAVE_ERROR');
    }
    
    return createSuccessResult({ backgroundPath: slidePath });
}; 