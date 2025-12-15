// AnswerProcessing/answerLogic.js - Main answer processing logic

import { ANSWER_TYPES } from '../../Config/responseTypes.js';
import { createSuccessResult } from '../../Core/errorHandler.js';
import { getCurrentQuestion, isBlockCompleted, isTestCompleted } from '../../Core/State/stateQueries.js';
import { setPendingExample } from '../../Core/stateManager.js';
import { trace } from '../../Utils/tracer.js';

// OPERATIONS
export const executeAnswerLogic = (state, question, isCorrect, isFirstAttempt) => {
    const stateWithExamples = processQuestionExamples(state, question);
    
    return createAnswerResult(stateWithExamples, question, isCorrect, isFirstAttempt);
};

export const processQuestionExamples = (state, question) => {
    if (!question.examples?.length) return state;
    
    const randomExample = selectRandomExample(question.examples);
    setPendingExample(randomExample);
    trace('exampleSelected', { selectedExample: randomExample, questionId: question.id });
    
    return state;
};

export const createAnswerResult = (state, question, isCorrect, isFirstAttempt) => {
    const result = {
        questionId: question.id,
        isCorrect,
        isFirstAttempt,
        blockCompleted: isBlockCompleted(state),
        testCompleted: isTestCompleted(state),
        updatedState: state
    };
    
    // Log only brief info without full state
    const logData = {
        questionId: question.id,
        isCorrect,
        isFirstAttempt,
        blockCompleted: result.blockCompleted,
        testCompleted: result.testCompleted,
        // Brief state info instead of full object
        stateInfo: {
            id: state.id,
            stage: state.stage,
            questionsRemaining: state.questions.current.length,
            totalQuestions: state.questions.all.length,
            perfectBlock: state.stats.perfectBlock
        }
    };
    
    trace('answerProcessed', logData);
    return createSuccessResult(result);
};

export const determineAnswerType = (answer) => 
    answer === ANSWER_TYPES.CORRECT;

export const getCurrentQuestionId = (state) => {
    const question = getCurrentQuestion(state);
    return question?.id || null;
};

export const getAnswerSummary = (state, questionId, isCorrect) => ({
    questionId,
    isCorrect,
    totalAttempted: state.stats.attempted.length,  // .length instead of .size
    totalCorrect: state.stats.correct.length,      // .length instead of .size
    accuracy: calculateCurrentAccuracy(state),
    perfectBlock: state.stats.perfectBlock
});

// HELPERS
const selectRandomExample = (examples) => {
    const randomIndex = Math.floor(Math.random() * examples.length);
    return examples[randomIndex];
};

const calculateCurrentAccuracy = (state) =>
    state.stats.attempted.length > 0 ?                         // .length instead of .size
        state.stats.correct.length / state.stats.attempted.length : 0; 