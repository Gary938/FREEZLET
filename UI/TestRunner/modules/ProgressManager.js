// UI/TestRunner/modules/ProgressManager.js
// Test progress management module

import { createLogger } from '@UI/Utils/loggerService.js';
import { uiEventDispatcher } from '@UI/Controllers/uiEventDispatcher.js';

// Create logger for module
const logger = createLogger('UI/TestRunner/modules/ProgressManager');

export class ProgressManager {
    constructor() {
        this.progressBar = null;
        this.progressFill = null;
        
        // Bind progress update event handler method
        this.handleProgressUpdated = this.handleProgressUpdated.bind(this);
    }

    initialize() {
        logger.debug('Initializing ProgressManager');
        this.createProgressBar();
        
        // Subscribe to progress update event
        this.unsubscriber = uiEventDispatcher.subscribe(
            uiEventDispatcher.events.TEST_RUNNER_PROGRESS_UPDATED,
            this.handleProgressUpdated
        );
        
        logger.debug('ProgressManager initialized');
    }

    /**
     * Progress update event handler
     * @param {CustomEvent} event - Progress update event
     */
    handleProgressUpdated(event) {
        const { current, total } = event.detail;
        this.updateProgress(current, total);
    }

    createProgressBar() {
        logger.debug('Creating progress indicator');
        const outer = document.getElementById("testRunnerOuterArea");
        
        this.progressBar = document.createElement("div");
        this.progressBar.id = "progressBar";
        this.progressBar.style.cssText = `
            position: fixed;
            right: 20px;
            top: 50%;
            transform: translateY(-50%);
            width: 10px;
            height: 200px;
            background: rgba(0, 0, 0, 0.1);
            border-radius: 5px;
            overflow: hidden;
        `;

        this.progressFill = document.createElement("div");
        this.progressFill.id = "progressFill";
        this.progressFill.style.cssText = `
            width: 100%;
            height: 0%;
            background: #4CAF50;
            transition: height 0.3s ease;
        `;

        this.progressBar.appendChild(this.progressFill);
        outer.appendChild(this.progressBar);
        logger.debug('Progress indicator created');
    }

    updateProgress(current, total) {
        if (!this.progressFill || !total) {
            logger.warn('Cannot update progress: element not found or total=0');
            return;
        }
        
        const percent = (current / total) * 100;
        this.progressFill.style.height = `${percent}%`;
        logger.debug(`Progress updated: ${percent.toFixed(1)}% (${current}/${total})`);
    }
    
    /**
     * Disables event handlers when component is destroyed
     */
    destroy() {
        if (this.unsubscriber) {
            this.unsubscriber();
            logger.debug('ProgressManager unsubscribed from events');
        }
    }
} 