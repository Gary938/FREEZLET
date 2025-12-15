// Flows/completion.js - Test and block completion flows

import { calculateFinalResults } from '../Operations/ResultCalculation/index.js';
import { buildCompletionResponse, buildNextBlockResponse } from '../Core/ResponseBuilder/index.js';
import { clearState, getCurrentPath, updateCurrentState } from '../Core/stateManager.js';
import { formNextBlock, getNextQuestion } from '../Operations/BlockManagement/index.js';
import { saveTestResults } from '../DB/testProgress.js';
import { trace } from '../Utils/tracer.js';
import { triggerBackgroundChange } from '../Interactive/Background/index.js';

// OPERATIONS
export const completeTest = async (state) => {
    trace('handleTestCompletion');

    const testPath = getCurrentPath();
    const resultsData = calculateFinalResults(state, testPath);
    if (!resultsData.success) return resultsData;

    // Save and get final data (stars/stage after rollback on FAIL)
    const saveResult = await saveTestResults(resultsData.data, testPath);

    // Update resultsData with final stars/stage (so UI shows same as menu)
    if (saveResult.success) {
        resultsData.data.stars = saveResult.data.stars;
        resultsData.data.stage = saveResult.data.stage;
        trace('starsUpdatedForUI', {
            originalStars: resultsData.data.stars,
            finalStars: saveResult.data.stars
        });
    }

    const clearedInfo = clearState();
    
    // 🎯 Background on test completion with perfect last block
    const extensions = { testId: clearedInfo.id };
    if (state.stats.perfectBlock) {
        const backgroundResult = await triggerBackgroundChange();
        if (backgroundResult.success) {
            extensions.background = {
                currentPath: backgroundResult.data.backgroundPath,  // ← UI expects currentPath!
                mode: backgroundResult.data.mode,
                reason: 'test_completion'
            };
            trace('backgroundTriggeredOnCompletion', { path: backgroundResult.data.backgroundPath, mode: backgroundResult.data.mode });
        }
    }
    
    return buildCompletionResponse(resultsData.data, extensions);
};

export const completeBlock = async (state) => {
    trace('handleBlockCompletion');
    
    const nextBlockResult = formNextBlock(state);
    if (!nextBlockResult.success) return nextBlockResult;
    
    const { hasNextBlock, testCompleted, updatedState } = nextBlockResult.data;
    
    if (updatedState) {
        updateCurrentState(updatedState);
    }
    
    if (testCompleted || !hasNextBlock) {
        return await completeTest(updatedState || state);
    }
    
    // 🎯 Background on perfect block completion
    const extensions = {};
    if (state.stats.perfectBlock) {
        const backgroundResult = await triggerBackgroundChange();
        if (backgroundResult.success) {
            extensions.background = {
                currentPath: backgroundResult.data.backgroundPath,  // ← UI expects currentPath!
                mode: backgroundResult.data.mode,
                reason: 'perfect_block'
            };
            trace('backgroundTriggered', { path: backgroundResult.data.backgroundPath, mode: backgroundResult.data.mode });
        }
    }
    
    const nextQuestion = getNextQuestion(updatedState || state);
    const blockInfo = buildBlockInfo(updatedState || state, nextBlockResult.data);
    
    return buildNextBlockResponse(nextQuestion, blockInfo, extensions);
};

// HELPERS
const buildBlockInfo = (state, blockData) => ({
    blockNumber: blockData.blockNumber || state.meta.blockCount,
    totalBlocks: Math.ceil(state.questions.all.length / 5),
    perfectBlock: state.stats.perfectBlock || false
}); 