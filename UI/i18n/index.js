// UI/i18n/index.js
// i18n module exports

export {
  initI18n,
  t,
  changeLanguage,
  getCurrentLanguage,
  getSupportedLanguages,
  onLanguageChange
} from './i18n.js';

export { initializeLanguageSelector } from './languageSelector.js';

export { initDomTranslator, translatePage } from './domTranslator.js';
