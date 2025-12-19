import { createLogger } from '@UI/Utils/loggerService.js';
import { uiEventDispatcher } from '@UI/Controllers/uiEventDispatcher.js';
import { getTestState } from '../testState.js';
import { closeTestRunner } from '../testState.js';
import { t } from '@UI/i18n/index.js';
import { ModalController } from '@UI/Controllers/Modal/modalController.js';

// Create logger for module
const logger = createLogger('UI/TestRunner/modules/ResultManager');

export class ResultManager {
    constructor() {
        this.area = null;
        
        // Bind test completion event handler method
        this.handleTestComplete = this.handleTestComplete.bind(this);
    }
    
    initialize() {
        logger.debug('Initializing ResultManager');
        
        // Subscribe to test completion event
        this.unsubscriber = uiEventDispatcher.subscribe(
            uiEventDispatcher.events.TEST_RUNNER_COMPLETE,
            this.handleTestComplete
        );
        
        logger.debug('ResultManager initialized');
    }
    
    /**
     * Test completion event handler
     * @param {CustomEvent} event - Test completion event
     */
    handleTestComplete(event) {
        const { correctCount, totalCount } = event.detail;
        logger.info(`Test completed: ${correctCount}/${totalCount} correct answers`);
        this.showFinalResult();
    }

    showFinalResult() {
        logger.info('Displaying test results');
        const state = getTestState();
        
        this.area = document.getElementById("questionArea");
        if (!this.area) {
            logger.error('Element for displaying results not found');
            return;
        }
        
        this.area.innerHTML = "";
        document.body.classList.add("showing-result");

        const score = this.calculateScore(state);
        logger.info(`Final result: ${score}%`);
        
        // Step 1: Display result
        this.renderScore(score);
        
        // Step 2: Display animation (if 100%)
        if (score === 100) {
            logger.info('Starting reward animation');
            this.showRewardAnimation();
        }
        
        // Step 3: Display buttons
        this.renderButtons(state);
    }

    calculateScore(state) {
        const score = Math.round((state.correctCount / state.totalCount) * 100);
        return score;
    }

    renderScore(score) {
        logger.debug(`Rendering result: ${score}%`);
        const result = document.createElement("h2");
        result.textContent = t('learnMode.yourResult', { score });
        result.className = "final-score";
        this.area.appendChild(result);
    }

    renderButtons(state) {
        logger.debug('Rendering action buttons');
        const buttonsWrap = document.createElement("div");
        buttonsWrap.className = "final-buttons";

        const closeBtn = document.createElement("button");
        closeBtn.textContent = t('buttons.close');
        closeBtn.className = "close-button";
        closeBtn.addEventListener("click", () => {
            logger.info('Close button clicked');
            
            try {
                // First dispatch test runner close event
                uiEventDispatcher.dispatch(
                    uiEventDispatcher.events.TEST_RUNNER_CLOSE, 
                    { timestamp: Date.now() }
                );
                
                // Small delay before calling close function
                setTimeout(() => {
                    try {
                        // Use existing test runner close function
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

        const retryBtn = document.createElement("button");
        retryBtn.textContent = t('buttons.retry');
        retryBtn.className = "retry-button";
        retryBtn.addEventListener("click", () => {
            logger.info('Test restart requested');
            
            try {
                // Get current test state
                const currentState = getTestState();
                const testPath = currentState.testPath;
                
                if (!testPath) {
                    logger.error('Error: test path not found in state');
                    ModalController.showNotification(t('error.title'), t('test.restartPathError'));
                    return;
                }
                
                logger.debug(`Restarting test: ${testPath}`);
                
                // First close current test runner, but keep path
                document.body.classList.remove("showing-result");
                const outerArea = document.getElementById('testRunnerOuterArea');
                if (outerArea) {
                    outerArea.remove();
                }
                
                // Add small delay before starting new test
                setTimeout(() => {
                    // Dispatch test restart event with correct path
                    uiEventDispatcher.dispatch(uiEventDispatcher.events.TEST_RUNNER_START, {
                        testPath: testPath,
                        restart: true,
                        timestamp: Date.now()
                    });
                }, 100);
            } catch (error) {
                logger.error(`Error restarting test: ${error.message}`, error);
                ModalController.showError(t('error.title'), t('test.restartError'));
            }
        });

        buttonsWrap.appendChild(closeBtn);
        buttonsWrap.appendChild(retryBtn);
        this.area.appendChild(buttonsWrap);
    }

    showRewardAnimation() {
        const rewardAnimation = document.createElement("div");
        rewardAnimation.id = "lottieReward";
        
        // Create video with golden wings animation
        const video = document.createElement("video");
        video.src = "UI/TestRunner/Assets/Content/Wings.mp4";
        video.autoplay = true;
        video.muted = true;
        video.playsInline = true;
        video.addEventListener("ended", () => {
            video.currentTime = 0;
        });
        
        rewardAnimation.appendChild(video);
        
        // Add animation right after result header
        this.area.appendChild(rewardAnimation);
        
        setTimeout(() => {
            rewardAnimation.style.opacity = 1;
        }, 100);
    }
    
    /**
     * Disables event handlers when component is destroyed
     */
    destroy() {
        if (this.unsubscriber) {
            this.unsubscriber();
            logger.debug('ResultManager unsubscribed from events');
        }
    }
} 