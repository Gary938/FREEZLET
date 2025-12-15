// UI/UI/Components/PromptBuilder/promptBuilderModal.js
// Main component for Prompt Builder modal

import {
  createPromptBuilderModal,
  renderPromptBuilderModal,
  removePromptBuilderModal
} from './promptBuilderRenderer.js';
import { attachHandlers, detachHandlers } from './promptBuilderHandlers.js';

let currentOverlay = null;
let isOpen = false;

/**
 * Shows the Prompt Builder modal
 * @returns {Promise<void>}
 */
export function showPromptBuilderModal() {
  return new Promise((resolve) => {
    // Prevent multiple instances
    if (isOpen) {
      return resolve();
    }

    isOpen = true;

    // Create and render modal
    const overlay = createPromptBuilderModal();
    currentOverlay = overlay;
    renderPromptBuilderModal(overlay);

    // Attach event handlers
    attachHandlers(overlay, () => {
      isOpen = false;
      currentOverlay = null;
      detachHandlers();
      resolve();
    });

    // Focus on topic input
    setTimeout(() => {
      const topicInput = overlay.querySelector('#pbTopic');
      if (topicInput) {
        topicInput.focus();
      }
    }, 100);
  });
}

/**
 * Hides the Prompt Builder modal
 */
export function hidePromptBuilderModal() {
  if (currentOverlay) {
    removePromptBuilderModal(currentOverlay);
    isOpen = false;
    currentOverlay = null;
    detachHandlers();
  }
}

/**
 * Checks if modal is currently open
 * @returns {boolean}
 */
export function isPromptBuilderOpen() {
  return isOpen;
}
