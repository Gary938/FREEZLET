// Utils/answerComparison.js - Text answer comparison utilities

// OPERATIONS

/**
 * Compares entered answer with correct one
 * - case-insensitive
 * - trim whitespace
 * - ignores punctuation
 */
export const compareTextAnswers = (userAnswer, correctAnswer) => {
    if (!userAnswer || !correctAnswer) return false;

    const normalizedUser = normalizeText(userAnswer);
    const normalizedCorrect = normalizeText(correctAnswer);

    return normalizedUser === normalizedCorrect;
};

/**
 * Text normalization for comparison
 */
export const normalizeText = (text) => {
    if (typeof text !== 'string') return '';

    return text
        .toLowerCase()
        .trim()
        .replace(/[.,!?;:'"()\-\[\]{}]/g, '')  // remove punctuation
        .replace(/\s+/g, ' ');                  // normalize whitespace
};

/**
 * Checks if answer is empty
 */
export const isEmptyAnswer = (answer) => {
    if (!answer || typeof answer !== 'string') return true;
    return answer.trim().length === 0;
};
