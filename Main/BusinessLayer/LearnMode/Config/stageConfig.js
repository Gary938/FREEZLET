// Config/stageConfig.js - Testing stage configuration
//
// ACCURACY FORMATS:
// - accuracyThreshold: coefficient (0-1), e.g. 0.8 = 80%
// - STARS_RULES.min: coefficient (0-1), e.g. 0.9 = 90%
// - getStarsForAccuracy(accuracy): accepts coefficient (0-1)
// - calculateProgress(stage, accuracy): accepts PERCENTAGES (0-100), converts internally

// CONFIG
// Stage 0: 5 questions, 80% → 1 star
// Stage 1: 10 questions, 90% → 2 stars
// Stage 2: 20 questions, 100% → 3 stars
export const STAGE_CONFIG = {
    0: { blockSize: 5, accuracyThreshold: 0.8, passPercentage: 80 },
    1: { blockSize: 10, accuracyThreshold: 0.9, passPercentage: 90 },
    2: { blockSize: 20, accuracyThreshold: 1.0, passPercentage: 100 },
    3: { blockSize: 20, accuracyThreshold: 1.0, passPercentage: 100 }
};

// OPERATIONS
export const getStageConfig = (stage) => 
    STAGE_CONFIG[stage] || STAGE_CONFIG[0];

export const getBlockSize = (stage) => 
    getStageConfig(stage).blockSize;

export const getAccuracyThreshold = (stage) => 
    getStageConfig(stage).accuracyThreshold;

// @param {number} accuracy - coefficient (0-1), e.g. 0.85 = 85%
// @param {number} stage - testing stage (0-3)
// @returns {number} number of stars (0-3)
// Logic: stars = stage + 1 when passing accuracyThreshold
export const getStarsForAccuracy = (accuracy, stage) => {
    const threshold = getAccuracyThreshold(stage);
    if (accuracy >= threshold) {
        return Math.min(stage + 1, 3);  // 0→1, 1→2, 2→3, 3→3
    }
    return 0;
};

export const isStageValid = (stage) => 
    stage >= 0 && stage <= 3;

// @param {number} stage - testing stage (0-3)
// @param {number} accuracy - PERCENTAGES (0-100), e.g. 85 = 85%
// @returns {object} { stage, accuracy, stars, passed }
// IMPORTANT: Internally divides accuracy by 100 for getStarsForAccuracy()
export const calculateProgress = (stage, accuracy) => ({
    stage,
    accuracy: Math.round(accuracy * 100) / 100,
    stars: getStarsForAccuracy(accuracy / 100, stage),  // conversion % → coefficient
    passed: (accuracy / 100) >= getAccuracyThreshold(stage)  // conversion % → coefficient
}); 