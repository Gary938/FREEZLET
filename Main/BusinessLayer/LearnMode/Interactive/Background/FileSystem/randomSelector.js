// Interactive/Background/FileSystem/randomSelector.js - Random background selection

import { scanImageFiles } from '../Utils/fileScanner.js';
import { saveBackgroundState } from '../DB/backgroundState.js';
import { createSuccessResult, createErrorResult } from '../../../Core/errorHandler.js';
import { trace } from '../../../Utils/tracer.js';
import { PATHS } from '../Config/backgroundConfig.js';

// OPERATIONS
export const selectRandomBackground = async () => {
    trace('selectRandomBackground', {});

    const scanResult = await scanImageFiles(PATHS.RANDOM);
    if (!scanResult.success) {
        return createErrorResult(scanResult.error, 'SCAN_ERROR');
    }

    const { imageFiles } = scanResult.data;
    if (imageFiles.length === 0) {
        return createErrorResult('No images in Random folder', 'NO_IMAGES');
    }

    const selectedFile = selectRandomFile(imageFiles);
    const saveResult = saveBackgroundState(selectedFile, 'random');

    if (!saveResult.success) {
        return createErrorResult(saveResult.error, 'SAVE_ERROR');
    }

    return createSuccessResult({ backgroundPath: selectedFile });
};

// HELPERS
const selectRandomFile = (imageFiles) => {
    const randomIndex = Math.floor(Math.random() * imageFiles.length);
    return imageFiles[randomIndex];
}; 