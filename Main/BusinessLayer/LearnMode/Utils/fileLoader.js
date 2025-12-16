// Utils/fileLoader.js - File loading

import { promises as fs } from 'fs';
import path from 'path';
import { trace } from './tracer.js';
import { getBasePath, getAppBasePath } from '../../../Utils/appPaths.js';

// CONFIG
const FILE_CONFIG = {
    MAX_FILE_SIZE: 10 * 1024 * 1024,  // 10MB
    MAX_PATH_LENGTH: 1024,
    // Allowed base directories for file loading
    // Tests is in extraResources (getBasePath), CSS is in app.asar (getAppBasePath)
    ALLOWED_BASE_DIRS: [
        { dir: 'Tests', getBase: getBasePath },
        { dir: 'CSS', getBase: getAppBasePath }
    ]
};

// Convert relative path to absolute using appropriate base directory
const resolveFilePath = (filePath) => {
    // If already absolute, return as-is
    if (path.isAbsolute(filePath)) {
        return filePath;
    }

    // Determine base directory from path prefix
    for (const { dir, getBase } of FILE_CONFIG.ALLOWED_BASE_DIRS) {
        if (filePath.startsWith(dir + '/') || filePath.startsWith(dir + path.sep)) {
            return path.join(getBase(), filePath);
        }
    }

    // Default: use getBasePath for Tests
    return path.join(getBasePath(), filePath);
};

// Basic path validation (sync)
const validateFilePath = (filePath) => {
    if (!filePath || typeof filePath !== 'string') {
        return { valid: false, error: 'Invalid file path' };
    }
    if (filePath.length > FILE_CONFIG.MAX_PATH_LENGTH) {
        return { valid: false, error: 'Path too long' };
    }
    // Check for obvious path traversal attempts
    const normalized = path.normalize(filePath);
    if (normalized.includes('..')) {
        return { valid: false, error: 'Path traversal not allowed' };
    }
    return { valid: true };
};

// Enhanced security: verify real path is within allowed directories
// Use startsWith() instead of includes() to prevent path traversal attacks
// Attack example with includes(): /etc/Tests/shadow contains "/Tests/" but not in our directory
const validateSecurePath = async (filePath) => {
    try {
        // Resolve symlinks and get real absolute path
        const realPath = await fs.realpath(filePath);

        // Check if path starts with any allowed base directory (not just contains)
        const isAllowed = FILE_CONFIG.ALLOWED_BASE_DIRS.some(({ dir, getBase }) => {
            const allowedPath = path.join(getBase(), dir);
            // Path must START with allowed directory
            return realPath.startsWith(allowedPath + path.sep) || realPath === allowedPath;
        });

        if (!isAllowed) {
            trace('securityBlock', { filePath, realPath, reason: 'outside allowed dirs' });
            return { valid: false, error: 'Access denied: file outside allowed directories' };
        }

        return { valid: true, realPath };
    } catch (error) {
        // File doesn't exist or can't resolve - will be caught later
        return { valid: true, realPath: filePath };
    }
};

// OPERATIONS
export const loadFile = async (filePath) => {
    trace('loadFile', { filePath });

    // Step 1: Basic sync validation
    const pathValidation = validateFilePath(filePath);
    if (!pathValidation.valid) {
        return { success: false, error: pathValidation.error };
    }

    // Step 2: Resolve relative path to absolute
    const absolutePath = resolveFilePath(filePath);
    trace('loadFile:resolved', { filePath, absolutePath });

    // Step 3: Enhanced security check (resolves symlinks)
    const secureValidation = await validateSecurePath(absolutePath);
    if (!secureValidation.valid) {
        return { success: false, error: secureValidation.error };
    }

    try {
        // Use validated real path
        const safePath = secureValidation.realPath;

        // Check file size before reading
        const stats = await fs.stat(safePath);
        if (stats.size > FILE_CONFIG.MAX_FILE_SIZE) {
            return { success: false, error: 'File too large' };
        }

        const content = await fs.readFile(safePath, 'utf8');

        if (!content?.trim()) {
            return { success: false, error: 'File is empty' };
        }

        return { success: true, content };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

// Unified API: all functions return { success, ... } format
export const fileExists = async (filePath) => {
    try {
        await fs.access(filePath, fs.constants.F_OK);
        return { success: true, exists: true };
    } catch {
        return { success: true, exists: false };
    }
};

export const isReadable = async (filePath) => {
    try {
        await fs.access(filePath, fs.constants.R_OK);
        return { success: true, readable: true };
    } catch {
        return { success: true, readable: false };
    }
};

export const validateFileAccess = async (filePath) => {
    // Resolve relative path to absolute
    const absolutePath = resolveFilePath(filePath);

    const existsResult = await fileExists(absolutePath);
    if (!existsResult.exists) {
        return { valid: false, error: 'File not found' };
    }

    const readableResult = await isReadable(absolutePath);
    if (!readableResult.readable) {
        return { valid: false, error: 'File is not readable' };
    }

    // Security check
    const secureValidation = await validateSecurePath(absolutePath);
    if (!secureValidation.valid) {
        return { valid: false, error: secureValidation.error };
    }

    return { valid: true };
};

// HELPERS
export const safeLoad = async (filePath) => {
    // Resolve relative path to absolute first
    const absolutePath = resolveFilePath(filePath);
    trace('safeLoad', { filePath, absolutePath });

    const validation = await validateFileAccess(absolutePath);
    if (!validation.valid) {
        return { success: false, error: validation.error };
    }

    return loadFile(absolutePath);
}; 