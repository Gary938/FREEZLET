// Components/WriteModeSelector/writeModeSelector.js - Write Mode selector modal

import { t } from '@UI/i18n/index.js';

// CONFIG
export const WRITE_MODE_SELECTOR_CONFIG = {
    OVERLAY_ID: 'writeModeOverlay',
    MODAL_ID: 'writeModeModal',
    OVERLAY_CLASS: 'write-mode-overlay',
    MODAL_CLASS: 'write-mode-modal',
    TITLE_CLASS: 'write-mode-title',
    BUTTONS_CLASS: 'write-mode-buttons',
    BUTTON_CLASS: 'write-mode-btn',
    STRICT_BTN_CLASS: 'write-mode-btn-strict',
    HINTS_BTN_CLASS: 'write-mode-btn-hints'
};

// OPERATIONS

/**
 * Shows Write Mode selection modal window
 * @returns {Promise<{showHints: boolean}>} - Selected options
 */
export const showWriteModeSelector = () => {
    return new Promise((resolve) => {
        const overlay = createOverlay();
        const modal = createModal(resolve, overlay);

        overlay.appendChild(modal);
        document.body.appendChild(overlay);

        // Focus on first button
        const firstBtn = modal.querySelector(`.${WRITE_MODE_SELECTOR_CONFIG.BUTTON_CLASS}`);
        if (firstBtn) firstBtn.focus();
    });
};

// HELPERS
const createOverlay = () => {
    const overlay = document.createElement('div');
    overlay.id = WRITE_MODE_SELECTOR_CONFIG.OVERLAY_ID;
    overlay.className = WRITE_MODE_SELECTOR_CONFIG.OVERLAY_CLASS;
    return overlay;
};

const createModal = (resolve, overlay) => {
    const modal = document.createElement('div');
    modal.id = WRITE_MODE_SELECTOR_CONFIG.MODAL_ID;
    modal.className = WRITE_MODE_SELECTOR_CONFIG.MODAL_CLASS;

    // Title
    const title = document.createElement('h2');
    title.className = WRITE_MODE_SELECTOR_CONFIG.TITLE_CLASS;
    title.textContent = t('learnMode.selectMode');
    modal.appendChild(title);

    // Buttons container
    const buttonsContainer = document.createElement('div');
    buttonsContainer.className = WRITE_MODE_SELECTOR_CONFIG.BUTTONS_CLASS;

    // "Strict" button
    const strictBtn = createButton(
        t('learnMode.strict'),
        t('learnMode.strictDesc'),
        WRITE_MODE_SELECTOR_CONFIG.STRICT_BTN_CLASS,
        () => {
            closeModal(overlay);
            resolve({ showHints: false });
        }
    );

    // "With hints" button
    const hintsBtn = createButton(
        t('learnMode.withHints'),
        t('learnMode.hintsDesc'),
        WRITE_MODE_SELECTOR_CONFIG.HINTS_BTN_CLASS,
        () => {
            closeModal(overlay);
            resolve({ showHints: true });
        }
    );

    buttonsContainer.appendChild(strictBtn);
    buttonsContainer.appendChild(hintsBtn);
    modal.appendChild(buttonsContainer);

    // Handle Escape key
    const handleKeydown = (e) => {
        if (e.key === 'Escape') {
            document.removeEventListener('keydown', handleKeydown);
            closeModal(overlay);
            resolve({ showHints: false, cancelled: true });
        }
    };
    document.addEventListener('keydown', handleKeydown);

    return modal;
};

const createButton = (title, subtitle, className, onClick) => {
    const btn = document.createElement('button');
    btn.className = `${WRITE_MODE_SELECTOR_CONFIG.BUTTON_CLASS} ${className}`;

    const titleSpan = document.createElement('span');
    titleSpan.className = 'btn-title';
    titleSpan.textContent = title;

    const subtitleSpan = document.createElement('span');
    subtitleSpan.className = 'btn-subtitle';
    subtitleSpan.textContent = subtitle;

    btn.appendChild(titleSpan);
    btn.appendChild(subtitleSpan);
    btn.addEventListener('click', onClick);

    return btn;
};

const closeModal = (overlay) => {
    if (overlay && overlay.parentNode) {
        overlay.parentNode.removeChild(overlay);
    }
};
