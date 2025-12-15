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

  // Generate options letters
  const optionLetters = optionsCount === 4
    ? 'A, B, C, D'
    : 'A, B, C, D, E, F';

  // Build the prompt parts
  const parts = [];

  // Header
  parts.push(`Create a test on the topic: "${topic}"`);
  parts.push('');

  // Format description
  parts.push('TEST FORMAT:');
  parts.push('The test must be in text format (.txt) with the following structure:');
  parts.push('');
  parts.push('1. Each question starts with the question text');
  parts.push(`2. After the question, there are ${optionsCount} answer options`);
  parts.push('3. The correct answer is marked with * symbol at the beginning of the line');
  parts.push('4. After the answer options - an empty line (separator between questions)');

  if (includeExamples) {
    parts.push('5. Before the empty line, add usage examples in the format:');
    parts.push('   Example: example text');
    parts.push(`   (add ${examplesCount} example(s) for each question)`);
  }

  parts.push('');

  // Structure example
  parts.push('STRUCTURE EXAMPLE:');
  parts.push('```');
  parts.push('Question text?');

  // Generate sample options
  for (let i = 0; i < optionsCount; i++) {
    const letter = String.fromCharCode(65 + i); // A, B, C, D, E, F
    if (i === 2) {
      parts.push(`*Option ${letter} (correct answer)`);
    } else {
      parts.push(`Option ${letter}`);
    }
  }

  if (includeExamples) {
    for (let i = 1; i <= examplesCount; i++) {
      parts.push(`Example: Usage example ${i}`);
    }
  }

  parts.push('');
  parts.push('Next question?');
  parts.push('...');
  parts.push('```');
  parts.push('');

  // Requirements
  parts.push('REQUIREMENTS:');
  parts.push(`- Create exactly ${questionsCount} questions`);
  parts.push(`- Each question must have exactly ${optionsCount} answer options (${optionLetters})`);
  parts.push('- Only ONE correct answer (marked with *)');
  parts.push('- Separate questions with an empty line');
  parts.push('- The * symbol must be at the very beginning of the correct answer line');

  if (includeExamples) {
    parts.push(`- Add ${examplesCount} example(s) after the answer options`);
    parts.push('- Examples should illustrate the correct answer usage');
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
    parts.push('File name should be based on the topic (e.g., "phrasal_verbs_test.txt").');
    parts.push('Do NOT add any explanations or comments - ONLY the test content in the file.');
  } else {
    parts.push('Provide ONLY the test text without explanations, ready for copying.');
    parts.push('Do NOT add any prefixes, suffixes, or comments.');
  }

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
