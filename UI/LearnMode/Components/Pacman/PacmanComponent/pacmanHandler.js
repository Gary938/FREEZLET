// PacmanComponent/pacmanHandler.js - Pacman command and answer handler

// IMPORTS
import { createUITracer } from '../../../Utils/uiTracer.js';
import { 
    generatePacmanCommand, 
    processPacmanCommand,
    shouldSwitchPage,
    getNextPageData
} from '../PacmanLogic/index.js';
import { animatePacmanMovement } from '../Effects/index.js';
import { rerenderPageContent } from '../PacmanRenderer/index.js';
import { extractCurrentState, saveStateToContainer } from './pacmanState.js';
import { PACMAN_COMMANDS } from '../pacmanConfig.js';

// OPERATIONS
export const handleAnswerResult = (component, result, questionId) => {
    const tracer = createUITracer('pacmanComponent');
    
    // Guard clauses
    if (!component || !result) {
        tracer.trace('handleAnswer:invalidParams');
        return false;
    }
    
    const command = generatePacmanCommand(result, questionId);
    if (!command) {
        tracer.trace('handleAnswer:noCommand', { result });
        return false;
    }
    
    const success = component.processCommand(command);
    tracer.trace('handleAnswer:processed', { result, success });
    
    return success;
};

export const processPacmanCommandInComponent = (container, command, onComplete) => {
    const tracer = createUITracer('pacmanComponent');
    
    // Guard clauses
    if (!container || !command) return false;
    
    const currentState = extractCurrentState(container);
    if (!currentState) return false;
    
    // DEBUG: log state before processing
    tracer.trace('processCommand:stateBeforeProcessing', {
        currentPosition: currentState.currentPosition,
        hasPagination: !!currentState.pagination,
        needsPagination: currentState.pagination?.needsPagination,
        currentPage: currentState.currentPage,
        currentPageData: currentState.currentPageData
    });
    
    const newState = processPacmanCommand(currentState, command);
    
    // NEW LOGIC: check page switch on movement
    if (command.action === PACMAN_COMMANDS.MOVE && newState.pagination?.needsPagination) {
        const shouldSwitch = shouldSwitchPage(newState.currentPosition, newState.currentPageData);
        
        tracer.trace('processCommand:pageSwitchCheck', {
            shouldSwitch,
            currentPosition: newState.currentPosition,
            currentPageGhosts: newState.currentPageData?.ghostCount,
            currentPage: newState.currentPage
        });
        
        if (shouldSwitch) {
            const nextPageData = getNextPageData(newState.pagination, newState.currentPage);
            
            if (nextPageData) {
                tracer.trace('processCommand:pageSwitchTriggered', {
                    fromPage: newState.currentPage,
                    toPage: nextPageData.pageIndex,
                    position: newState.currentPosition
                });
                
                // Create page switch command
                const pageSwitchCommand = {
                    action: PACMAN_COMMANDS.PAGE_SWITCH,
                    newPageIndex: nextPageData.pageIndex,
                    newPageData: nextPageData
                };
                
                // Process switch
                const pageState = processPacmanCommand(newState, pageSwitchCommand);
                
                // Save new state
                saveStateToContainer(container, pageState);
                
                // Re-render DOM for new page
                rerenderPageContent(container, pageState);
                
                // Call callback if exists
                if (onComplete) onComplete();
                
                tracer.trace('processCommand:pageSwitchComplete', {
                    newPage: pageState.currentPage,
                    newGhostCount: pageState.currentPageData.ghostCount
                });
                
                return true;
            }
        }
    }
    
    // Save state for regular commands
    saveStateToContainer(container, newState);
    
    // Regular movement without page switch
    if (command.action === PACMAN_COMMANDS.MOVE) {
        animatePacmanMovement(container, newState, onComplete);
    }
    
    tracer.trace('processCommandInComponent:success', { 
        action: command.action 
    });
    
    return true;
}; 