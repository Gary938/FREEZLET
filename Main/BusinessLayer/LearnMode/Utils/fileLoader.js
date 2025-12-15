// Utils/fileLoader.js - File loading

import { promises as fs } from 'fs';
import path from 'path';
import { trace } from './tracer.js';

// CONFIG
const FILE_CONFIG = {
    MAX_FILE_SIZE: 10 * 1024 * 1024,  // 10MB
    MAX_PATH_LENGTH: 1024,
    // Allowed base directories for file loading
    ALLOWED_BASE_DIRS: ['Tests', 'CSS']
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

        // Get base application path
        const basePath = process.cwd();

        // Check if path starts with allowed base directory (not just contains)
        const isAllowed = FILE_CONFIG.ALLOWED_BASE_DIRS.some(dir => {
            const allowedPath = path.join(basePath, dir);
            // Path must START with allowed directory
            return realPath.startsWith(allowedPath + path.sep) || realPath === allowedPath;
        });

        if (!isAllowed) {
            trace('securityBlock', { filePath, realPath, basePath, reason: 'outside allowed dirs' });
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

    // Step 2: Enhanced security check (resolves symlinks)
    const secureValidation = await validateSecurePath(filePath);
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
    const existsResult = await fileExists(filePath);
    if (!existsResult.exists) {
        return { valid: false, error: 'File not found' };
    }

    const readableResult = await isReadable(filePath);
    if (!readableResult.readable) {
        return { valid: false, error: 'File is not readable' };
    }

    // Security check
    const secureValidation = await validateSecurePath(filePath);
    if (!secureValidation.valid) {
        return { valid: false, error: secureValidation.error };
    }

    return { valid: true };
};

// HELPERS
export const safeLoad = async (filePath) => {
    const validation = await validateFileAccess(filePath);
    if (!validation.valid) {
        return { success: false, error: validation.error };
    }

    return loadFile(filePath);
}; 