// UI/UI/Components/PromptBuilder/promptBuilderHandlers.js
// Event handlers for Prompt Builder modal

import {
  getFormValues,
  updatePreview,
  showCopiedState,
  removePromptBuilderModal
} from './promptBuilderRenderer.js';
import { generatePrompt } from '../../../Controllers/PromptBuilder/promptGeneratorService.js';

let currentOverlay = null;

/**
 * Attaches all event handlers to the modal
 * @param {HTMLElement} overlay - The modal overlay element
 * @param {Function} onClose - Callback when modal is closed
 */
export function attachHandlers(overlay, onClose) {
  currentOverlay = overlay;

  // Close button
  const closeBtn = overlay.querySelector('#pbCloseBtn');
  if (closeBtn) {
    closeBtn.addEventListener('click', () => handleClose(onClose));
  }

  // Cancel button
  const cancelBtn = overlay.querySelector('#pbCancelBtn');
  if (cancelBtn) {
    cancelBtn.addEventListener('click', () => handleClose(onClose));
  }

  // Overlay click (close on backdrop click)
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      handleClose(onClose);
    }
  });

  // Escape key
  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      handleClose(onClose);
      document.removeEventListener('keydown', handleKeyDown);
    }
  };
  document.addEventListener('keydown', handleKeyDown);

  // Topic input - update preview on change
  const topicInput = overlay.querySelector('#pbTopic');
  if (topicInput) {
    topicInput.addEventListener('input', handleFormChange);
  }

  // Additional instructions - update preview on change
  const additionalInput = overlay.querySelector('#pbAdditional');
  if (additionalInput) {
    additionalInput.addEventListener('input', handleFormChange);
  }

  // Questions range slider
  const questionsRange = overlay.querySelector('#pbQuestionsRange');
  const questionsValue = overlay.querySelector('#pbQuestionsValue');
  if (questionsRange && questionsValue) {
    questionsRange.addEventListener('input', () => {
      questionsValue.textContent = questionsRange.value;
      handleFormChange();
    });
  }

  // Include examples checkbox
  const includeExamples = overlay.querySelector('#pbIncludeExamples');
  const examplesSubgroup = overlay.querySelector('#pbExamplesSubgroup');
  if (includeExamples && examplesSubgroup) {
    includeExamples.addEventListener('change', () => {
      if (includeExamples.checked) {
        examplesSubgroup.classList.remove('disabled');
      } else {
        examplesSubgroup.classList.add('disabled');
      }
      handleFormChange();
    });
  }

  // Examples count select
  const examplesCount = overlay.querySelector('#pbExamplesCount');
  if (examplesCount) {
    examplesCount.addEventListener('change', handleFormChange);
  }

  // Options count radio buttons
  const optionsRadios = overlay.querySelectorAll('input[name="pbOptionsCount"]');
  optionsRadios.forEach(radio => {
    radio.addEventListener('change', handleFormChange);
  });

  // Output type radio buttons
  const outputTypeRadios = overlay.querySelectorAll('input[name="pbOutputType"]');
  outputTypeRadios.forEach(radio => {
    radio.addEventListener('change', handleFormChange);
  });

  // Copy button
  const copyBtn = overlay.querySelector('#pbCopyBtn');
  if (copyBtn) {
    copyBtn.addEventListener('click', handleCopyClick);
  }

  // Initial preview generation
  handleFormChange();
}

/**
 * Handles form value changes and updates preview
 */
function handleFormChange() {
  const values = getFormValues();
  const prompt = generatePrompt(values);
  updatePreview(prompt);
}

/**
 * Handles copy button click
 */
async function handleCopyClick() {
  const preview = document.getElementById('pbPreview');
  if (!preview) return;

  const text = preview.value;
  if (!text) return;

  try {
    await navigator.clipboard.writeText(text);
    showCopiedState();
  } catch (err) {
    // Fallback for older browsers
    preview.select();
    document.execCommand('copy');
    showCopiedState();
  }
}

/**
 * Handles modal close
 * @param {Function} onClose - Callback when modal is closed
 */
function handleClose(onClose) {
  if (currentOverlay) {
    removePromptBuilderModal(currentOverlay);
    currentOverlay = null;
  }
  if (typeof onClose === 'function') {
    onClose();
  }
}

/**
 * Detaches all event handlers (cleanup)
 */
export function detachHandlers() {
  currentOverlay = null;
}
