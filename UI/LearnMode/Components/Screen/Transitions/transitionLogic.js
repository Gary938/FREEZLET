// Components/Screen/Transitions/transitionLogic.js - Main component logic

// IMPORTS
import { createUITracer } from '../../../Utils/uiTracer.js';
import { createBlockTransition } from './transitionRenderer.js';
import { playNextBlockVideo } from './transitionVideo.js';
import { attachNextBlockHandler, removeNextBlockHandler } from './transitionHandlers.js';

// CONFIG
export const LOGIC_CONFIG = {
    AUTO_ADVANCE_DELAY: 1600,
    TARGET_AREA_ID: 'hybridQuestionArea'
};

// OPERATIONS
export const createTransitionComponent = (transitionData, controllerAPI = null) => {
    const tracer = createUITracer('transitionLogic');
    const componentCreateTime = Date.now();
    
    const transitionElement = createBlockTransition(transitionData);
    let transitionCompleted = false;
    let autoAdvanceTimer = null;
    
    const handleTransitionContinue = (source = 'unknown') => {
        if (transitionCompleted) return;

        transitionCompleted = true;

        if (source === 'button' && autoAdvanceTimer) {
            clearTimeout(autoAdvanceTimer);
        }

        if (controllerAPI && transitionData?.nextQuestion) {
            // Check mode to use correct action type
            const actionType = controllerAPI.options?.mode === 'write'
                ? 'NEW_WRITE_QUESTION'
                : 'NEW_QUESTION';

            tracer.trace('transitionComplete', {
                source,
                nextQuestionId: transitionData.nextQuestion.id,
                duration: Date.now() - componentCreateTime,
                actionType
            });
            controllerAPI.handleUserAction(actionType, transitionData.nextQuestion);
        }
    };
    
    const component = {
        element: transitionElement,
        
        render: () => {
            const targetArea = document.getElementById(LOGIC_CONFIG.TARGET_AREA_ID);
            if (!targetArea) {
                tracer.trace('render', { success: false, error: 'Target area not found' });
                return false;
            }
            
            targetArea.innerHTML = '';
            targetArea.appendChild(transitionElement);
            
            setTimeout(() => {
                const videoStarted = playNextBlockVideo();
                const buttonHandler = () => handleTransitionContinue('button');
                const buttonAttached = attachNextBlockHandler(buttonHandler);
                
                if (!videoStarted || !buttonAttached) {
                    tracer.trace('setup', { 
                        success: false, 
                        videoStarted, 
                        buttonAttached 
                    });
                }
                
                autoAdvanceTimer = setTimeout(() => {
                    if (!transitionCompleted) {
                        handleTransitionContinue('auto');
                    }
                }, LOGIC_CONFIG.AUTO_ADVANCE_DELAY);
                
            }, 0);
            
            return true;
        },
        
        cleanup: () => {
            if (autoAdvanceTimer) {
                clearTimeout(autoAdvanceTimer);
            }
            removeNextBlockHandler();
        },
        
        updateData: (newData) => {
            return component;
        }
    };
    
    tracer.trace('createTransitionComponent', { 
        success: true, 
        createTime: componentCreateTime 
    });
    
    return component;
}; 