// Components/MyBackground/myBackgroundBridge.js - Bridge to Main process for MyBackground

// IMPORTS
import { createUITracer } from '../../Utils/uiTracer.js';

// CONFIG
export const MY_BACKGROUND_BRIDGE_CONFIG = {
    ERROR_CODES: {
        NO_ELECTRON_API: 'NO_ELECTRON_API',
        INVALID_PATH: 'INVALID_PATH',
        BRIDGE_ERROR: 'BRIDGE_ERROR'
    }
};

// OPERATIONS
export const createMyBackgroundBridge = () => {
    const tracer = createUITracer('myBackgroundBridge');

    return {
        loadMyBackground: async () => {
            if (!window.electron?.learnMode) {
                tracer.trace('loadMyBackground:noElectronAPI');
                return createErrorResult(MY_BACKGROUND_BRIDGE_CONFIG.ERROR_CODES.NO_ELECTRON_API);
            }

            tracer.trace('loadMyBackground:start');

            try {
                const result = await window.electron.learnMode.loadMyBackground();

                if (result?.canceled) {
                    tracer.trace('loadMyBackground:canceled');
                    return { success: true, canceled: true, data: null };
                }

                if (result?.success) {
                    tracer.trace('loadMyBackground:success', { fileName: result.fileName });
                    return {
                        success: true,
                        canceled: false,
                        data: {
                            backgroundPath: result.backgroundPath,
                            fileName: result.fileName,
                            mode: result.mode
                        }
                    };
                }

                tracer.trace('loadMyBackground:error', { error: result?.error });
                return createErrorResult(result?.error || 'Unknown error');
            } catch (error) {
                tracer.trace('loadMyBackground:exception', { error: error.message });
                return createErrorResult(error.message);
            }
        },

        getMyBackgrounds: async () => {
            if (!window.electron?.learnMode) {
                tracer.trace('getMyBackgrounds:noElectronAPI');
                return createErrorResult(MY_BACKGROUND_BRIDGE_CONFIG.ERROR_CODES.NO_ELECTRON_API);
            }

            tracer.trace('getMyBackgrounds:start');

            try {
                const result = await window.electron.learnMode.getMyBackgrounds();

                if (result?.success) {
                    tracer.trace('getMyBackgrounds:success', { count: result.count });
                    return {
                        success: true,
                        data: {
                            images: result.images,
                            count: result.count
                        }
                    };
                }

                tracer.trace('getMyBackgrounds:error', { error: result?.error });
                return createErrorResult(result?.error || 'Unknown error');
            } catch (error) {
                tracer.trace('getMyBackgrounds:exception', { error: error.message });
                return createErrorResult(error.message);
            }
        },

        selectMyBackground: async (imagePath) => {
            if (!imagePath || typeof imagePath !== 'string') {
                tracer.trace('selectMyBackground:invalidPath', { imagePath });
                return createErrorResult(MY_BACKGROUND_BRIDGE_CONFIG.ERROR_CODES.INVALID_PATH);
            }

            if (!window.electron?.learnMode) {
                tracer.trace('selectMyBackground:noElectronAPI');
                return createErrorResult(MY_BACKGROUND_BRIDGE_CONFIG.ERROR_CODES.NO_ELECTRON_API);
            }

            tracer.trace('selectMyBackground:start', { imagePath });

            try {
                const result = await window.electron.learnMode.selectMyBackground(imagePath);

                if (result?.success) {
                    tracer.trace('selectMyBackground:success');
                    return {
                        success: true,
                        data: {
                            backgroundPath: result.backgroundPath,
                            mode: result.mode
                        }
                    };
                }

                tracer.trace('selectMyBackground:error', { error: result?.error });
                return createErrorResult(result?.error || 'Unknown error');
            } catch (error) {
                tracer.trace('selectMyBackground:exception', { error: error.message });
                return createErrorResult(error.message);
            }
        },

        getMyBackgroundSettings: async () => {
            if (!window.electron?.learnMode) {
                tracer.trace('getMyBackgroundSettings:noElectronAPI');
                return createErrorResult(MY_BACKGROUND_BRIDGE_CONFIG.ERROR_CODES.NO_ELECTRON_API);
            }

            tracer.trace('getMyBackgroundSettings:start');

            try {
                const result = await window.electron.learnMode.getMyBackgroundSettings();

                if (result?.success) {
                    tracer.trace('getMyBackgroundSettings:success', { randomMode: result.randomMode });
                    return {
                        success: true,
                        data: {
                            randomMode: result.randomMode
                        }
                    };
                }

                tracer.trace('getMyBackgroundSettings:error', { error: result?.error });
                return createErrorResult(result?.error || 'Unknown error');
            } catch (error) {
                tracer.trace('getMyBackgroundSettings:exception', { error: error.message });
                return createErrorResult(error.message);
            }
        },

        setMyBackgroundRandomMode: async (enabled) => {
            if (typeof enabled !== 'boolean') {
                tracer.trace('setMyBackgroundRandomMode:invalidParam', { enabled });
                return createErrorResult('Enabled must be boolean');
            }

            if (!window.electron?.learnMode) {
                tracer.trace('setMyBackgroundRandomMode:noElectronAPI');
                return createErrorResult(MY_BACKGROUND_BRIDGE_CONFIG.ERROR_CODES.NO_ELECTRON_API);
            }

            tracer.trace('setMyBackgroundRandomMode:start', { enabled });

            try {
                const result = await window.electron.learnMode.setMyBackgroundRandomMode(enabled);

                if (result?.success) {
                    tracer.trace('setMyBackgroundRandomMode:success', { randomMode: result.randomMode });
                    return {
                        success: true,
                        data: {
                            randomMode: result.randomMode
                        }
                    };
                }

                tracer.trace('setMyBackgroundRandomMode:error', { error: result?.error });
                return createErrorResult(result?.error || 'Unknown error');
            } catch (error) {
                tracer.trace('setMyBackgroundRandomMode:exception', { error: error.message });
                return createErrorResult(error.message);
            }
        },

        deleteMyBackgrounds: async (imagePaths) => {
            if (!imagePaths || !Array.isArray(imagePaths) || imagePaths.length === 0) {
                tracer.trace('deleteMyBackgrounds:invalidParam', { imagePaths });
                return createErrorResult('Image paths must be a non-empty array');
            }

            if (!window.electron?.learnMode) {
                tracer.trace('deleteMyBackgrounds:noElectronAPI');
                return createErrorResult(MY_BACKGROUND_BRIDGE_CONFIG.ERROR_CODES.NO_ELECTRON_API);
            }

            tracer.trace('deleteMyBackgrounds:start', { count: imagePaths.length });

            try {
                const result = await window.electron.learnMode.deleteMyBackgrounds(imagePaths);

                if (result?.success) {
                    tracer.trace('deleteMyBackgrounds:success', {
                        deletedCount: result.deleted?.length,
                        failedCount: result.failed?.length
                    });
                    return {
                        success: true,
                        data: {
                            deleted: result.deleted,
                            failed: result.failed
                        }
                    };
                }

                tracer.trace('deleteMyBackgrounds:error', { error: result?.error });
                return createErrorResult(result?.error || 'Unknown error');
            } catch (error) {
                tracer.trace('deleteMyBackgrounds:exception', { error: error.message });
                return createErrorResult(error.message);
            }
        }
    };
};

// HELPERS
const createErrorResult = (errorMessage) => ({
    success: false,
    error: errorMessage,
    data: null
});
