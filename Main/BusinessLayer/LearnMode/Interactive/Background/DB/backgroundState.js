// Interactive/Background/DB/backgroundState.js - Immutable DB operations

import { db } from '../../../../../db.js';
import { createSuccessResult, createErrorResult } from '../../../Core/errorHandler.js';
import { trace } from '../../../Utils/tracer.js';
import { BACKGROUND_CONFIG } from '../Config/backgroundConfig.js';

// OPERATIONS
export const loadBackgroundState = () => {
    trace('loadBackgroundState', {});
    
    try {
        const row = executeSelectQuery();
        const cleanedData = cleanStateData(row);
        
        return createSuccessResult(cleanedData);
    } catch (error) {
        return createErrorResult(error.message, 'DB_LOAD_ERROR');
    }
};

export const saveBackgroundState = (imagePath, mode) => {
    trace('saveBackgroundState', { imagePath, mode });

    // Fixed: check for null/undefined (empty string is allowed)
    if (imagePath === null || imagePath === undefined) {
        return createErrorResult('Image path cannot be null/undefined', 'INVALID_PATH');
    }

    if (!mode) {
        return createErrorResult('Mode cannot be empty', 'INVALID_MODE');
    }
    
    try {
        executeUpsertQuery(imagePath, mode);
        
        return createSuccessResult({ imagePath, mode });
    } catch (error) {
        return createErrorResult(error.message, 'DB_SAVE_ERROR');
    }
};

// HELPERS
const executeSelectQuery = () => {
    return db.prepare(`SELECT currentPath, mode FROM backgroundState WHERE id = 1`).get();
};

const executeUpsertQuery = (imagePath, mode) => {
    db.prepare(`
        INSERT INTO backgroundState (id, currentPath, mode)
        VALUES (1, ?, ?)
        ON CONFLICT(id) DO UPDATE SET 
            currentPath = excluded.currentPath,
            mode = excluded.mode
    `).run(imagePath, mode);
};

const cleanStateData = (row) => {
    const mode = row?.mode || BACKGROUND_CONFIG.DEFAULT_MODE;
    let currentPath = row?.currentPath || "";
    
    if (currentPath && currentPath.includes('undefined')) {
        currentPath = "";
    }
    
    return { currentPath, mode };
}; 