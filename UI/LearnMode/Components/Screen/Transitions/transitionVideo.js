// Components/Screen/Transitions/transitionVideo.js - Video management

// IMPORTS
import { createUITracer } from '../../../Utils/uiTracer.js';

// CONFIG
export const VIDEO_CONFIG = {
    NEXT_BLOCK_VIDEO_ID: 'nextBlockVideo'
};

// OPERATIONS
export const playNextBlockVideo = () => {
    const tracer = createUITracer('transitionVideo');
    const video = document.getElementById(VIDEO_CONFIG.NEXT_BLOCK_VIDEO_ID);
    
    if (!video) {
        tracer.trace('playVideo', { success: false, error: 'Video not found' });
        return false;
    }
    
    video.play().catch(error => {
        tracer.trace('playVideo', { success: false, error: error.message });
    });
    
    return true;
}; 