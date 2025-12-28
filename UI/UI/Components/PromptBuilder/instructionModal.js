// UI/UI/Components/PromptBuilder/instructionModal.js
// Instruction modal shown after copying prompt

import { t } from '../../../i18n/index.js';

const STORAGE_KEY = 'promptBuilder.hideInstruction';

// AI services with their URLs
const AI_SERVICES = [
  { name: 'ChatGPT', url: 'https://chatgpt.com/' },
  { name: 'Claude', url: 'https://claude.ai/' },
  { name: 'Gemini', url: 'https://gemini.google.com/' },
  { name: 'Grok', url: 'https://grok.com/' }
];

/**
 * Checks if instruction should be shown
 * @returns {boolean} True if instruction should be shown
 */
export function shouldShowInstruction() {
  return localStorage.getItem(STORAGE_KEY) !== 'true';
}

/**
 * Sets the "don't show again" preference
 * @param {boolean} hide - Whether to hide instruction in future
 */
export function setHideInstruction(hide) {
  if (hide) {
    localStorage.setItem(STORAGE_KEY, 'true');
  } else {
    localStorage.removeItem(STORAGE_KEY);
  }
}

/**
 * Opens AI service URL in default browser
 * @param {string} url - URL to open
 */
async function openAiService(url) {
  try {
    await window.electron.shell.openExternal(url);
  } catch (error) {
    console.error('Failed to open URL:', error);
  }
}

/**
 * Creates the instruction modal element
 * @returns {HTMLElement} Modal overlay element
 */
export function createInstructionModal() {
  const overlay = document.createElement('div');
  overlay.className = 'instruction-modal-overlay';
  overlay.id = 'instructionModalOverlay';

  const modal = document.createElement('div');
  modal.className = 'instruction-modal';

  // Build AI links HTML
  const aiLinksHtml = AI_SERVICES.map(service =>
    `<a href="#" class="ai-link" data-url="${service.url}">• ${service.name} — ${service.url.replace('https://', '')}</a>`
  ).join('');

  modal.innerHTML = `
    <div class="instruction-modal-header">
      <h2 class="instruction-modal-title">${t('promptBuilder.instruction.title')}</h2>
      <button class="instruction-modal-close" id="instructionCloseBtn">&times;</button>
    </div>

    <div class="instruction-modal-body">
      <div class="instruction-success">
        <span class="instruction-checkmark">✅</span>
        <span>${t('promptBuilder.instruction.copied')}</span>
      </div>

      <div class="instruction-step">
        <div class="instruction-step-header">${t('promptBuilder.instruction.step1')}</div>
        <div class="instruction-ai-links">
          ${aiLinksHtml}
        </div>
      </div>

      <div class="instruction-step">
        <div class="instruction-step-header">${t('promptBuilder.instruction.step2')}</div>
        <div class="instruction-step-content">
          • ${t('promptBuilder.instruction.step2a')}<br>
          • ${t('promptBuilder.instruction.step2b')}
        </div>
      </div>

      <div class="instruction-step">
        <div class="instruction-step-header">${t('promptBuilder.instruction.step3')}</div>
        <div class="instruction-step-content">
          ${t('promptBuilder.instruction.step3text')}
        </div>
      </div>

      <div class="instruction-step">
        <div class="instruction-step-header">${t('promptBuilder.instruction.step4')}</div>
        <div class="instruction-options">
          <div class="instruction-option">
            <div class="instruction-option-title">${t('promptBuilder.instruction.optionA')}</div>
            <ol class="instruction-option-steps">
              <li>${t('promptBuilder.instruction.optionA1')}</li>
              <li>${t('promptBuilder.instruction.optionA2')}</li>
              <li>${t('promptBuilder.instruction.optionA3')}</li>
              <li>${t('promptBuilder.instruction.optionA4')}</li>
            </ol>
          </div>
          <div class="instruction-option">
            <div class="instruction-option-title">${t('promptBuilder.instruction.optionB')}</div>
            <ol class="instruction-option-steps">
              <li>${t('promptBuilder.instruction.optionB1')}</li>
              <li>${t('promptBuilder.instruction.optionB2')}</li>
              <li>${t('promptBuilder.instruction.optionB3')}</li>
            </ol>
          </div>
        </div>
      </div>

      <div class="instruction-done">
        ${t('promptBuilder.instruction.done')}
      </div>
    </div>

    <div class="instruction-modal-footer">
      <label class="instruction-checkbox-container">
        <input type="checkbox" id="instructionDontShow" class="instruction-checkbox">
        <span class="instruction-checkbox-label">${t('promptBuilder.instruction.dontShowAgain')}</span>
      </label>
      <button class="instruction-btn-ok" id="instructionOkBtn">${t('modal.ok')}</button>
    </div>
  `;

  overlay.appendChild(modal);
  return overlay;
}

/**
 * Shows the instruction modal
 * @param {Function} onClose - Callback when modal is closed
 */
export function showInstructionModal(onClose = () => {}) {
  const overlay = createInstructionModal();
  const container = document.getElementById('modalContainerMainMenu') || document.body;
  container.appendChild(overlay);

  // Trigger animation
  requestAnimationFrame(() => {
    overlay.classList.add('active');
  });

  // Get elements
  const closeBtn = document.getElementById('instructionCloseBtn');
  const okBtn = document.getElementById('instructionOkBtn');
  const dontShowCheckbox = document.getElementById('instructionDontShow');
  const aiLinks = overlay.querySelectorAll('.ai-link');

  // Close handler
  const handleClose = () => {
    // Save preference
    if (dontShowCheckbox.checked) {
      setHideInstruction(true);
    }

    // Animate out
    overlay.classList.remove('active');
    setTimeout(() => {
      if (overlay.parentNode) {
        overlay.parentNode.removeChild(overlay);
      }
      onClose();
    }, 300);
  };

  // AI link click handler
  const handleAiLinkClick = (e) => {
    e.preventDefault();
    const url = e.currentTarget.dataset.url;
    openAiService(url);
  };

  // Attach event listeners
  closeBtn.addEventListener('click', handleClose);
  okBtn.addEventListener('click', handleClose);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) handleClose();
  });

  // Attach AI link handlers
  aiLinks.forEach(link => {
    link.addEventListener('click', handleAiLinkClick);
  });

  // Escape key
  const handleEscape = (e) => {
    if (e.key === 'Escape') {
      handleClose();
      document.removeEventListener('keydown', handleEscape);
    }
  };
  document.addEventListener('keydown', handleEscape);
}
