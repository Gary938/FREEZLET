// UI/UI/Components/Help/helpButton.js
// Help button component for the header (next to language selector)

import { showHelpModal } from './helpModal.js';

// Create help button element
function createHelpButton() {
  const button = document.createElement('button');
  button.className = 'help-button';
  button.id = 'helpButton';
  button.innerHTML = '?';
  button.title = 'Help';

  button.addEventListener('click', (e) => {
    e.stopPropagation();
    showHelpModal();
  });

  return button;
}

// Add CSS styles for help button
function addHelpButtonStyles() {
  const style = document.createElement('style');
  style.textContent = `
    /* Make mainView relative for absolute positioning */
    #mainView {
      position: relative;
    }

    .help-button {
      position: absolute;
      top: 8px;
      right: 8px;
      z-index: 100;
      width: 20px;
      height: 20px;
      background: rgba(30, 30, 40, 0.9);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 50%;
      color: #00FFFF;
      font-size: 11px;
      font-weight: bold;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
      font-family: 'Segoe UI', sans-serif;
    }

    .help-button:hover {
      background: rgba(50, 50, 60, 0.95);
      border-color: #00FFFF;
      transform: scale(1.1);
      box-shadow: 0 0 10px rgba(0, 255, 255, 0.4);
    }

    .help-button:active {
      transform: scale(0.95);
    }
  `;
  document.head.appendChild(style);
}

// Initialize help button
export function initializeHelpButton() {
  addHelpButtonStyles();

  const button = createHelpButton();

  // Add to mainView instead of body
  const mainView = document.getElementById('mainView');
  if (mainView) {
    mainView.appendChild(button);
  } else {
    document.body.appendChild(button);
  }

  console.log('[HelpButton] Initialized');
}
