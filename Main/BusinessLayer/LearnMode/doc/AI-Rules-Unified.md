# Unified AI Development Rules for LearnMode

## 🎯 Core Principle
**AI must understand a module in 8 seconds, a function in 5 seconds**

**Golden Rule:** *Code should read like technical documentation, not like a program*

## 📏 Unified Size Rules

### Module: 20-120 lines (exception: index.js files have no minimum)
```javascript
// ✅ INDEX FILES - no minimum limit
// Operations/AnswerProcessing/index.js - 15 lines ✅
// FileSystem/index.js - 10 lines ✅

// ✅ MINIMAL - 23 lines
// Operations/PacmanIntegration/pacmanInitializer.js

// ✅ PERFECT - 67 lines
// Utils/tracer.js, Config/stageConfig.js

// ✅ GOOD - 85 lines  
// Interactive/Pacman/index.js after refactoring

// ✅ ACCEPTABLE - 110 lines
// Complex modules with multiple logic pieces

// ❌ BAD - >150 lines
// Requires splitting into submodules
```

**Exception:** index.js files are centralized export points and can be any size from 5+ lines. Their purpose is only to export functions from other modules, so they don't need to meet the 20-line minimum.

### Function: 8-18 lines
```javascript
// ✅ PERFECT - 10 lines
export const validateTestState = (state) => {
    // Guard clauses first
    if (!state) {
        return createError('NO_ACTIVE_TEST', 'No active test');
    }
    if (!state.questions?.all) {
        return createError('INVALID_STATE', 'Invalid test state');
    }
    return null;
};

// ✅ GOOD - 15 lines with helper functions
// ✅ ACCEPTABLE - 18 lines for complex logic
// ❌ BAD - >20 lines (split into parts)
```

## 🏗️ Unified Module Structure

**Golden Rule:** *Add sections only when they provide real value. Don't add empty sections just to follow structure.*

```javascript
// ModuleName.js - Brief description

// 1. IMPORTS (always present)
import { utils } from '../Core/';

// 2. CONFIG (only when module has validation/limits/constants)
export const CONFIG = {
    MAX_ATTEMPTS: 3,        // Real validation limit
    TIMEOUT: 5000,          // Real timeout constant  
    BLOCK_SIZES: [5, 10, 20, 20]  // Real configuration data
};

// 3. TYPES (only when module defines/uses specific types)
export const TYPES = {
    CORRECT: 'correct',
    INCORRECT: 'incorrect'
};

// 4. OPERATIONS (always present - main exported functions)
export const processData = (input) => {
    // Guard clauses first
    if (!input) return createError('NO_INPUT');
    
    return createSuccess(transformData(input));
};

// 5. HELPERS (only when module has reusable private functions)
const transformData = (data) => ({ ...data, processed: true });
```

## 🎯 CONFIG Section Guidelines

### ✅ When CONFIG is NEEDED:
```javascript
// pacmanInitializer.js - Has validation limits
export const PACMAN_INIT_CONFIG = {
    MIN_QUESTIONS: 1,
    MAX_QUESTIONS: 50,
    ERROR_CODES: { NO_QUESTIONS: 'NO_QUESTIONS' }
};

// sessionSetup.js - Has real constants
export const CONFIG = {
    DEFAULT_SESSION_TIMEOUT: 3600000,
    MIN_STAGE: 0,
    MAX_STAGE: 3
};

// stageConfig.js - Has configuration tables
export const STAGE_CONFIG = {
    0: { blockSize: 5, threshold: 0.8 },
    1: { blockSize: 10, threshold: 0.8 }
};
```

### ❌ When CONFIG is NOT needed:
```javascript
// answerLogic.js - Just coordinates other functions
// ❌ DON'T ADD: export const CONFIG = { /* empty or artificial */ };

// learnModeCore.js - Just routes calls to services  
// ❌ DON'T ADD: export const CONFIG = { /* duplicates other configs */ };

// questionBuilder.js - Just formats data
// ❌ DON'T ADD: export const CONFIG = { /* no real constants */ };
```

**Rule:** *Add CONFIG only when module actually validates, limits, or configures something. Don't add artificial CONFIG sections just to follow structure.*

## 📋 All Section Guidelines

### 1. IMPORTS - Always present
```javascript
// ✅ Always needed - every module imports something
import { createError } from '../Core/errorHandler.js';
import { trace } from '../Utils/tracer.js';
```

### 2. CONFIG - Only when needed
```javascript
// ✅ NEEDED: Module validates/limits/configures
export const VALIDATION_CONFIG = {
    MIN_LENGTH: 3,
    MAX_RETRIES: 5,
    ERROR_CODES: { INVALID: 'INVALID_INPUT' }
};

// ❌ NOT NEEDED: Module just coordinates/routes/formats
// Don't add artificial CONFIG in coordinators like answerLogic.js
```

### 3. TYPES - Only when module defines types
```javascript
// ✅ NEEDED: Module works with specific types/enums
export const ANSWER_TYPES = {
    CORRECT: 'correct',
    INCORRECT: 'incorrect',
    SKIPPED: 'skipped'
};

// ❌ NOT NEEDED: Module uses types from other modules
// Don't duplicate ANSWER_TYPES if importing from responseTypes.js
```

### 4. OPERATIONS - Always present
```javascript
// ✅ Always needed - main exported functions
export const processAnswer = (state, answer) => {
    // Main module logic
};

// Every module must have at least one exported operation
```

### 5. HELPERS - Only when needed
```javascript
// ✅ NEEDED: Module has reusable private functions
const validateInput = (input) => input?.length > 0;
const formatOutput = (data) => ({ ...data, formatted: true });

// ❌ NOT NEEDED: Module has only one-line utilities or no private functions
// Don't add helpers like: const isValid = (x) => !!x;
```

### 📊 Section Decision Matrix

| Module Type | CONFIG | TYPES | HELPERS | Example |
|-------------|--------|-------|---------|---------|
| **Validator** | ✅ Yes | ✅ Yes | ✅ Yes | `pacmanInitializer.js` |
| **Coordinator** | ❌ No | ❌ No | ❌ No | `answerLogic.js` |
| **Router** | ❌ No | ❌ No | ❌ No | `learnModeCore.js` |
| **Formatter** | ❌ No | ❌ No | ✅ Maybe | `questionBuilder.js` |
| **Calculator** | ✅ Maybe | ✅ Maybe | ✅ Yes | `resultCalculator.js` |

**Golden Rule:** *Minimal sections = faster AI understanding. Add only what provides real value.*

## ✅ MANDATORY Practices

### 1. Immutable operations only
```javascript
// ✅ AI doesn't need to track side effects
const newState = { ...state, updated: true };
const newArray = [...items, newItem];
const filtered = items.filter(item => item.active);

// ❌ AI must remember what changed
state.updated = true; // mutation!
items.push(newItem); // mutation!
items.splice(0, 1); // mutation!
```

### 2. Guard clauses instead of if-else
```javascript
// ✅ AI understands instantly
export const processAnswer = (state, answer) => {
    // Early returns for validation
    if (!state) return createError('NO_STATE');
    if (!answer) return createError('NO_ANSWER');
    
    return executeLogic(state, answer);
};

// ❌ AI wastes time parsing nested logic  
export const processAnswer = (state, answer) => {
    if (state) {
        if (answer) {
            return executeLogic(state, answer);
        } else {
            return createError('NO_ANSWER');
        }
    } else {
        return createError('NO_STATE');
    }
};
```

### 3. Table-based configuration
```javascript
// ✅ AI sees all logic at once
export const STAGE_CONFIG = {
    0: { blockSize: 5, threshold: 0.8 },
    1: { blockSize: 10, threshold: 0.8 },
    2: { blockSize: 20, threshold: 0.9 }
};

// Usage with table lookup
const getStageConfig = (stage) => STAGE_CONFIG[stage] || STAGE_CONFIG[0];

// ❌ AI must analyze conditions
if (stage === 0) return { blockSize: 5, threshold: 0.8 };
if (stage === 1) return { blockSize: 10, threshold: 0.8 };
```

### 4. Standard response formats
```javascript
// ✅ AI knows what to expect everywhere
export const createSuccess = (type, data) => ({
    success: true,
    type,
    data,
    timestamp: Date.now()
});

export const createError = (code, message) => ({
    success: false,
    error: { code, message },
    timestamp: Date.now()
});

// Usage pattern everywhere:
if (!validation.success) return validation;
```

### 5. Minimal tracing
```javascript
// ✅ Sufficient for debugging
export const trace = (operation, data) => 
    mainLogger.trace('ModuleName', { operation, ...data });

// ❌ Code pollution
logger.debug('Starting processing...');
logger.info('Intermediate result received');
logger.warn('Warning: non-standard situation');
```

### 6. Centralized exports
```javascript
// AnswerProcessing/index.js - Central export point
export { processAnswer, validateAnswer } from './answerValidation.js';
export { executeLogic, createResult } from './answerLogic.js';
export { updateState, clearState } from './stateUpdater.js';
```

## ❌ FORBIDDEN Practices

### 1. Deep nesting (>3 levels)
```javascript
// ❌ AI gets lost
if (state) {
    if (state.questions) {
        if (state.questions.current) {
            if (state.questions.current.length > 0) {
                // logic buried too deep
            }
        }
    }
}

// ✅ Flat structure with guard clauses
if (!state?.questions?.current?.length) return handleEmpty();
return processQuestions(state.questions.current);
```

### 2. Monster functions (>20 lines)
### 3. Multiple responsibilities in one function
### 4. Multi-level try-catch blocks
### 5. Implicit dependencies and side effects
### 6. Emoji and meta-comments in code

## 🚀 Special Patterns for AI

### Validation pipeline
```javascript
const validateInput = (checks) => {
    // Process all checks sequentially
    for (const check of checks) {
        if (check.error) return check;
    }
    return null; // all validations passed
};

export const processWithValidation = (input) => {
    const validation = validateInput([
        validateRequired(input),
        validateFormat(input),
        validateBusinessRules(input)
    ]);
    
    if (validation) return validation;
    return executeProcessing(input);
};
```

### Functional flows
```javascript
export const submitAnswer = async (answer) => {
    // Sequential pipeline with early returns
    const state = getCurrentState();
    const validation = validateInput(state, answer);
    if (validation) return validation;
    
    const result = processAnswer(state, answer);
    if (!result.success) return result;
    
    return formatResponse(result.data);
};
```

### Configuration rules
```javascript
export const VALIDATION_RULES = {
    QUESTION_ID: { required: true, minLength: 1 },
    TEST_PATH: { required: true, minLength: 3 },
    ANSWER_INDEX: { required: true, min: 0, max: 3 }
};

export const BUSINESS_RULES = {
    MIN_ACCURACY_TO_PASS: 0.6,
    MAX_ATTEMPTS_PER_QUESTION: 3,
    STAGE_PROGRESSION: {
        0: { nextAt: 0.8, blockSize: 5 },
        1: { nextAt: 0.8, blockSize: 10 },
        2: { nextAt: 0.9, blockSize: 20 }
    }
};
```

## 🎮 LearnMode Specific Patterns

### Test state creation
```javascript
export const createTestState = (questions, stage) => ({
    // Meta information
    meta: {
        testId: generateId(),
        stage,
        startTime: Date.now()
    },
    
    // Configuration for current stage  
    config: {
        blockSize: STAGE_RULES[stage].blockSize,
        accuracyThreshold: STAGE_RULES[stage].accuracy
    },
    
    // Question management
    questions: {
        all: questions,
        current: [],
        remaining: [...questions],
        incorrect: []
    },
    
    // Statistics tracking
    stats: {
        attempted: new Set(),
        correct: 0,
        total: 0,
        firstTimeShown: new Set()
    }
});
```

### Answer handlers (table-based logic)
```javascript
export const ANSWER_HANDLERS = {
    [TYPES.CORRECT]: (state, questionId) => ({
        operations: [
            removeFromCurrentBlock,
            addToCorrectStats,
            updateProgress
        ],
        command: createMoveCommand(questionId),
        nextAction: 'continue'
    }),
    
    [TYPES.INCORRECT]: (state, questionId) => ({
        operations: [
            removeFromCurrentBlock,
            addToIncorrectQuestions,
            markAsAttempted
        ],
        command: createStayCommand(questionId),
        nextAction: 'retry'
    })
};

// Usage
export const handleAnswer = (state, questionId, result) => {
    const handler = ANSWER_HANDLERS[result];
    if (!handler) return createError('UNKNOWN_RESULT', result);
    
    return executeHandler(handler, state, questionId);
};
```

### Error handling
```javascript
export const safeExecute = (operation, context) => {
    try {
        const result = operation();
        return result.success ? result : formatError(result.error, context);
    } catch (error) {
        return formatError(error.message, context);
    }
};

const formatError = (message, context) => ({
    success: false,
    error: {
        code: 'EXECUTION_ERROR',
        message,
        context,
        timestamp: Date.now()
    }
});
```

## 🎯 Quality Checklist

### AI understands module in 8 seconds if:
- [ ] Size 20-120 lines
- [ ] Functions 8-18 lines
- [ ] Only immutable operations
- [ ] Guard clauses in every function
- [ ] CONFIG section at file start
- [ ] Standard success/error responses
- [ ] No deep nesting (≤3 levels)
- [ ] Function names describe actions
- [ ] Code comments in English
- [ ] Centralized exports in index.js

### If AI takes >12 seconds:
1. Split module into parts (>120 lines)
2. Combine micro-modules into larger ones (<20 lines)
3. Simplify conditional logic (guard clauses)
4. Extract configuration to constants
5. Remove redundant comments
6. Create helper functions for complex logic

## 📊 Quality Metrics

| Module Type | Target Time | Rating |
|-------------|-------------|--------|
| Config files | 3-5 seconds | ⚡ Instant |
| Helper modules | 4-6 seconds | ⚡ Very fast |
| Operations modules | 6-8 seconds | ✨ Fast |
| Complex modules | 8-12 seconds | ✅ Acceptable |

## 💡 Principle of Maximum Understanding

**"If AI cannot instantly understand code - the code needs simplification"**

Every line should bring closer to understanding business logic, not complicate with technical details.

### Priorities when writing code:
1. **Clarity** > performance
2. **Simplicity** > elegance  
3. **Explicitness** > brevity
4. **Predictability** > flexibility

**Code for AI is code for humans, multiplied by understanding speed.** 