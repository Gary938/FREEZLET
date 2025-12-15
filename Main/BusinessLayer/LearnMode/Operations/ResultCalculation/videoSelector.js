// ResultCalculation/videoSelector.js - Result video selection

// CONFIG
const VIDEO_MAP = {
    1: 'UI/LearnMode/Assets/Content/Video/80%.mp4',
    2: ['UI/LearnMode/Assets/Content/Video/90%.mp4', 'UI/LearnMode/Assets/Content/Video/90%(2).mp4'],
    3: 'UI/LearnMode/Assets/Content/Video/100%.mp4'
};

const TRYAGAIN_VIDEO = 'UI/LearnMode/Assets/Content/Video/Tryagain.mp4';

// OPERATIONS
export const determineResultVideo = (passed, stars) => {
    if (!passed) return TRYAGAIN_VIDEO;
    
    const videoConfig = VIDEO_MAP[stars];
    if (!videoConfig) return null;
    
    return Array.isArray(videoConfig) ? 
        selectRandomVideo(videoConfig) : 
        videoConfig;
};

export const getVideoForOutcome = (outcome) => 
    determineResultVideo(outcome.passed, outcome.stars);

// HELPERS
const selectRandomVideo = (videoArray) => 
    videoArray[Math.floor(Math.random() * videoArray.length)]; 