/**
 * DOM Translator - Auto-updates HTML elements on language change
 * @module UI/i18n/domTranslator
 */

import { t, onLanguageChange } from './i18n.js';

/**
 * Translates all elements with data-i18n attribute
 */
export function translatePage() {
  // Translate text content
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (key) {
      // If there's a span with animation class inside - update only its text
      const animatedSpan = el.querySelector('.typewriter-text');
      if (animatedSpan) {
        animatedSpan.textContent = t(key);
      } else {
        el.textContent = t(key);
      }
    }
  });

  // Translate placeholders
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (key) {
      el.placeholder = t(key);
    }
  });

  // Translate titles (tooltips)
  document.querySelectorAll('[data-i18n-title]').forEach(el => {
    const key = el.getAttribute('data-i18n-title');
    if (key) {
      el.title = t(key);
    }
  });
}

/**
 * Initialize DOM translator with auto-update on language change
 */
export function initDomTranslator() {
  // Initial translation
  translatePage();

  // Subscribe to language changes
  onLanguageChange(() => {
    translatePage();
  });
}
