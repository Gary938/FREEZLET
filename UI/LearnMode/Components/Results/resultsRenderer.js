// Components/Results/resultsRenderer.js - Results rendering

// IMPORTS
import { createUITracer } from '../../Utils/uiTracer.js';
import { createFinalButtons } from './resultsButtons.js';

// CONFIG
export const RENDERER_CONFIG = {
    FINAL_CONTAINER_ID: 'finalResults',  
    FINAL_CONTAINER_CLASS: 'final-results-container',
    FINAL_VIDEO_CLASS: 'final-video',
    MODAL_STARS_CLASS: 'modal-stars',
    MODAL_ACCURACY_CLASS: 'modal-accuracy'
};

// OPERATIONS
export const renderResultsToDOM = (container) => {
    const tracer = createUITracer('resultsRenderer');
    tracer.trace('renderResultsToDOM', { hasContainer: !!container });
    
    // Guard clauses
    if (!container) return false;
    
    const questionArea = document.getElementById('hybridQuestionArea');
    if (!questionArea) return false;
    
    questionArea.innerHTML = '';
    questionArea.appendChild(container);
    return true;
};

export const createResultsDisplay = (resultsData) => {
    const tracer = createUITracer('resultsRenderer');
    tracer.trace('createDisplay', { 
        accuracy: resultsData?.accuracy,
        passed: resultsData?.passed 
    });
    
    // Guard clauses
    if (!resultsData) return null;
    
    const finalContainer = createFinalContainer(resultsData);
    return {
        element: finalContainer,
        render: () => renderResultsToDOM(finalContainer),
        cleanup: () => cleanupResults(finalContainer)
    };
};

// HELPERS
const createFinalContainer = (resultsData) => {
    const tracer = createUITracer('resultsRenderer');
    const {
        accuracy = 0,
        stars = 0,
        resultVideo = null,
        passed = false,
        nextStage = null,
        currentStage = null
    } = resultsData;

    // Diagnostics: log what we received
    tracer.trace('createFinalContainer', {
        accuracy, stars, passed, resultVideo,
        starsType: typeof stars,
        rawStars: resultsData.stars
    });

    const finalContainer = document.createElement('div');
    finalContainer.id = RENDERER_CONFIG.FINAL_CONTAINER_ID;
    finalContainer.className = RENDERER_CONFIG.FINAL_CONTAINER_CLASS;
    
    // Result video
    if (resultVideo) {
        const video = createResultVideo(resultVideo);
        finalContainer.appendChild(video);
    }
    
    // Stars
    const starsDiv = createStarsDisplay(stars);
    finalContainer.appendChild(starsDiv);
    
    // Accuracy
    const accuracyDiv = createAccuracyDisplay(accuracy);
    finalContainer.appendChild(accuracyDiv);
    
    // Control buttons
    const buttonsContainer = createFinalButtons(passed, nextStage, currentStage);
    finalContainer.appendChild(buttonsContainer);
    
    return finalContainer;
};

const createResultVideo = (videoSrc) => {
    const video = document.createElement('video');
    video.className = RENDERER_CONFIG.FINAL_VIDEO_CLASS;
    video.src = videoSrc;
    video.autoplay = true;
    video.muted = true;
    video.setAttribute('playsinline', '');
    return video;
};

const createStarsDisplay = (stars) => {
    const starsDiv = document.createElement('div');
    starsDiv.className = RENDERER_CONFIG.MODAL_STARS_CLASS;

    // Protection from undefined/NaN: parseInt + fallback to 0
    const starCount = Math.max(0, Math.min(3, parseInt(stars) || 0));
    const emptyStars = Math.max(0, 3 - starCount);
    starsDiv.innerHTML = '★'.repeat(starCount) + '☆'.repeat(emptyStars);

    return starsDiv;
};

const createAccuracyDisplay = (accuracy) => {
    const accuracyDiv = document.createElement('div');
    accuracyDiv.className = RENDERER_CONFIG.MODAL_ACCURACY_CLASS;
    accuracyDiv.textContent = `${accuracy.toFixed(2)}%`;
    return accuracyDiv;
};

const cleanupResults = (container) => {
    if (container?.parentNode) {
        container.parentNode.removeChild(container);
    }
}; 