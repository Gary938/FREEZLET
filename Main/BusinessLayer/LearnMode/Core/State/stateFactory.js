// State/stateFactory.js - Test state creation

import { trace } from '../../Utils/tracer.js';
import { getBlockSize } from '../../Config/stageConfig.js';

// TYPES
export const STATE_STATUS = {
    ACTIVE: 'active',
    COMPLETED: 'completed',
    ERROR: 'error'
};

// OPERATIONS
export const createTestState = (questions, stage) => {
    trace('createTestState', { questionsCount: questions.length, stage });
    
    return {
        ...createMeta(stage),
        ...createQuestionStructure(questions),
        ...createStatsStructure(),
        extensions: {}
    };
};

const createMeta = (stage) => ({
    id: generateStateId(),
    stage,
    status: STATE_STATUS.ACTIVE,
    meta: {
        startTime: Date.now(),
        blockCount: 0,
        blockSize: getBlockSize(stage)
    }
});

const createQuestionStructure = (questions) => {
    const shuffled = shuffleQuestions(questions);
    return {
        questions: {
            all: [...shuffled],
            remaining: [...shuffled],
            current: [],
            incorrect: []
        }
    };
};

const createStatsStructure = () => ({
    stats: {
        attempted: [],  // Array instead of Set for JSON serialization
        correct: [],    // Array instead of Set for JSON serialization
        perfectBlock: true
    }
});

// HELPERS
const generateStateId = () => 
    `test_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

const shuffleQuestions = (questions) => {
    const shuffled = [...questions];
    
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    
    return shuffled;
}; 