// Interactive/MyBackground/DB/myBackgroundState.js - DB operations for MyBackground

import { db } from '../../../../../db.js';
import { createSuccessResult, createErrorResult } from '../../../Core/errorHandler.js';
import { trace } from '../../../Utils/tracer.js';
import { MY_BACKGROUND_CONFIG } from '../Config/myBackgroundConfig.js';

// OPERATIONS
export const saveMyBackgroundState = (imagePath) => {
    trace('MyBackground:saveState', { imagePath });

    if (!imagePath) {
        return createErrorResult('Image path cannot be empty', 'INVALID_PATH');
    }

    try {
        executeUpsertQuery(imagePath, MY_BACKGROUND_CONFIG.MODE_NAME);
        return createSuccessResult({ imagePath, mode: MY_BACKGROUND_CONFIG.MODE_NAME });
    } catch (error) {
        return createErrorResult(error.message, 'DB_SAVE_ERROR');
    }
};

export const loadMyBackgroundState = () => {
    trace('MyBackground:loadState', {});

    try {
        const row = db.prepare(`SELECT currentPath, mode FROM backgroundState WHERE id = 1`).get();

        if (row?.mode !== MY_BACKGROUND_CONFIG.MODE_NAME) {
            return createSuccessResult({ currentPath: null, mode: null, isCustomMode: false });
        }

        return createSuccessResult({
            currentPath: row.currentPath,
            mode: row.mode,
            isCustomMode: true
        });
    } catch (error) {
        return createErrorResult(error.message, 'DB_LOAD_ERROR');
    }
};

// HELPERS
const executeUpsertQuery = (imagePath, mode) => {
    db.prepare(`
        INSERT INTO backgroundState (id, currentPath, mode)
        VALUES (1, ?, ?)
        ON CONFLICT(id) DO UPDATE SET
            currentPath = excluded.currentPath,
            mode = excluded.mode
    `).run(imagePath, mode);
};
