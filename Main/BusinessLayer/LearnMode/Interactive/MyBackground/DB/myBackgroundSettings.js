// Interactive/MyBackground/DB/myBackgroundSettings.js - Settings for MyBackground mode

import { db } from '../../../../../db.js';
import { createSuccessResult, createErrorResult } from '../../../Core/errorHandler.js';
import { trace } from '../../../Utils/tracer.js';

// TABLE INITIALIZATION
export const ensureSettingsTable = () => {
    trace('MyBackground:ensureSettingsTable', {});

    try {
        db.prepare(`
            CREATE TABLE IF NOT EXISTS myBackgroundSettings (
                id INTEGER PRIMARY KEY DEFAULT 1,
                randomMode INTEGER DEFAULT 0
            )
        `).run();

        db.prepare(`INSERT OR IGNORE INTO myBackgroundSettings (id, randomMode) VALUES (1, 0)`).run();

        return createSuccessResult({ initialized: true });
    } catch (error) {
        return createErrorResult(error.message, 'TABLE_INIT_ERROR');
    }
};

// OPERATIONS
export const getMyBackgroundSettings = () => {
    trace('MyBackground:getSettings', {});

    try {
        ensureSettingsTable();

        const row = db.prepare(`SELECT randomMode FROM myBackgroundSettings WHERE id = 1`).get();

        return createSuccessResult({
            randomMode: row?.randomMode === 1
        });
    } catch (error) {
        return createErrorResult(error.message, 'GET_SETTINGS_ERROR');
    }
};

export const setMyBackgroundRandomMode = (enabled) => {
    trace('MyBackground:setRandomMode', { enabled });

    if (typeof enabled !== 'boolean') {
        return createErrorResult('Enabled must be boolean', 'INVALID_PARAM');
    }

    try {
        ensureSettingsTable();

        db.prepare(`UPDATE myBackgroundSettings SET randomMode = ? WHERE id = 1`).run(enabled ? 1 : 0);

        return createSuccessResult({ randomMode: enabled });
    } catch (error) {
        return createErrorResult(error.message, 'SET_SETTINGS_ERROR');
    }
};
