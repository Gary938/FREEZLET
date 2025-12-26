// UI/Controllers/PromptBuilder/promptGeneratorService.js
// Service for generating AI prompts for test creation

/**
 * Generates a prompt for AI to create a test
 * @param {Object} config - Configuration object
 * @param {string} config.topic - Test topic/theme
 * @param {string} config.additional - Additional instructions
 * @param {number} config.questionsCount - Number of questions
 * @param {boolean} config.includeExamples - Whether to include examples
 * @param {number} config.examplesCount - Number of examples per question
 * @param {number} config.optionsCount - Number of answer options (4 or 6)
 * @param {string} config.outputType - Output type ('file' or 'clipboard')
 * @returns {string} Generated prompt
 */
export function generatePrompt(config) {
  const {
    topic = '',
    additional = '',
    questionsCount = 10,
    includeExamples = false,
    examplesCount = 2,
    optionsCount = 4,
    outputType = 'clipboard'
  } = config;

  // If no topic, return placeholder
  if (!topic.trim()) {
    return getEmptyPromptPlaceholder();
  }

  // Build the prompt
  const prompt = buildPrompt({
    topic: topic.trim(),
    additional: additional.trim(),
    questionsCount,
    includeExamples,
    examplesCount,
    optionsCount,
    outputType
  });

  return prompt;
}

/**
 * Returns placeholder text when topic is empty
 * @returns {string} Placeholder text
 */
function getEmptyPromptPlaceholder() {
  return `Enter the test topic above to generate a prompt...

The prompt will include:
- Test format description
- Structure example
- Your requirements`;
}

/**
 * Builds the actual prompt text
 * @param {Object} config - Configuration object
 * @returns {string} Built prompt
 */
function buildPrompt(config) {
  const {
    topic,
    additional,
    questionsCount,
    includeExamples,
    examplesCount,
    optionsCount,
    outputType
  } = config;

  const parts = [];

  // Header
  parts.push(`Create a test on the topic: "${topic}"`);
  parts.push('');

  // Critical rules for less capable AI models
  parts.push('CRITICAL RULES (READ CAREFULLY):');
  parts.push('- The * symbol marks the correct answer - put it at the START of the line');
  parts.push('- Write the ACTUAL ANSWER TEXT after *, not just "correct" or "A"');
  parts.push('- DO NOT use letters (A, B, C, D) or numbering - just plain text options');
  parts.push('- Each option is a complete answer text on its own line');
  parts.push('');

  // Format description
  parts.push('TEST FORMAT:');
  parts.push(`- Question text (first line)`);
  parts.push(`- ${optionsCount} answer options (plain text, no letters/numbers)`);
  parts.push('- Correct answer marked with * at the beginning');
  parts.push('- Empty line between questions');

  if (includeExamples) {
    parts.push(`- ${examplesCount} example(s) after options in format: Example: text`);
  }

  parts.push('');

  // Correct format example with real content
  parts.push('CORRECT FORMAT EXAMPLE:');
  parts.push('```');

  // First question - simple without examples
  parts.push('What is the capital of France?');
  if (optionsCount === 4) {
    parts.push('Berlin');
    parts.push('Madrid');
    parts.push('*Paris');
    parts.push('Rome');
  } else {
    parts.push('Berlin');
    parts.push('Madrid');
    parts.push('*Paris');
    parts.push('Rome');
    parts.push('Warsaw');
    parts.push('Vienna');
  }

  if (includeExamples) {
    for (let i = 1; i <= examplesCount; i++) {
      parts.push(`Example: Paris is the largest city in France`);
    }
  }

  parts.push('');

  // Second question
  parts.push('What does "enormous" mean?');
  if (optionsCount === 4) {
    parts.push('Small');
    parts.push('Tiny');
    parts.push('*Very large');
    parts.push('Medium');
  } else {
    parts.push('Small');
    parts.push('Tiny');
    parts.push('*Very large');
    parts.push('Medium');
    parts.push('Average');
    parts.push('Minimal');
  }

  if (includeExamples) {
    parts.push('Example: The elephant was enormous');
    if (examplesCount >= 2) {
      parts.push('Example: They live in an enormous house');
    }
    for (let i = 3; i <= examplesCount; i++) {
      parts.push('Example: The building was enormous');
    }
  }

  parts.push('```');
  parts.push('');

  // Wrong format examples - critical for less capable AI
  parts.push('WRONG FORMAT (DO NOT DO THIS):');
  parts.push('');
  parts.push('Wrong - using letters:');
  parts.push('A) Berlin');
  parts.push('B) Madrid');
  parts.push('C) Paris <- correct');
  parts.push('D) Rome');
  parts.push('');
  parts.push('Wrong - using "*correct":');
  parts.push('Berlin');
  parts.push('Madrid');
  parts.push('*correct');
  parts.push('Rome');
  parts.push('');
  parts.push('Wrong - not marking answer:');
  parts.push('Berlin');
  parts.push('Madrid');
  parts.push('Paris');
  parts.push('Rome');
  parts.push('');

  // Requirements
  parts.push('REQUIREMENTS:');
  parts.push(`- Create exactly ${questionsCount} questions`);
  parts.push(`- Each question must have exactly ${optionsCount} answer options`);
  parts.push('- Only ONE correct answer per question (marked with *)');
  parts.push('- Separate questions with an empty line');
  parts.push('- The * must be at the very beginning of the correct answer line');
  parts.push('- Write FULL ANSWER TEXT after *, like "*Paris" not "*C"');

  if (includeExamples) {
    parts.push(`- Add ${examplesCount} example(s) after the answer options`);
    parts.push('- Examples should illustrate the correct answer in context');
  }

  // Additional instructions
  if (additional) {
    parts.push('');
    parts.push('ADDITIONAL REQUIREMENTS:');
    parts.push(additional);
  }

  parts.push('');
  parts.push('OUTPUT:');

  if (outputType === 'file') {
    parts.push('Create a downloadable .txt file with the test content.');
    parts.push('File name should be based on the topic.');
    parts.push('Do NOT add any explanations - ONLY the test content.');
  } else {
    parts.push('Provide ONLY the test text, ready for copying.');
    parts.push('Do NOT add any prefixes, explanations, or comments.');
  }

  // Final reminder for less capable AI
  parts.push('');
  parts.push('REMEMBER: Each answer = COMPLETE TEXT. Correct answer = * + full text (e.g., "*Paris")');

  return parts.join('\n');
}

/**
 * Validates the configuration
 * @param {Object} config - Configuration to validate
 * @returns {Object} Validation result { valid: boolean, errors: string[] }
 */
export function validateConfig(config) {
  const errors = [];

  if (!config.topic || !config.topic.trim()) {
    errors.push('Topic is required');
  }

  if (config.questionsCount < 1 || config.questionsCount > 50) {
    errors.push('Questions count must be between 1 and 50');
  }

  if (config.includeExamples) {
    if (config.examplesCount < 1 || config.examplesCount > 4) {
      errors.push('Examples count must be between 1 and 4');
    }
  }

  if (![4, 6].includes(config.optionsCount)) {
    errors.push('Options count must be 4 or 6');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}
