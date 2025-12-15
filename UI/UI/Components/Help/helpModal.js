// UI/UI/Components/Help/helpModal.js
// Help modal component with navigation between sections

import { getHelpContent, HELP_SECTIONS } from './helpContent.js';
import { getCurrentLanguage } from '../../../i18n/i18n.js';

let currentSection = null;
let modalOverlay = null;

// Create modal structure
function createModalElement() {
  const overlay = document.createElement('div');
  overlay.className = 'help-modal-overlay';
  overlay.id = 'helpModalOverlay';

  const modal = document.createElement('div');
  modal.className = 'help-modal';

  // Header
  const header = document.createElement('div');
  header.className = 'help-modal__header';

  const backButton = document.createElement('button');
  backButton.className = 'help-modal__back';
  backButton.innerHTML = '&larr;';
  backButton.style.display = 'none';
  backButton.addEventListener('click', showSectionsList);

  const title = document.createElement('h2');
  title.className = 'help-modal__title';
  title.id = 'helpModalTitle';
  title.textContent = 'Help';

  const closeButton = document.createElement('button');
  closeButton.className = 'help-modal__close';
  closeButton.innerHTML = '&times;';
  closeButton.addEventListener('click', hideHelpModal);

  header.appendChild(backButton);
  header.appendChild(title);
  header.appendChild(closeButton);

  // Content
  const content = document.createElement('div');
  content.className = 'help-modal__content';
  content.id = 'helpModalContent';

  modal.appendChild(header);
  modal.appendChild(content);
  overlay.appendChild(modal);

  // Close on overlay click
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      hideHelpModal();
    }
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay) {
      hideHelpModal();
    }
  });

  return overlay;
}

// Render sections list (main menu)
function renderSectionsList() {
  const content = document.getElementById('helpModalContent');
  const title = document.getElementById('helpModalTitle');
  const backButton = document.querySelector('.help-modal__back');
  const lang = getCurrentLanguage();
  const helpContent = getHelpContent(lang);

  title.textContent = helpContent.title;
  backButton.style.display = 'none';
  currentSection = null;

  const list = document.createElement('div');
  list.className = 'help-sections-list';

  HELP_SECTIONS.forEach(section => {
    const item = document.createElement('div');
    item.className = 'help-section-item';
    item.innerHTML = `
      <span class="help-section-item__icon">${section.icon}</span>
      <span class="help-section-item__title">${helpContent.sections[section.id]}</span>
      <span class="help-section-item__arrow">&rarr;</span>
    `;
    item.addEventListener('click', () => showSection(section.id));
    list.appendChild(item);
  });

  content.innerHTML = '';
  content.appendChild(list);
}

// Show specific section content
function showSection(sectionId) {
  const content = document.getElementById('helpModalContent');
  const title = document.getElementById('helpModalTitle');
  const backButton = document.querySelector('.help-modal__back');
  const lang = getCurrentLanguage();
  const helpContent = getHelpContent(lang);

  title.textContent = helpContent.sections[sectionId];
  backButton.style.display = 'block';
  currentSection = sectionId;

  const sectionContent = document.createElement('div');
  sectionContent.className = 'help-section-content';
  sectionContent.innerHTML = helpContent.content[sectionId];

  content.innerHTML = '';
  content.appendChild(sectionContent);
}

// Show sections list
function showSectionsList() {
  renderSectionsList();
}

// Show help modal
export function showHelpModal() {
  if (!modalOverlay) {
    modalOverlay = createModalElement();
    addHelpModalStyles();
    document.body.appendChild(modalOverlay);
  }

  renderSectionsList();
  modalOverlay.style.display = 'flex';
  document.body.style.overflow = 'hidden';

  console.log('[HelpModal] Opened');
}

// Hide help modal
export function hideHelpModal() {
  if (modalOverlay) {
    modalOverlay.style.display = 'none';
    document.body.style.overflow = '';
    console.log('[HelpModal] Closed');
  }
}

// Add CSS styles for help modal
function addHelpModalStyles() {
  const style = document.createElement('style');
  style.textContent = `
    .help-modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.7);
      display: none;
      align-items: center;
      justify-content: center;
      z-index: 10000;
      backdrop-filter: blur(4px);
    }

    .help-modal {
      background: linear-gradient(135deg, rgba(20, 20, 30, 0.98), rgba(30, 30, 45, 0.98));
      border: 1px solid rgba(0, 255, 255, 0.3);
      border-radius: 16px;
      width: 90%;
      max-width: 600px;
      max-height: 80vh;
      display: flex;
      flex-direction: column;
      box-shadow: 0 0 30px rgba(0, 255, 255, 0.2), 0 10px 40px rgba(0, 0, 0, 0.5);
      animation: helpModalAppear 0.3s ease;
    }

    @keyframes helpModalAppear {
      from {
        opacity: 0;
        transform: scale(0.9) translateY(-20px);
      }
      to {
        opacity: 1;
        transform: scale(1) translateY(0);
      }
    }

    .help-modal__header {
      display: flex;
      align-items: center;
      padding: 16px 20px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      gap: 12px;
    }

    .help-modal__back {
      background: transparent;
      border: none;
      color: #00FFFF;
      font-size: 24px;
      cursor: pointer;
      padding: 4px 8px;
      border-radius: 4px;
      transition: all 0.2s;
    }

    .help-modal__back:hover {
      background: rgba(0, 255, 255, 0.1);
    }

    .help-modal__title {
      flex: 1;
      margin: 0;
      color: #fff;
      font-size: 20px;
      font-weight: 600;
    }

    .help-modal__close {
      background: transparent;
      border: none;
      color: #888;
      font-size: 28px;
      cursor: pointer;
      padding: 4px 12px;
      border-radius: 4px;
      transition: all 0.2s;
      line-height: 1;
    }

    .help-modal__close:hover {
      color: #ff6666;
      background: rgba(255, 102, 102, 0.1);
    }

    .help-modal__content {
      padding: 20px;
      overflow-y: auto;
      flex: 1;
    }

    /* Sections list */
    .help-sections-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .help-section-item {
      display: flex;
      align-items: center;
      padding: 16px 20px;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      cursor: pointer;
      transition: all 0.2s;
      gap: 16px;
    }

    .help-section-item:hover {
      background: rgba(0, 255, 255, 0.1);
      border-color: rgba(0, 255, 255, 0.3);
      transform: translateX(4px);
    }

    .help-section-item__icon {
      font-size: 24px;
      width: 40px;
      text-align: center;
    }

    .help-section-item__title {
      flex: 1;
      color: #fff;
      font-size: 16px;
    }

    .help-section-item__arrow {
      color: #00FFFF;
      font-size: 18px;
      opacity: 0.5;
      transition: all 0.2s;
    }

    .help-section-item:hover .help-section-item__arrow {
      opacity: 1;
      transform: translateX(4px);
    }

    /* Section content */
    .help-section-content {
      color: #ddd;
      line-height: 1.7;
    }

    .help-section-content h3 {
      color: #00FFFF;
      margin: 24px 0 12px 0;
      font-size: 18px;
    }

    .help-section-content h3:first-child {
      margin-top: 0;
    }

    .help-section-content p {
      margin: 0 0 12px 0;
    }

    .help-section-content ul, .help-section-content ol {
      margin: 0 0 16px 0;
      padding-left: 24px;
    }

    .help-section-content li {
      margin-bottom: 8px;
    }

    .help-section-content code {
      background: rgba(0, 255, 255, 0.1);
      color: #00FFFF;
      padding: 2px 6px;
      border-radius: 4px;
      font-family: 'Consolas', 'Monaco', monospace;
      font-size: 14px;
    }

    .help-section-content pre {
      background: rgba(0, 0, 0, 0.4);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 8px;
      padding: 16px;
      overflow-x: auto;
      margin: 16px 0;
    }

    .help-section-content pre code {
      background: transparent;
      padding: 0;
      color: #aaffaa;
    }

    .help-section-content strong {
      color: #fff;
    }

    .help-section-content em {
      color: #ffcc77;
      font-style: normal;
    }

    /* Scrollbar */
    .help-modal__content::-webkit-scrollbar {
      width: 8px;
    }

    .help-modal__content::-webkit-scrollbar-track {
      background: rgba(255, 255, 255, 0.05);
      border-radius: 4px;
    }

    .help-modal__content::-webkit-scrollbar-thumb {
      background: rgba(0, 255, 255, 0.3);
      border-radius: 4px;
    }

    .help-modal__content::-webkit-scrollbar-thumb:hover {
      background: rgba(0, 255, 255, 0.5);
    }
  `;
  document.head.appendChild(style);
}
