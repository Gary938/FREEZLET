import { createLogger } from '@UI/Utils/loggerService.js';
import { testRunnerBridge } from '../Bridge/testRunnerBridge.js';
import { closeTestRunner } from '../testState.js';
import { uiEventDispatcher } from '@UI/Controllers/uiEventDispatcher.js';

// Create logger for module
const logger = createLogger('UI/TestRunner/modules/ViewManager');

export class ViewManager {
    constructor() {
        this.outer = null;
        logger.info("ViewManager instance created");
    }

    async initialize() {
        logger.info("Starting initialization...");
        this.outer = this.createOuterArea();
        await this.setBackground();
        this.createCloseButton();
        logger.info("Initialization complete");
    }

    createOuterArea() {
        logger.info("Creating outer area...");
        let outer = document.getElementById("testRunnerOuterArea");
        if (!outer) {
            outer = document.createElement("div");
            outer.id = "testRunnerOuterArea";
            document.body.appendChild(outer);
            logger.info("New testRunnerOuterArea element created");
        } else {
            outer.innerHTML = "";
            logger.info("Existing testRunnerOuterArea element cleared");
        }

        Object.assign(outer.style, {
            width: "100vw",
            height: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#fdfaf6",
            position: "fixed",
            top: "0",
            left: "0",
            zIndex: "9999",
            overflow: "auto"
        });

        return outer;
    }

    async setBackground() {
        logger.info("Setting background...");
        // Use new bridge to get random background
        const bgImageResult = await testRunnerBridge.getBackground();
        if (bgImageResult && bgImageResult.success) {
            this.outer.style.backgroundImage = `url('${bgImageResult.path}')`;
            logger.info(`Background set: ${bgImageResult.path}`);
        } else {
            logger.info("Background not set, using default");
        }
        this.outer.style.backgroundSize = "cover";
        this.outer.style.backgroundPosition = "center";
        this.outer.style.backgroundRepeat = "no-repeat";
    }

    createCloseButton() {
        logger.info("Creating close button...");
        const closeButton = document.createElement("button");
        closeButton.id = "closeTestRunner";
        closeButton.textContent = "❌";
        
        // Add handler with close event via uiEventDispatcher
        closeButton.addEventListener("click", () => {
            logger.info("Test runner close button clicked");
            
            // Dispatch test runner close event
            try {
                uiEventDispatcher.dispatch(
                    uiEventDispatcher.events.TEST_RUNNER_CLOSE, 
                    { timestamp: Date.now() }
                );
                
                // Add small delay before closing
                setTimeout(() => {
                    try {
                        // Close test runner via controller
                        closeTestRunner();
                    } catch (innerError) {
                        logger.error(`Error closing test runner: ${innerError.message}`, innerError);
                    }
                }, 50);
            } catch (error) {
                logger.error(`Error closing test runner: ${error.message}`, error);
                // Fallback - just close test runner
                closeTestRunner();
            }
        });
        
        this.outer.appendChild(closeButton);
        logger.info("Close button created");
    }

    async setupLayout() {
        logger.info("Setting up layout...");
        let area = document.getElementById("questionArea") || document.createElement("div");
        area.id = "questionArea";
        this.outer.appendChild(area);

        Object.assign(area.style, {
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            margin: "auto"
        });

        setTimeout(this.logLayoutIssues, 50);
        logger.info("Layout configured");
    }

    logLayoutIssues() {
        logger.info("Checking layout...");
        const elements = ["#testRunnerOuterArea", "#questionArea", "#closeTestRunner"];

        elements.forEach(selector => {
            const el = document.querySelector(selector);
            if (!el) {
                logger.warn(`Element not found: ${selector}`);
                return;
            }
            
            const rect = el.getBoundingClientRect();
            const parent = el.parentElement?.getBoundingClientRect?.();

            if (parent) {
                const overflows =
                    rect.left < parent.left ||
                    rect.top < parent.top ||
                    rect.right > parent.right ||
                    rect.bottom > parent.bottom;

                if (overflows) {
                    logger.warn(`Overflow detected for ${selector}`);
                }
            }
        });
    }
} 