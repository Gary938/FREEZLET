// renderer/rendererEntry.js - UI entry point
// UI architecture - display only (no business logic)

// Import i18n initialization
import { initI18n, initDomTranslator } from '@UI/i18n/index.js';
// Import category tree components
import { initializeCategoryComponents } from '@UI/UI/Components/Category/testCategories.js';
// Import UI component from new structure
import { initializeUI } from '@UI/UI/initializeComponents.js';
// Import main menu background
import { initializeMainMenuBackground, getMainMenuBackground } from '@UI/MainMenu/Background/index.js';
// Import language selector
import { initializeLanguageSelector } from '@UI/i18n/languageSelector.js';
// Import Prompt Builder
import { initializePromptBuilder } from '@UI/Controllers/PromptBuilder/promptBuilderController.js';
// Import Help system
import { initializeHelpController } from '@UI/Controllers/Help/helpController.js';

// Initialize components after DOM load
document.addEventListener('DOMContentLoaded', async () => {
  try {
    // 0. Initialize i18n first
    await initI18n();

    // 0.5. Initialize DOM translator for auto-update on language change
    initDomTranslator();

    // 1. Initialize animated main menu background
    await initializeMainMenuBackground();

    // 2. Initialize category components
    await initializeCategoryComponents();

    // 3. Initialize test table components
    initializeUI();

    // 4. Initialize language selector in header
    initializeLanguageSelector();

    // 5. Initialize Prompt Builder
    initializePromptBuilder();

    // 6. Initialize Help system
    initializeHelpController();
  } catch (error) {
    console.error('Component initialization error:', error);
  }
});

// Export background control function for other modules
export { getMainMenuBackground };