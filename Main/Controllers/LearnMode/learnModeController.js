import { mainLogger } from '../../loggerHub.js';
// ✅ NEW IMPORT: Direct Core architecture connection
import { startTest, submitAnswer, getTestStatus, endTest } from '../../BusinessLayer/LearnMode/index.js';
// ✅ BACKGROUND INTEGRATION: Direct Background modules connection
import { setBackgroundMode, getBackgroundState } from '../../BusinessLayer/LearnMode/Interactive/Background/index.js';
// ✅ MY BACKGROUND INTEGRATION: Custom backgrounds module
import {
    loadMyBackground,
    getMyBackgrounds,
    selectMyBackground,
    getMyBackgroundSettings,
    setMyBackgroundRandomMode,
    deleteMyBackgrounds
} from '../../BusinessLayer/LearnMode/Interactive/MyBackground/index.js';

// Create logger for module
const logger = {
    debug: (message) => mainLogger.debug('Controllers:LearnMode:learnModeController', message),
    info: (message) => mainLogger.info('Controllers:LearnMode:learnModeController', message),
    warn: (message) => mainLogger.warn('Controllers:LearnMode:learnModeController', message),
    error: (message, error) => mainLogger.error('Controllers:LearnMode:learnModeController', message, error),
    success: (message) => mainLogger.success('Controllers:LearnMode:learnModeController', message)
};

/**
 * Controller for learn mode (new concept)
 */
export const learnModeController = {
    /**
     * Starts new test
     * @param {string} testPath - Path to test file
     * @returns {Promise<Object>} First question with correct answer
     */
    async startTest(testPath) {
        logger.info(`Controller: starting test ${testPath}`);
        
        // 🧪 TEST trace logging
        mainLogger.trace('Controllers:LearnMode:learnModeController', 'TEST TRACE: startTest call', { testPath });
        
        try {
            const result = await startTest(testPath);
            
            if (result.success) {
                logger.success(`Controller: test successfully started, response type: ${result.type || 'question'}`);
                if (result.data?.pacman) {
                    logger.debug(`Controller: Pacman command passed: ${result.data.pacman.action}`);
                }
            } else {
                logger.warn(`Controller: error starting test: ${result.error}`);
            }
            return result;
        } catch (error) {
            logger.error(`Controller: error starting test ${testPath}:`, error);
            return {
                success: false,
                error: error.message || 'Controller error starting test',
                code: "CONTROLLER_ERROR"
            };
        }
    },

    /**
     * Processes answer result from UI
     * @param {string} result - "correct" or "incorrect"
     * @returns {Promise<Object>} Next step
     */
    async submitAnswerResult(result) {
        logger.info(`Controller: received answer result: ${result}`);
        
        try {
            const response = await submitAnswer(result);
            
            if (response.success) {
                logger.success(`Controller: result processed, response type: ${response.type || 'processed'}`);
                if (response.data?.pacman) {
                    logger.debug(`Controller: Pacman command passed: ${response.data.pacman.action}`);
                }
            } else {
                logger.warn(`Controller: error processing result: ${response.error}`);
            }
            return response;
        } catch (error) {
            logger.error(`Controller: error processing result ${result}:`, error);
            return {
                success: false,
                error: error.message || 'Controller error processing result',
                code: "CONTROLLER_ERROR"
            };
        }
    },

    /**
     * Clears current test state
     * @returns {Object} Operation result
     */
    clearCurrentTest() {
        logger.info(`Controller: clearing current test`);
        
        try {
            const result = endTest();
            logger.success(`Controller: test state cleared`);
            return result;
        } catch (error) {
            logger.error(`Controller: error clearing state:`, error);
            return { success: false, error: error.message };
        }
    },

    /**
     * Checks for active test
     * @returns {Object} Check result
     */
    hasActiveTest() {
        logger.debug(`Controller: checking active test`);
        
        try {
            const testStatus = getTestStatus();
            const hasActive = testStatus.success && testStatus.data?.hasActiveTest || false;
            logger.debug(`Controller: active test: ${hasActive}`);
            return { hasActive };
        } catch (error) {
            logger.error(`Controller: error checking active test:`, error);
            return { hasActive: false, error: error.message };
        }
    },

    /**
     * Sets background mode for LearnMode
     * @param {string} mode - Background mode ('story' or 'random')
     * @returns {Promise<Object>} Operation result
     */
    async setBackgroundMode(mode) {
        logger.info(`Controller: setting background mode: ${mode}`);
        
        try {
            const result = await setBackgroundMode(mode);
            if (result.success) {
                logger.success(`Controller: background mode set: ${mode}`);
                return { 
                    success: true, 
                    mode: result.data.mode,
                    backgroundPath: result.data.backgroundPath,
                    hasBackgroundPath: result.data.hasBackgroundPath
                };
            }
            logger.warn(`Controller: error setting background mode: ${result.error}`);
            return { success: false, error: result.error };
        } catch (error) {
            logger.error(`Controller: error setting background mode:`, error);
            return { success: false, error: error.message };
        }
    },

    /**
     * Gets current background state
     * @returns {Promise<Object>} Current background state
     */
    async getBackgroundState() {
        logger.debug(`Controller: getting background state`);

        try {
            const result = getBackgroundState();
            if (result.success) {
                return {
                    success: true,
                    backgroundPath: result.data.backgroundPath,
                    mode: result.data.mode
                };
            }
            logger.warn(`Controller: error getting background state: ${result.error}`);
            return { success: false, error: result.error };
        } catch (error) {
            logger.error(`Controller: error getting background state:`, error);
            return { success: false, error: error.message };
        }
    },

    /**
     * Loads custom background via file dialog
     * @param {BrowserWindow} browserWindow - Window for modal dialog
     * @returns {Promise<Object>} Result with background path
     */
    async loadMyBackground(browserWindow) {
        logger.info(`Controller: loading custom backgrounds`);

        try {
            const result = await loadMyBackground(browserWindow);

            if (result.success && result.data.canceled) {
                logger.debug(`Controller: file dialog canceled`);
                return { success: true, canceled: true };
            }

            if (result.success) {
                const uploadedCount = result.data.uploaded?.length || 0;
                const failedCount = result.data.failed?.length || 0;
                logger.success(`Controller: custom backgrounds loaded: ${uploadedCount} uploaded, ${failedCount} failed`);
                return {
                    success: true,
                    canceled: false,
                    backgroundPath: result.data.backgroundPath,
                    uploaded: result.data.uploaded,
                    failed: result.data.failed,
                    mode: result.data.mode
                };
            }

            logger.warn(`Controller: error loading custom backgrounds: ${result.error}`);
            return { success: false, error: result.error };
        } catch (error) {
            logger.error(`Controller: error loading custom backgrounds:`, error);
            return { success: false, error: error.message };
        }
    },

    /**
     * Gets list of custom backgrounds
     * @returns {Promise<Object>} List of images
     */
    async getMyBackgrounds() {
        logger.debug(`Controller: getting custom backgrounds`);

        try {
            const result = await getMyBackgrounds();

            if (result.success) {
                logger.debug(`Controller: found ${result.data.count} custom backgrounds`);
                return {
                    success: true,
                    images: result.data.images,
                    count: result.data.count
                };
            }

            logger.warn(`Controller: error getting custom backgrounds: ${result.error}`);
            return { success: false, error: result.error };
        } catch (error) {
            logger.error(`Controller: error getting custom backgrounds:`, error);
            return { success: false, error: error.message };
        }
    },

    /**
     * Selects custom background from gallery
     * @param {string} imagePath - Path to image
     * @returns {Promise<Object>} Result with selected background
     */
    async selectMyBackground(imagePath) {
        logger.info(`Controller: selecting custom background: ${imagePath}`);

        try {
            const result = await selectMyBackground(imagePath);

            if (result.success) {
                logger.success(`Controller: custom background selected`);
                return {
                    success: true,
                    backgroundPath: result.data.backgroundPath,
                    mode: result.data.mode
                };
            }

            logger.warn(`Controller: error selecting custom background: ${result.error}`);
            return { success: false, error: result.error };
        } catch (error) {
            logger.error(`Controller: error selecting custom background:`, error);
            return { success: false, error: error.message };
        }
    },

    /**
     * Gets MyBackground settings (random mode on/off)
     * @returns {Object} Settings object
     */
    getMyBackgroundSettings() {
        logger.debug(`Controller: getting MyBackground settings`);

        try {
            const result = getMyBackgroundSettings();

            if (result.success) {
                return {
                    success: true,
                    randomMode: result.data.randomMode
                };
            }

            logger.warn(`Controller: error getting MyBackground settings: ${result.error}`);
            return { success: false, error: result.error };
        } catch (error) {
            logger.error(`Controller: error getting MyBackground settings:`, error);
            return { success: false, error: error.message };
        }
    },

    /**
     * Sets MyBackground random mode
     * @param {boolean} enabled - Enable or disable random mode
     * @returns {Object} Operation result
     */
    setMyBackgroundRandomMode(enabled) {
        logger.info(`Controller: setting MyBackground random mode: ${enabled}`);

        try {
            const result = setMyBackgroundRandomMode(enabled);

            if (result.success) {
                logger.success(`Controller: MyBackground random mode set to ${enabled}`);
                return {
                    success: true,
                    randomMode: result.data.randomMode
                };
            }

            logger.warn(`Controller: error setting MyBackground random mode: ${result.error}`);
            return { success: false, error: result.error };
        } catch (error) {
            logger.error(`Controller: error setting MyBackground random mode:`, error);
            return { success: false, error: error.message };
        }
    },

    /**
     * Deletes selected custom backgrounds
     * @param {string[]} imagePaths - Array of image paths to delete
     * @returns {Promise<Object>} Result with deleted and failed arrays
     */
    async deleteMyBackgrounds(imagePaths) {
        logger.info(`Controller: deleting ${imagePaths?.length || 0} custom backgrounds`);

        try {
            const result = await deleteMyBackgrounds(imagePaths);

            if (result.success) {
                const deletedCount = result.data.deleted?.length || 0;
                const failedCount = result.data.failed?.length || 0;
                logger.success(`Controller: deleted ${deletedCount} backgrounds, ${failedCount} failed`);
                return {
                    success: true,
                    deleted: result.data.deleted,
                    failed: result.data.failed
                };
            }

            logger.warn(`Controller: error deleting backgrounds: ${result.error}`);
            return { success: false, error: result.error };
        } catch (error) {
            logger.error(`Controller: error deleting backgrounds:`, error);
            return { success: false, error: error.message };
        }
    }
}; 