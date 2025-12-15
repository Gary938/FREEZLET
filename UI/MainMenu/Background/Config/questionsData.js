// UI/MainMenu/Background/Config/questionsData.js
// Question data in different languages and mathematical formulas

export const QUESTIONS = {
  english: [
    "What is consciousness?",
    "How do stars form?",
    "What is time?",
    "Why do we dream?",
    "What is infinity?"
  ],
  chinese: [
    "什么是意识?",
    "时间是什么?",
    "宇宙有多大?",
    "什么是爱?",
    "生命的意义?"
  ],
  japanese: [
    "時間とは何か?",
    "宇宙の果ては?",
    "意識とは?",
    "愛とは何か?",
    "夢を見る理由?"
  ],
  german: [
    "Was ist Zeit?",
    "Was ist Liebe?",
    "Was ist Energie?",
    "Warum träumen wir?",
    "Was ist Unendlichkeit?"
  ],
  french: [
    "Qu'est-ce que le temps?",
    "Qu'est-ce que l'amour?",
    "Pourquoi rêvons-nous?",
    "Qu'est-ce que l'infini?",
    "D'où vient l'univers?"
  ],
  spanish: [
    "¿Qué es el tiempo?",
    "¿Qué es el amor?",
    "¿Por qué soñamos?",
    "¿Qué es la vida?",
    "¿Cómo surgió todo?"
  ]
};

export const FORMULAS = [
  "E = mc²",
  "∫f(x)dx",
  "∑n² = π²/6",
  "eⁱπ + 1 = 0",
  "a² + b² = c²",
  "F = ma",
  "∇ × E",
  "π ≈ 3.14159",
  "φ = (1+√5)/2",
  "∞"
];

/**
 * Gets all questions as a flat array
 * @returns {string[]}
 */
export function getAllQuestions() {
  return Object.values(QUESTIONS).flat();
}

/**
 * Gets random questions from all languages
 * @param {number} count - number of questions
 * @returns {string[]}
 */
export function getRandomQuestions(count) {
  const allQuestions = getAllQuestions();
  const shuffled = [...allQuestions].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

/**
 * Gets random formulas
 * @param {number} count - number of formulas
 * @returns {string[]}
 */
export function getRandomFormulas(count) {
  const shuffled = [...FORMULAS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}
