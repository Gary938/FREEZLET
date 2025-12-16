// Interactive/MyBackground/Utils/imageScanner.js - Scan MyBackground folder

import { createSuccessResult, createErrorResult } from '../../../Core/errorHandler.js';
import { MY_BACKGROUND_CONFIG } from '../Config/myBackgroundConfig.js';
import { trace } from '../../../Utils/tracer.js';
import { promises as fs } from 'fs';
import path from 'path';
import { app } from 'electron';
import { getBasePath } from '../../../../../Utils/appPaths.js';

// OPERATIONS
export const ensureFolderExists = async () => {
    trace('MyBackground:ensureFolderExists', {});

    try {
        await fs.access(MY_BACKGROUND_CONFIG.FOLDER_PATH);
        return createSuccessResult({ created: false, path: MY_BACKGROUND_CONFIG.FOLDER_PATH });
    } catch {
        await fs.mkdir(MY_BACKGROUND_CONFIG.FOLDER_PATH, { recursive: true });
        return createSuccessResult({ created: true, path: MY_BACKGROUND_CONFIG.FOLDER_PATH });
    }
};

export const scanMyBackgrounds = async () => {
    trace('MyBackground:scanMyBackgrounds', {});

    await ensureFolderExists();

    try {
        const files = await fs.readdir(MY_BACKGROUND_CONFIG.FOLDER_PATH);
        const imageFiles = filterImageFiles(files);

        return createSuccessResult({
            images: imageFiles,
            count: imageFiles.length
        });
    } catch (error) {
        return createErrorResult(error.message, 'SCAN_ERROR');
    }
};

// HELPERS
const filterImageFiles = (files) => {
    return files
        .filter(file => isImageFile(file))
        .map(file => {
            const absolutePath = path.join(MY_BACKGROUND_CONFIG.FOLDER_PATH, file);
            // In production: use file:// protocol for userData paths
            // In dev: use relative path
            if (app.isPackaged) {
                return 'file://' + absolutePath;
            }
            const relativePath = path.relative(getBasePath(), absolutePath);
            return relativePath.replace(/\\/g, '/');
        })
        .sort((a, b) => a.localeCompare(b));
};

const isImageFile = (filename) => {
    const ext = path.extname(filename).toLowerCase();
    return MY_BACKGROUND_CONFIG.SUPPORTED_EXTENSIONS.includes(ext);
};

export const deleteImageFile = async (imagePath) => {
    trace('MyBackground:deleteImageFile', { imagePath });

    try {
        // Handle file:// protocol paths (production) vs relative paths (dev)
        const fullPath = imagePath.startsWith('file://')
            ? imagePath.replace('file://', '')
            : path.join(getBasePath(), imagePath);
        await fs.unlink(fullPath);
        return createSuccessResult({ deleted: imagePath });
    } catch (error) {
        return createErrorResult(error.message, 'DELETE_ERROR');
    }
};
