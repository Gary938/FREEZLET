// PacmanLogic/commandGeneration.js - Pacman command generation based on results

// IMPORTS
import { createUITracer } from '../../../Utils/uiTracer.js';
import { PACMAN_COMMANDS } from '../pacmanConfig.js';

// OPERATIONS
export const generatePacmanCommand = (result, questionId) => {
    const tracer = createUITracer('commandGeneration');
    
    // Guard clauses
    if (!result || typeof result !== 'string') {
        tracer.trace('generateCommand:invalidResult', { result });
        return null;
    }
    
    const commandGenerator = COMMAND_GENERATORS[result.toLowerCase()];
    if (!commandGenerator) {
        tracer.trace('generateCommand:unknownResult', { result });
        return null;
    }
    
    const generatedCommand = commandGenerator(questionId);
    tracer.trace('generateCommand:success', { 
        result, 
        action: generatedCommand.action 
    });
    
    return generatedCommand;
};

// CONFIG
const COMMAND_GENERATORS = {
    'correct': (questionId) => ({
        action: PACMAN_COMMANDS.MOVE,
        questionId: questionId || 'unknown',
        reason: 'correct_answer',
        timestamp: Date.now()
    }),
    
    'incorrect': (questionId) => ({
        action: PACMAN_COMMANDS.STAY,
        questionId: questionId || 'unknown',
        reason: 'incorrect_answer',
        timestamp: Date.now()
    })
}; 