// Interactive/MyBackground/myBackgroundCore.js - Core logic for MyBackground

import { createSuccessResult, createErrorResult } from '../../Core/errorHandler.js';
import { trace } from '../../Utils/tracer.js';
import { MY_BACKGROUND_CONFIG, DIALOG_OPTIONS } from './Config/myBackgroundConfig.js';
import { scanMyBackgrounds, ensureFolderExists, deleteImageFile } from './Utils/imageScanner.js';
import { saveMyBackgroundState, loadMyBackgroundState } from './DB/myBackgroundState.js';
import { promises as fs } from 'fs';
import path from 'path';
import { dialog, app } from 'electron';
import { getBasePath } from '../../../../Utils/appPaths.js';

// OPERATIONS
export const loadMyBackground = async (browserWindow) => {
    trace('MyBackground:load', {});

    try {
        await ensureFolderExists();

        const dialogResult = await dialog.showOpenDialog(browserWindow, DIALOG_OPTIONS);

        if (dialogResult.canceled || !dialogResult.filePaths?.length) {
            return createSuccessResult({ canceled: true });
        }

        const results = { uploaded: [], failed: [] };

        for (const sourcePath of dialogResult.filePaths) {
            const fileName = path.basename(sourcePath);
            const destPath = path.join(MY_BACKGROUND_CONFIG.FOLDER_PATH, fileName);

            try {
                await fs.copyFile(sourcePath, destPath);

                // In production: use file:// protocol for userData paths
                // In dev: use relative path
                const backgroundPath = app.isPackaged
                    ? 'file:///' + destPath.replace(/\\/g, '/')
                    : path.relative(getBasePath(), destPath).replace(/\\/g, '/');

                results.uploaded.push({ fileName, relativePath: backgroundPath });
            } catch (error) {
                results.failed.push({ fileName, error: error.message });
            }
        }

        if (results.uploaded.length === 0) {
            return createErrorResult('No files were uploaded', 'UPLOAD_FAILED');
        }

        const firstUpload = results.uploaded[0];
        const saveResult = saveMyBackgroundState(firstUpload.relativePath);
        if (!saveResult.success) {
            return saveResult;
        }

        trace('MyBackground:load:success', {
            uploadedCount: results.uploaded.length,
            failedCount: results.failed.length
        });

        return createSuccessResult({
            canceled: false,
            backgroundPath: firstUpload.relativePath,
            uploaded: results.uploaded,
            failed: results.failed,
            mode: MY_BACKGROUND_CONFIG.MODE_NAME
        });
    } catch (error) {
        trace('MyBackground:load:error', { error: error.message });
        return createErrorResult(error.message, 'LOAD_ERROR');
    }
};

export const getMyBackgrounds = async () => {
    trace('MyBackground:getAll', {});

    const scanResult = await scanMyBackgrounds();

    if (!scanResult.success) {
        return scanResult;
    }

    return createSuccessResult({
        images: scanResult.data.images,
        count: scanResult.data.count
    });
};

export const selectMyBackground = async (imagePath) => {
    trace('MyBackground:select', { imagePath });

    if (!imagePath) {
        return createErrorResult('Image path is required', 'INVALID_PATH');
    }

    try {
        // Handle file:// protocol paths (production) vs relative paths (dev)
        const absolutePath = imagePath.startsWith('file:///')
            ? imagePath.replace('file:///', '')
            : path.join(getBasePath(), imagePath);
        await fs.access(absolutePath);
    } catch {
        return createErrorResult(`File not found: ${imagePath}`, 'FILE_NOT_FOUND');
    }

    const saveResult = saveMyBackgroundState(imagePath);
    if (!saveResult.success) {
        return saveResult;
    }

    trace('MyBackground:select:success', { imagePath });

    return createSuccessResult({
        backgroundPath: imagePath,
        mode: MY_BACKGROUND_CONFIG.MODE_NAME
    });
};

export const selectRandomMyBackground = async () => {
    trace('MyBackground:selectRandom', {});

    const scanResult = await scanMyBackgrounds();

    if (!scanResult.success) {
        return createErrorResult(scanResult.error, 'SCAN_ERROR');
    }

    const { images } = scanResult.data;

    if (images.length === 0) {
        return createErrorResult('No custom backgrounds available', 'NO_IMAGES');
    }

    const randomIndex = Math.floor(Math.random() * images.length);
    const selectedFile = images[randomIndex];

    const saveResult = saveMyBackgroundState(selectedFile);
    if (!saveResult.success) {
        return saveResult;
    }

    trace('MyBackground:selectRandom:success', { selectedFile, fromTotal: images.length });

    return createSuccessResult({ backgroundPath: selectedFile });
};

export const getCurrentMyBackground = () => {
    trace('MyBackground:getCurrent', {});
    return loadMyBackgroundState();
};

export const deleteMyBackgrounds = async (imagePaths) => {
    trace('MyBackground:delete', { count: imagePaths?.length });

    if (!imagePaths || !Array.isArray(imagePaths) || imagePaths.length === 0) {
        return createErrorResult('No images specified for deletion', 'INVALID_INPUT');
    }

    const deleted = [];
    const failed = [];

    for (const imagePath of imagePaths) {
        const result = await deleteImageFile(imagePath);

        if (result.success) {
            deleted.push(imagePath);
        } else {
            failed.push({ path: imagePath, error: result.error });
        }
    }

    // Check if current background was deleted - reset if needed
    const currentState = loadMyBackgroundState();
    if (currentState.success && deleted.includes(currentState.data.currentPath)) {
        const scanResult = await scanMyBackgrounds();
        if (scanResult.success && scanResult.data.images.length > 0) {
            saveMyBackgroundState(scanResult.data.images[0]);
        }
    }

    trace('MyBackground:delete:complete', { deletedCount: deleted.length, failedCount: failed.length });

    return createSuccessResult({ deleted, failed });
};
