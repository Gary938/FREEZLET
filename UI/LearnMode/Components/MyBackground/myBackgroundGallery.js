// Components/MyBackground/myBackgroundGallery.js - Gallery component for custom backgrounds

// IMPORTS
import { createUITracer } from '../../Utils/uiTracer.js';
import { escapeCSSUrl } from '../../Utils/domValidator.js';
import { createMyBackgroundBridge } from './myBackgroundBridge.js';

// CONFIG
export const GALLERY_CONFIG = {
    CSS_CLASSES: {
        OVERLAY: 'mybackground-gallery-overlay',
        CONTAINER: 'mybackground-gallery-container',
        HEADER: 'mybackground-gallery-header',
        TITLE: 'mybackground-gallery-title',
        CLOSE_BTN: 'mybackground-gallery-close',
        GRID: 'mybackground-gallery-grid',
        ITEM: 'mybackground-gallery-item',
        ITEM_SELECTED: 'selected',
        EMPTY: 'mybackground-gallery-empty',
        FOOTER: 'mybackground-gallery-footer',
        SELECT_BTN: 'mybackground-gallery-select',
        DELETE_BTN: 'mybackground-gallery-delete',
        MODE_TOGGLE: 'mybackground-mode-toggle',
        TOGGLE_LABEL: 'toggle-label',
        TOGGLE_CHECKBOX: 'toggle-checkbox',
        TOGGLE_SLIDER: 'toggle-slider',
        CONFIRM_OVERLAY: 'mybackground-confirm-overlay',
        CONFIRM_DIALOG: 'mybackground-confirm-dialog',
        CONFIRM_TEXT: 'mybackground-confirm-text',
        CONFIRM_BUTTONS: 'mybackground-confirm-buttons',
        CONFIRM_YES: 'mybackground-confirm-yes',
        CONFIRM_NO: 'mybackground-confirm-no'
    },
    TEXT: {
        TITLE: 'My Backgrounds',
        EMPTY: 'No backgrounds loaded yet. Use "Load Background" to add images.',
        SELECT: 'Select',
        DELETE: 'Delete',
        CLOSE: '✕',
        STATIC: 'Static',
        RANDOM: 'Random',
        CONFIRM_DELETE: 'Delete selected images?',
        CONFIRM_YES: 'Yes',
        CONFIRM_NO: 'No'
    }
};

// OPERATIONS
export const createMyBackgroundGallery = (images, onSelectCallback, settings = { randomMode: false }) => {
    const tracer = createUITracer('myBackgroundGallery');
    const bridge = createMyBackgroundBridge();
    const selectedImages = new Set();
    let elements = null;
    let currentRandomMode = settings?.randomMode || false;
    let currentImages = [...(images || [])];

    tracer.trace('create:start', { imageCount: currentImages.length, randomMode: currentRandomMode });

    const buildDOM = () => {
        // Overlay
        const overlay = document.createElement('div');
        overlay.className = GALLERY_CONFIG.CSS_CLASSES.OVERLAY;

        // Container
        const container = document.createElement('div');
        container.className = GALLERY_CONFIG.CSS_CLASSES.CONTAINER;

        // Header
        const header = document.createElement('div');
        header.className = GALLERY_CONFIG.CSS_CLASSES.HEADER;

        const title = document.createElement('h2');
        title.className = GALLERY_CONFIG.CSS_CLASSES.TITLE;
        title.textContent = GALLERY_CONFIG.TEXT.TITLE;

        // Mode toggle (Static/Random)
        const modeToggle = document.createElement('div');
        modeToggle.className = GALLERY_CONFIG.CSS_CLASSES.MODE_TOGGLE;

        const toggleLabel = document.createElement('label');
        toggleLabel.className = GALLERY_CONFIG.CSS_CLASSES.TOGGLE_LABEL;

        const staticText = document.createElement('span');
        staticText.textContent = GALLERY_CONFIG.TEXT.STATIC;

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = GALLERY_CONFIG.CSS_CLASSES.TOGGLE_CHECKBOX;
        checkbox.checked = currentRandomMode;

        const slider = document.createElement('span');
        slider.className = GALLERY_CONFIG.CSS_CLASSES.TOGGLE_SLIDER;

        const randomText = document.createElement('span');
        randomText.textContent = GALLERY_CONFIG.TEXT.RANDOM;

        checkbox.addEventListener('change', async (e) => {
            const enabled = e.target.checked;
            tracer.trace('randomMode:change', { enabled });

            const result = await bridge.setMyBackgroundRandomMode(enabled);
            if (result.success) {
                currentRandomMode = enabled;
                tracer.trace('randomMode:saved', { enabled });
            } else {
                tracer.trace('randomMode:error', { error: result.error });
                e.target.checked = currentRandomMode;
            }
        });

        toggleLabel.appendChild(staticText);
        toggleLabel.appendChild(checkbox);
        toggleLabel.appendChild(slider);
        toggleLabel.appendChild(randomText);
        modeToggle.appendChild(toggleLabel);

        const closeBtn = document.createElement('button');
        closeBtn.className = GALLERY_CONFIG.CSS_CLASSES.CLOSE_BTN;
        closeBtn.textContent = GALLERY_CONFIG.TEXT.CLOSE;
        closeBtn.addEventListener('click', cleanup);

        header.appendChild(title);
        header.appendChild(modeToggle);
        header.appendChild(closeBtn);

        // Grid or Empty message
        const grid = document.createElement('div');
        grid.className = GALLERY_CONFIG.CSS_CLASSES.GRID;

        renderGridItems(grid);

        // Footer with select and delete buttons
        const footer = document.createElement('div');
        footer.className = GALLERY_CONFIG.CSS_CLASSES.FOOTER;

        const deleteBtn = document.createElement('button');
        deleteBtn.className = GALLERY_CONFIG.CSS_CLASSES.DELETE_BTN;
        deleteBtn.textContent = GALLERY_CONFIG.TEXT.DELETE;
        deleteBtn.disabled = true;
        deleteBtn.addEventListener('click', handleDelete);

        const selectBtn = document.createElement('button');
        selectBtn.className = GALLERY_CONFIG.CSS_CLASSES.SELECT_BTN;
        selectBtn.textContent = GALLERY_CONFIG.TEXT.SELECT;
        selectBtn.disabled = true;
        selectBtn.addEventListener('click', handleSelect);

        footer.appendChild(deleteBtn);
        footer.appendChild(selectBtn);

        // Assemble
        container.appendChild(header);
        container.appendChild(grid);
        container.appendChild(footer);
        overlay.appendChild(container);

        // Close on overlay click
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) cleanup();
        });

        // Close on Escape
        const handleKeydown = (e) => {
            if (e.key === 'Escape') cleanup();
        };
        document.addEventListener('keydown', handleKeydown);

        elements = { overlay, container, grid, selectBtn, deleteBtn, handleKeydown };
        return overlay;
    };

    const renderGridItems = (grid) => {
        grid.innerHTML = '';

        if (!currentImages || currentImages.length === 0) {
            const empty = document.createElement('div');
            empty.className = GALLERY_CONFIG.CSS_CLASSES.EMPTY;
            empty.textContent = GALLERY_CONFIG.TEXT.EMPTY;
            grid.appendChild(empty);
        } else {
            currentImages.forEach(imagePath => {
                const item = document.createElement('div');
                item.className = GALLERY_CONFIG.CSS_CLASSES.ITEM;
                item.style.backgroundImage = `url('${escapeCSSUrl(imagePath)}')`;
                item.dataset.path = imagePath;

                if (selectedImages.has(imagePath)) {
                    item.classList.add(GALLERY_CONFIG.CSS_CLASSES.ITEM_SELECTED);
                }

                item.addEventListener('click', () => handleItemClick(item, imagePath));
                grid.appendChild(item);
            });
        }
    };

    const handleItemClick = (item, imagePath) => {
        // Toggle selection
        if (selectedImages.has(imagePath)) {
            selectedImages.delete(imagePath);
            item.classList.remove(GALLERY_CONFIG.CSS_CLASSES.ITEM_SELECTED);
        } else {
            selectedImages.add(imagePath);
            item.classList.add(GALLERY_CONFIG.CSS_CLASSES.ITEM_SELECTED);
        }

        updateButtonStates();
        tracer.trace('itemToggled', { imagePath, selected: selectedImages.has(imagePath), totalSelected: selectedImages.size });
    };

    const updateButtonStates = () => {
        if (elements) {
            const hasSelection = selectedImages.size > 0;
            elements.selectBtn.disabled = selectedImages.size !== 1;
            elements.deleteBtn.disabled = !hasSelection;
        }
    };

    const handleSelect = () => {
        if (selectedImages.size === 1 && onSelectCallback) {
            const imagePath = [...selectedImages][0];
            tracer.trace('select:confirm', { imagePath });
            onSelectCallback(imagePath);
            cleanup();
        }
    };

    const handleDelete = async () => {
        if (selectedImages.size === 0) return;

        const confirmed = await showConfirmDialog();
        if (!confirmed) return;

        tracer.trace('delete:start', { count: selectedImages.size });

        const pathsToDelete = [...selectedImages];
        const result = await bridge.deleteMyBackgrounds(pathsToDelete);

        if (result.success) {
            tracer.trace('delete:success', {
                deletedCount: result.data.deleted?.length,
                failedCount: result.data.failed?.length
            });

            // Remove deleted images from current list
            currentImages = currentImages.filter(img => !result.data.deleted.includes(img));
            selectedImages.clear();

            // Re-render grid
            if (elements?.grid) {
                renderGridItems(elements.grid);
            }
            updateButtonStates();
        } else {
            tracer.trace('delete:error', { error: result.error });
        }
    };

    const showConfirmDialog = () => {
        return new Promise((resolve) => {
            const confirmOverlay = document.createElement('div');
            confirmOverlay.className = GALLERY_CONFIG.CSS_CLASSES.CONFIRM_OVERLAY;

            const dialog = document.createElement('div');
            dialog.className = GALLERY_CONFIG.CSS_CLASSES.CONFIRM_DIALOG;

            const text = document.createElement('div');
            text.className = GALLERY_CONFIG.CSS_CLASSES.CONFIRM_TEXT;
            text.textContent = `${GALLERY_CONFIG.TEXT.CONFIRM_DELETE} (${selectedImages.size})`;

            const buttons = document.createElement('div');
            buttons.className = GALLERY_CONFIG.CSS_CLASSES.CONFIRM_BUTTONS;

            const noBtn = document.createElement('button');
            noBtn.className = GALLERY_CONFIG.CSS_CLASSES.CONFIRM_NO;
            noBtn.textContent = GALLERY_CONFIG.TEXT.CONFIRM_NO;

            const yesBtn = document.createElement('button');
            yesBtn.className = GALLERY_CONFIG.CSS_CLASSES.CONFIRM_YES;
            yesBtn.textContent = GALLERY_CONFIG.TEXT.CONFIRM_YES;

            const closeDialog = (result) => {
                if (confirmOverlay.parentNode) {
                    confirmOverlay.parentNode.removeChild(confirmOverlay);
                }
                resolve(result);
            };

            noBtn.addEventListener('click', () => closeDialog(false));
            yesBtn.addEventListener('click', () => closeDialog(true));
            confirmOverlay.addEventListener('click', (e) => {
                if (e.target === confirmOverlay) closeDialog(false);
            });

            buttons.appendChild(noBtn);
            buttons.appendChild(yesBtn);
            dialog.appendChild(text);
            dialog.appendChild(buttons);
            confirmOverlay.appendChild(dialog);

            document.body.appendChild(confirmOverlay);
            requestAnimationFrame(() => confirmOverlay.classList.add('active'));
        });
    };

    function cleanup() {
        if (elements) {
            document.removeEventListener('keydown', elements.handleKeydown);
            if (elements.overlay.parentNode) {
                elements.overlay.parentNode.removeChild(elements.overlay);
            }
            elements = null;
            selectedImages.clear();
            tracer.trace('cleanup:done');
        }
    }

    return {
        show: () => {
            const overlay = buildDOM();
            document.body.appendChild(overlay);
            // Trigger animation
            requestAnimationFrame(() => {
                overlay.classList.add('active');
            });
            tracer.trace('show:done');
        },
        cleanup
    };
};
