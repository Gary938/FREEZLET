// UI/UI/Components/PromptBuilder/promptBuilderRenderer.js
// DOM creation for Prompt Builder modal

import { t } from '../../../i18n/index.js';

/**
 * Creates the main modal element with all form fields
 * @returns {HTMLElement} Modal element
 */
export function createPromptBuilderModal() {
  const overlay = document.createElement('div');
  overlay.className = 'prompt-builder-overlay';
  overlay.id = 'promptBuilderOverlay';

  const modal = document.createElement('div');
  modal.className = 'prompt-builder-modal';
  modal.innerHTML = `
    <div class="prompt-builder-header">
      <h2 class="prompt-builder-title">${t('promptBuilder.title')}</h2>
      <button class="prompt-builder-close" id="pbCloseBtn">&times;</button>
    </div>

    <div class="prompt-builder-body">
      <!-- Topic Field -->
      <div class="pb-form-group">
        <label for="pbTopic">${t('promptBuilder.topic')}</label>
        <input
          type="text"
          id="pbTopic"
          class="pb-input"
          placeholder="${t('promptBuilder.topicPlaceholder')}"
        >
      </div>

      <!-- Additional Instructions -->
      <div class="pb-form-group">
        <label for="pbAdditional">${t('promptBuilder.additional')}</label>
        <textarea
          id="pbAdditional"
          class="pb-textarea"
          placeholder="${t('promptBuilder.additionalPlaceholder')}"
        ></textarea>
      </div>

      <!-- Questions Count -->
      <div class="pb-form-group">
        <label>${t('promptBuilder.questionsCount')}</label>
        <div class="pb-range-container">
          <input
            type="range"
            id="pbQuestionsRange"
            class="pb-range"
            min="1"
            max="50"
            value="20"
          >
          <span class="pb-range-value" id="pbQuestionsValue">20</span>
        </div>
        <span class="pb-recommendation">${t('promptBuilder.questionsRecommendation')}</span>
      </div>

      <!-- Include Examples -->
      <div class="pb-form-group">
        <label class="pb-checkbox-container">
          <input type="checkbox" id="pbIncludeExamples" class="pb-checkbox">
          <span class="pb-checkbox-label">${t('promptBuilder.includeExamples')}</span>
        </label>

        <div class="pb-examples-subgroup disabled" id="pbExamplesSubgroup">
          <div class="pb-inline-row">
            <label for="pbExamplesCount">${t('promptBuilder.examplesCount')}:</label>
            <select id="pbExamplesCount" class="pb-select">
              <option value="1">1</option>
              <option value="2" selected>2</option>
              <option value="3">3</option>
              <option value="4">4</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Options Count -->
      <div class="pb-form-group">
        <label>${t('promptBuilder.optionsCount')}</label>
        <div class="pb-radio-group">
          <label class="pb-radio-container">
            <input type="radio" name="pbOptionsCount" value="4" checked class="pb-radio">
            <span class="pb-radio-label">4</span>
          </label>
          <label class="pb-radio-container">
            <input type="radio" name="pbOptionsCount" value="6" class="pb-radio">
            <span class="pb-radio-label">6</span>
          </label>
        </div>
      </div>

      <!-- Output Type -->
      <div class="pb-form-group">
        <label>${t('promptBuilder.outputType')}</label>
        <div class="pb-radio-group-vertical">
          <div class="pb-radio-option">
            <label class="pb-radio-container">
              <input type="radio" name="pbOutputType" value="file" class="pb-radio">
              <span class="pb-radio-label">${t('promptBuilder.outputFile')}</span>
            </label>
            <span class="pb-radio-hint">${t('promptBuilder.outputFileHint')}</span>
          </div>
          <div class="pb-radio-option">
            <label class="pb-radio-container">
              <input type="radio" name="pbOutputType" value="clipboard" checked class="pb-radio">
              <span class="pb-radio-label">${t('promptBuilder.outputClipboard')}</span>
            </label>
            <span class="pb-radio-hint">${t('promptBuilder.outputClipboardHint')}</span>
          </div>
        </div>
      </div>

      <!-- Preview Section -->
      <div class="pb-preview-section">
        <div class="pb-preview-label">${t('promptBuilder.preview')}</div>
        <textarea
          id="pbPreview"
          class="pb-preview"
          readonly
        ></textarea>
      </div>
    </div>

    <div class="prompt-builder-footer">
      <button class="pb-btn pb-btn-secondary" id="pbCancelBtn">${t('promptBuilder.cancel')}</button>
      <button class="pb-btn pb-btn-copy" id="pbCopyBtn">
        <span>📋</span>
        <span id="pbCopyText">${t('promptBuilder.copy')}</span>
      </button>
    </div>
  `;

  overlay.appendChild(modal);
  return overlay;
}

/**
 * Renders modal to DOM
 * @param {HTMLElement} modalElement - Modal element to render
 * @returns {HTMLElement} The rendered overlay element
 */
export function renderPromptBuilderModal(modalElement) {
  const container = document.getElementById('modalContainerMainMenu') || document.body;
  container.appendChild(modalElement);

  // Trigger animation
  requestAnimationFrame(() => {
    modalElement.classList.add('active');
  });

  return modalElement;
}

/**
 * Removes modal from DOM with animation
 * @param {HTMLElement} overlay - Overlay element to remove
 */
export function removePromptBuilderModal(overlay) {
  overlay.classList.remove('active');

  // Remove after animation completes
  setTimeout(() => {
    if (overlay.parentNode) {
      overlay.parentNode.removeChild(overlay);
    }
  }, 300);
}

/**
 * Updates the preview text
 * @param {string} text - Preview text to display
 */
export function updatePreview(text) {
  const preview = document.getElementById('pbPreview');
  if (preview) {
    preview.value = text;
  }
}

/**
 * Gets form values from the modal
 * @returns {Object} Form values
 */
export function getFormValues() {
  const topic = document.getElementById('pbTopic')?.value || '';
  const additional = document.getElementById('pbAdditional')?.value || '';
  const questionsCount = parseInt(document.getElementById('pbQuestionsRange')?.value) || 10;
  const includeExamples = document.getElementById('pbIncludeExamples')?.checked || false;
  const examplesCount = parseInt(document.getElementById('pbExamplesCount')?.value) || 2;
  const optionsCount = parseInt(document.querySelector('input[name="pbOptionsCount"]:checked')?.value) || 4;
  const outputType = document.querySelector('input[name="pbOutputType"]:checked')?.value || 'clipboard';

  return {
    topic,
    additional,
    questionsCount,
    includeExamples,
    examplesCount,
    optionsCount,
    outputType
  };
}

/**
 * Sets copy button to "copied" state temporarily
 */
export function showCopiedState() {
  const copyBtn = document.getElementById('pbCopyBtn');
  const copyText = document.getElementById('pbCopyText');

  if (copyBtn && copyText) {
    copyBtn.classList.add('copied');
    copyText.textContent = t('promptBuilder.copied');

    setTimeout(() => {
      copyBtn.classList.remove('copied');
      copyText.textContent = t('promptBuilder.copy');
    }, 2000);
  }
}
