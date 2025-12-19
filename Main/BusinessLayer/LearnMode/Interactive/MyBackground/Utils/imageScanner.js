// Interactive/MyBackground/Utils/imageScanner.js - Scan MyBackground folder

import { createSuccessResult, createErrorResult } from '../../../Core/errorHandler.js';
import { MY_BACKGROUND_CONFIG } from '../Config/myBackgroundConfig.js';
import { trace } from '../../../Utils/tracer.js';
import { promises as fs } from 'fs';
import path from 'path';
import { app } from 'electron';
import { getBasePath } from '../../../../../Utils/appPaths.js';
import { mainLogger } from '../../../../../loggerHub.js';

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

    mainLogger.debug('MyBackground', 'scanMyBackgrounds started', {
        folderPath: MY_BACKGROUND_CONFIG.FOLDER_PATH,
        basePath: getBasePath(),
        isPackaged: app.isPackaged
    });

    await ensureFolderExists();

    try {
        const files = await fs.readdir(MY_BACKGROUND_CONFIG.FOLDER_PATH);
        mainLogger.debug('MyBackground', 'Files found in folder', { files, count: files.length });

        const imageFiles = filterImageFiles(files);

        mainLogger.debug('MyBackground', 'Filtered image files', {
            imageFiles,
            count: imageFiles.length
        });

        return createSuccessResult({
            images: imageFiles,
            count: imageFiles.length
        });
    } catch (error) {
        mainLogger.error('MyBackground', 'Error scanning folder', { error: error.message });
        return createErrorResult(error.message, 'SCAN_ERROR');
    }
};

// HELPERS
const filterImageFiles = (files) => {
    return files
        .filter(file => isImageFile(file))
        .map(file => {
            const absolutePath = path.join(MY_BACKGROUND_CONFIG.FOLDER_PATH, file);
            let resultPath;

            // In production: use file:// protocol for userData paths
            // In dev: use relative path
            if (app.isPackaged) {
                resultPath = 'file:///' + absolutePath.replace(/\\/g, '/');
                mainLogger.debug('MyBackground', 'File path conversion (production)', {
                    originalFile: file,
                    absolutePath,
                    resultPath
                });
            } else {
                const relativePath = path.relative(getBasePath(), absolutePath);
                resultPath = relativePath.replace(/\\/g, '/');
                mainLogger.debug('MyBackground', 'File path conversion (dev)', {
                    originalFile: file,
                    absolutePath,
                    basePath: getBasePath(),
                    relativePath,
                    resultPath
                });
            }

            return resultPath;
        })
        .sort((a, b) => a.localeCompare(b));
};

const isImageFile = (filename) => {
    const ext = path.extname(filename).toLowerCase();
    return MY_BACKGROUND_CONFIG.SUPPORTED_EXTENSIONS.includes(ext);
};

// Magic bytes for image formats
const IMAGE_SIGNATURES = {
    jpg: [0xFF, 0xD8, 0xFF],
    png: [0x89, 0x50, 0x4E, 0x47],
    gif: [0x47, 0x49, 0x46, 0x38],
    webp: [0x52, 0x49, 0x46, 0x46], // RIFF header (WebP starts with RIFF)
    bmp: [0x42, 0x4D]
};

// Validate image file by checking magic bytes
export const validateImageContent = async (filePath) => {
    trace('MyBackground:validateImageContent', { filePath });

    try {
        const fileHandle = await fs.open(filePath, 'r');
        const buffer = Buffer.alloc(12);
        await fileHandle.read(buffer, 0, 12, 0);
        await fileHandle.close();

        // Check each signature
        for (const [format, signature] of Object.entries(IMAGE_SIGNATURES)) {
            const matches = signature.every((byte, index) => buffer[index] === byte);
            if (matches) {
                // WebP needs additional check for 'WEBP' at offset 8
                if (format === 'webp') {
                    const webpMarker = buffer.slice(8, 12).toString('ascii');
                    if (webpMarker === 'WEBP') {
                        return createSuccessResult({ valid: true, format: 'webp' });
                    }
                } else {
                    return createSuccessResult({ valid: true, format });
                }
            }
        }

        return createSuccessResult({ valid: false, format: null });
    } catch (error) {
        mainLogger.error('MyBackground', 'Error validating image content', { error: error.message, filePath });
        return createErrorResult(error.message, 'VALIDATION_ERROR');
    }
};

export const deleteImageFile = async (imagePath) => {
    trace('MyBackground:deleteImageFile', { imagePath });

    try {
        // Handle file:// protocol paths (production) vs relative paths (dev)
        const fullPath = imagePath.startsWith('file:///')
            ? imagePath.replace('file:///', '')
            : path.join(getBasePath(), imagePath);
        await fs.unlink(fullPath);
        return createSuccessResult({ deleted: imagePath });
    } catch (error) {
        return createErrorResult(error.message, 'DELETE_ERROR');
    }
};
