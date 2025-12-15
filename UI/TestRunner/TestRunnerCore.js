import { ViewManager } from './modules/ViewManager.js';
import { QuestionManager } from './modules/QuestionManager.js';
import { ProgressManager } from './modules/ProgressManager.js';
import { ResultManager } from './modules/ResultManager.js';
import { getTestState } from "./testState.js";
import { createLogger } from '@UI/Utils/loggerService.js';

// Create logger for module
const logger = createLogger('UI/TestRunner/TestRunnerCore');

/**
 * Initializes and starts test runner
 * @returns {Promise<void>}
 */
export async function TestRunnerCore() {
    logger.info("Initializing test runner...");
    
    const viewManager = new ViewManager();
    await viewManager.initialize();
    logger.info("ViewManager initialized");
    
    const questionManager = new QuestionManager();
    const progressManager = new ProgressManager();
    const resultManager = new ResultManager();
    logger.info("Managers created");
    
    // Initialize components
    await viewManager.setupLayout();
    logger.info("Layout configured");
    
    questionManager.initialize();
    logger.info("QuestionManager initialized");
    
    progressManager.initialize();
    logger.info("ProgressManager initialized");
    
    // Pass control to QuestionManager to start test
    questionManager.startTest();
    logger.info("Test started");
} 