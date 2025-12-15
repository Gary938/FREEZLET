// PacmanLogic/commandProcessing.js - Command processing and pacman state transformation

// IMPORTS
import { createUITracer } from '../../../Utils/uiTracer.js';
import { PACMAN_COMMANDS } from '../pacmanConfig.js';

// OPERATIONS
export const processPacmanCommand = (currentState, command) => {
    const tracer = createUITracer('commandProcessing');
    
    // Guard clauses
    if (!command?.action) {
        tracer.trace('processCommand:noAction');
        return currentState;
    }
    
    const processor = COMMAND_PROCESSORS[command.action];
    if (!processor) {
        tracer.trace('processCommand:unknownAction', { action: command.action });
        return currentState;
    }
    
    const newState = processor(currentState, command);
    tracer.trace('processCommand:success', { 
        action: command.action,
        oldPosition: currentState?.currentPosition,
        newPosition: newState?.currentPosition
    });
    
    return newState;
};

// CONFIG
const COMMAND_PROCESSORS = {
    [PACMAN_COMMANDS.MOVE]: (state, command) => ({
        ...state,
        currentPosition: state.currentPosition + 1,
        lastAction: command.action,
        lastQuestionId: command.questionId,
        isAnimating: true,
        updateTime: Date.now()
    }),
    
    [PACMAN_COMMANDS.STAY]: (state, command) => ({
        ...state,
        lastAction: command.action,
        lastQuestionId: command.questionId,
        stayReason: command.reason,
        updateTime: Date.now()
    }),
    
    [PACMAN_COMMANDS.INIT]: (state, command) => ({
        totalGhosts: command.totalGhosts,
        totalQuestions: command.totalQuestions,
        pagination: command.pagination,
        currentPage: command.currentPage || 0,
        currentPageData: command.currentPageData,
        currentPosition: 0,
        lastAction: command.action,
        isAnimating: false,
        createdTime: Date.now(),
        updateTime: Date.now()
    }),
    
    [PACMAN_COMMANDS.RESET]: (state, command) => ({
        ...state,
        currentPosition: 0,
        lastAction: command.action,
        isAnimating: false,
        resetTime: Date.now(),
        updateTime: Date.now()
    }),
    
    [PACMAN_COMMANDS.PAGE_SWITCH]: (state, command) => ({
        ...state,
        currentPage: command.newPageIndex,
        currentPageData: command.newPageData,
        totalGhosts: command.newPageData.ghostCount,
        currentPosition: 0,
        lastAction: command.action,
        pageSwitch: true,
        isAnimating: false,
        updateTime: Date.now()
    })
}; 