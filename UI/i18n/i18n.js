// UI/i18n/i18n.js
// Internationalization module using i18next

import i18next from 'i18next';
import en from '@Locales/en.json';
import uk from '@Locales/uk.json';
import es from '@Locales/es.json';
import de from '@Locales/de.json';
import fr from '@Locales/fr.json';
import pl from '@Locales/pl.json';
import pt from '@Locales/pt.json';
import zh from '@Locales/zh.json';

const STORAGE_KEY = 'quiz-app-language';
const DEFAULT_LANGUAGE = 'en';
const SUPPORTED_LANGUAGES = ['en', 'uk', 'es', 'de', 'fr', 'pl', 'pt', 'zh'];

// Get saved language or default
function getSavedLanguage() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && SUPPORTED_LANGUAGES.includes(saved)) {
      return saved;
    }
  } catch (e) {
    console.warn('Failed to read language from localStorage:', e);
  }
  return DEFAULT_LANGUAGE;
}

// Save language preference
function saveLanguage(lang) {
  try {
    localStorage.setItem(STORAGE_KEY, lang);
  } catch (e) {
    console.warn('Failed to save language to localStorage:', e);
  }
}

// Initialize i18next
let initialized = false;

export async function initI18n() {
  if (initialized) return;

  const savedLang = getSavedLanguage();

  await i18next.init({
    lng: savedLang,
    fallbackLng: DEFAULT_LANGUAGE,
    resources: {
      en: { translation: en },
      uk: { translation: uk },
      es: { translation: es },
      de: { translation: de },
      fr: { translation: fr },
      pl: { translation: pl },
      pt: { translation: pt },
      zh: { translation: zh }
    },
    interpolation: {
      escapeValue: false
    }
  });

  initialized = true;
  console.log(`[i18n] Initialized with language: ${savedLang}`);
}

// Translation function
export function t(key, options) {
  return i18next.t(key, options);
}

// Change language
export function changeLanguage(lang) {
  if (!SUPPORTED_LANGUAGES.includes(lang)) {
    console.warn(`[i18n] Unsupported language: ${lang}`);
    return;
  }

  i18next.changeLanguage(lang);
  saveLanguage(lang);
  console.log(`[i18n] Language changed to: ${lang}`);

  // Dispatch event for UI update
  window.dispatchEvent(new CustomEvent('languageChanged', { detail: { language: lang } }));
}

// Get current language
export function getCurrentLanguage() {
  return i18next.language || DEFAULT_LANGUAGE;
}

// Get list of supported languages
export function getSupportedLanguages() {
  return SUPPORTED_LANGUAGES.map(code => ({
    code,
    name: t(`language.${code}`)
  }));
}

// Subscribe to language changes
export function onLanguageChange(callback) {
  window.addEventListener('languageChanged', (e) => callback(e.detail.language));
}

export default {
  initI18n,
  t,
  changeLanguage,
  getCurrentLanguage,
  getSupportedLanguages,
  onLanguageChange
};
