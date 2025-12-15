// UI/i18n/languageSelector.js
// Language selector component for the header

import { getCurrentLanguage, changeLanguage, onLanguageChange } from './i18n.js';

const LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'uk', name: 'Ukrainian', flag: '🇺🇦' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'pl', name: 'Polski', flag: '🇵🇱' },
  { code: 'pt', name: 'Português', flag: '🇵🇹' },
  { code: 'zh', name: '中文', flag: '🇨🇳' }
];

// Create language selector element
function createLanguageSelector() {
  const container = document.createElement('div');
  container.className = 'language-selector';
  container.id = 'languageSelector';

  const currentLang = getCurrentLanguage();
  const current = LANGUAGES.find(l => l.code === currentLang) || LANGUAGES[0];

  // Current language button
  const button = document.createElement('button');
  button.className = 'language-selector__button';
  button.innerHTML = `${current.flag} ${current.name} <span class="language-selector__arrow">▼</span>`;

  // Dropdown menu
  const dropdown = document.createElement('div');
  dropdown.className = 'language-selector__dropdown';
  dropdown.style.display = 'none';

  LANGUAGES.forEach(lang => {
    const option = document.createElement('div');
    option.className = 'language-selector__option';
    if (lang.code === currentLang) {
      option.classList.add('language-selector__option--active');
    }
    option.innerHTML = `${lang.flag} ${lang.name}`;
    option.dataset.lang = lang.code;

    option.addEventListener('click', () => {
      changeLanguage(lang.code);
      dropdown.style.display = 'none';
    });

    dropdown.appendChild(option);
  });

  // Toggle dropdown
  button.addEventListener('click', (e) => {
    e.stopPropagation();
    dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
  });

  // Close dropdown on outside click
  document.addEventListener('click', () => {
    dropdown.style.display = 'none';
  });

  container.appendChild(button);
  container.appendChild(dropdown);

  return container;
}

// Update selector on language change
function updateSelector(language) {
  const button = document.querySelector('.language-selector__button');
  const options = document.querySelectorAll('.language-selector__option');

  if (button) {
    const lang = LANGUAGES.find(l => l.code === language) || LANGUAGES[0];
    button.innerHTML = `${lang.flag} ${lang.name} <span class="language-selector__arrow">▼</span>`;
  }

  options.forEach(option => {
    option.classList.toggle('language-selector__option--active', option.dataset.lang === language);
  });
}

// Add CSS styles
function addStyles() {
  const style = document.createElement('style');
  style.textContent = `
    .language-selector {
      position: absolute;
      top: 6px;
      right: 36px;
      z-index: 100;
    }

    .language-selector__button {
      background: rgba(30, 30, 40, 0.9);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 6px;
      color: #fff;
      padding: 4px 10px;
      font-size: 12px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 6px;
      transition: all 0.2s ease;
    }

    .language-selector__button:hover {
      background: rgba(50, 50, 60, 0.95);
      border-color: rgba(255, 255, 255, 0.3);
    }

    .language-selector__arrow {
      font-size: 8px;
      margin-left: 2px;
    }

    .language-selector__dropdown {
      position: absolute;
      top: 100%;
      right: 0;
      margin-top: 4px;
      background: rgba(30, 30, 40, 0.95);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 6px;
      overflow: hidden;
      min-width: 130px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    }

    .language-selector__option {
      padding: 8px 12px;
      cursor: pointer;
      color: #fff;
      font-size: 12px;
      transition: background 0.2s ease;
    }

    .language-selector__option:hover {
      background: rgba(255, 255, 255, 0.1);
    }

    .language-selector__option--active {
      background: rgba(100, 100, 255, 0.3);
    }

    .language-selector__option--active:hover {
      background: rgba(100, 100, 255, 0.4);
    }
  `;
  document.head.appendChild(style);
}

// Initialize language selector
export function initializeLanguageSelector() {
  addStyles();

  const selector = createLanguageSelector();

  // Add to mainView instead of body
  const mainView = document.getElementById('mainView');
  if (mainView) {
    mainView.appendChild(selector);
  } else {
    document.body.appendChild(selector);
  }

  onLanguageChange(updateSelector);

  console.log('[LanguageSelector] Initialized');
}
