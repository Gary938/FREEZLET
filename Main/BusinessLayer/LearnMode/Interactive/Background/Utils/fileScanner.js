// Interactive/Background/Utils/fileScanner.js - File and folder scanning

import { pathExists } from './pathValidator.js';
import { createSuccessResult, createErrorResult } from '../../../Core/errorHandler.js';
import { BACKGROUND_CONFIG } from '../Config/backgroundConfig.js';
import { trace } from '../../../Utils/tracer.js';
import { promises as fs } from 'fs';
import path from 'path';

// OPERATIONS
export const scanImageFiles = async (directoryPath) => {
    trace('scanImageFiles', { directoryPath });

    const pathCheck = pathExists(directoryPath);
    if (!pathCheck.success) {
        return createErrorResult(pathCheck.error, 'PATH_ERROR');
    }

    if (!pathCheck.data.exists) {
        return createErrorResult(`Folder not found: ${directoryPath}`, 'DIRECTORY_NOT_FOUND');
    }

    try {
        const files = await fs.readdir(directoryPath);
        const imageFiles = filterImageFiles(files, directoryPath);

        return createSuccessResult({ imageFiles, totalCount: imageFiles.length });
    } catch (error) {
        return createErrorResult(error.message, 'SCAN_ERROR');
    }
};

export const scanDirectories = async (parentPath) => {
    trace('scanDirectories', { parentPath });

    const pathCheck = pathExists(parentPath);
    if (!pathCheck.success) {
        return createErrorResult(pathCheck.error, 'PATH_ERROR');
    }

    if (!pathCheck.data.exists) {
        return createErrorResult(`Parent folder not found: ${parentPath}`, 'PARENT_NOT_FOUND');
    }

    try {
        const entries = await fs.readdir(parentPath, { withFileTypes: true });
        const directories = entries
            .filter(entry => entry.isDirectory())
            .map(entry => entry.name)
            .sort();

        return createSuccessResult({ directories, totalCount: directories.length });
    } catch (error) {
        return createErrorResult(error.message, 'SCAN_ERROR');
    }
};

// HELPERS
const filterImageFiles = (files, directoryPath) => {
    return files
        .filter(file => isImageFile(file))
        .map(file => {
            const absolutePath = path.join(directoryPath, file);
            const relativePath = path.relative(process.cwd(), absolutePath);
            return relativePath.replace(/\\/g, '/');
        })
        .sort((a, b) => {
            const aNum = parseInt(path.basename(a, path.extname(a)), 10);
            const bNum = parseInt(path.basename(b, path.extname(b)), 10);
            // If both are numbers - sort by number, otherwise by name
            if (!isNaN(aNum) && !isNaN(bNum)) return aNum - bNum;
            if (isNaN(aNum) && isNaN(bNum)) return a.localeCompare(b);
            return isNaN(aNum) ? 1 : -1;  // Numbers first
        });
};

const isImageFile = (filename) => {
    const ext = path.extname(filename).toLowerCase();
    return BACKGROUND_CONFIG.SUPPORTED_EXTENSIONS.includes(ext);
}; 