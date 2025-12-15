import { businessLayer } from '../../businessLayerHub.js';
import { mainLogger } from '../../loggerHub.js';
import { logApiStart, logApiSuccess, logApiError } from '../../Logger/apiLogger.js';

// Create logger for module
const logger = {
    debug: (message) => mainLogger.debug('API:LearnMode:learnModeAPI', message),
    info: (message) => mainLogger.info('API:LearnMode:learnModeAPI', message),
    warn: (message) => mainLogger.warn('API:LearnMode:learnModeAPI', message),
    error: (message, error) => mainLogger.error('API:LearnMode:learnModeAPI', message, error),
    success: (message) => mainLogger.success('API:LearnMode:learnModeAPI', message)
};

/**
 * Starts new test (new concept)
 * @param {string} testPath - Test file path
 * @returns {Promise<Object>} First question with correct answer
 */
async function startTestAPI(testPath) {
    logApiStart(logger, 'startTest', { testPath });
    
    try {
        const result = await businessLayer.learnMode.controller.startTest(testPath);
        logApiSuccess(logger, 'startTest', { type: result.type });
        return result;
    } catch (error) {
        logApiError(logger, 'startTest', error);
        return {
            type: "error",
            data: {
                message: error.message || 'API error starting test',
                code: "API_ERROR"
            }
        };
    }
}

/**
 * Processes answer result from UI (new concept)
 * @param {string} result - "correct" or "incorrect"
 * @returns {Promise<Object>} Next step
 */
async function submitAnswerResultAPI(result) {
    logApiStart(logger, 'submitAnswerResult', { result });
    
    try {
        const response = await businessLayer.learnMode.controller.submitAnswerResult(result);
        logApiSuccess(logger, 'submitAnswerResult', { type: response.type });
        return response;
    } catch (error) {
        logApiError(logger, 'submitAnswerResult', error);
        return {
            type: "error",
            data: {
                message: error.message || 'API error processing result',
                code: "API_ERROR"
            }
        };
    }
}

/**
 * Clears current test state
 * @returns {boolean} Operation result
 */
function clearCurrentTestAPI() {
    logApiStart(logger, 'clearCurrentTest', {});
    
    try {
        businessLayer.learnMode.controller.clearCurrentTest();
        logApiSuccess(logger, 'clearCurrentTest', { cleared: true });
        return { success: true };
    } catch (error) {
        logApiError(logger, 'clearCurrentTest', error);
        return { success: false, error: error.message };
    }
}

/**
 * Checks for active test
 * @returns {boolean} Whether there is an active test
 */
function hasActiveTestAPI() {
    logApiStart(logger, 'hasActiveTest', {});
    
    try {
        const hasActive = businessLayer.learnMode.controller.hasActiveTest();
        logApiSuccess(logger, 'hasActiveTest', { hasActive });
        return { hasActive };
    } catch (error) {
        logApiError(logger, 'hasActiveTest', error);
        return { hasActive: false, error: error.message };
    }
}

/**
 * Sets background mode (story/random)
 * @param {string} mode - Mode ('story' or 'random')
 * @returns {Object} Result with path to first slide
 */
async function setBackgroundModeAPI(mode) {
    logApiStart(logger, 'setBackgroundMode', { mode });

    try {
        const result = await businessLayer.learnMode.controller.setBackgroundMode(mode);
        logApiSuccess(logger, 'setBackgroundMode', { success: result.success, mode: result.mode });
        return result;
    } catch (error) {
        logApiError(logger, 'setBackgroundMode', error);
        return {
            success: false,
            backgroundPath: '',
            error: error.message || 'API error setting background mode'
        };
    }
}

export {
    startTestAPI as startTest,
    submitAnswerResultAPI as submitAnswerResult,
    clearCurrentTestAPI as clearCurrentTest,
    hasActiveTestAPI as hasActiveTest,
    setBackgroundModeAPI as setBackgroundMode
}; 