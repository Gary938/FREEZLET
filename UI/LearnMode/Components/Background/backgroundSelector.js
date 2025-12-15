// Components/Background/backgroundSelector.js - Background mode UI selector

// IMPORTS
import { createUITracer } from '../../Utils/uiTracer.js';

// CONFIG
export const BACKGROUND_SELECTOR_CONFIG = {
    CSS_CLASSES: {
        GEAR: 'background-mode-gear',
        MENU: 'background-mode-menu',
        OPTION: 'background-mode-option',
        MENU_SHOW: 'show'
    },
    MENU_OPTIONS: [
        { mode: 'story', text: 'Story Background' },
        { mode: 'random', text: 'Random Background' },
        { mode: 'mybackground:load', text: 'Load Background' },
        { mode: 'mybackground:gallery', text: 'My Backgrounds' }
    ],
    GEAR_ICON: '⚙️',
    GEAR_TITLE: 'Background settings'
};

// OPERATIONS
export const createBackgroundSelector = (onModeSelectCallback) => {
    const tracer = createUITracer('backgroundSelector');
    
    if (!onModeSelectCallback || typeof onModeSelectCallback !== 'function') {
        tracer.trace('create:invalidCallback');
        return null;
    }
    
    const state = { isMenuVisible: false, documentClickHandler: null };
    const elements = createElements();
    setupEventListeners(elements, state, onModeSelectCallback, tracer);
    
    tracer.trace('create:success');
    
    return {
        elements,
        
        toggle: () => {
            toggleMenuVisibility(elements.menu, state);
        },
        
        cleanup: () => {
            if (state.documentClickHandler) {
                document.removeEventListener('click', state.documentClickHandler);
            }
            removeElementSafely(elements.gear);
            removeElementSafely(elements.menu);
            Object.assign(state, { isMenuVisible: false, documentClickHandler: null });
            tracer.trace('cleanup:success');
        }
    };
};

// HELPERS
const createElements = () => {
    const gear = document.createElement('div');
    gear.className = BACKGROUND_SELECTOR_CONFIG.CSS_CLASSES.GEAR;
    gear.textContent = BACKGROUND_SELECTOR_CONFIG.GEAR_ICON;
    gear.title = BACKGROUND_SELECTOR_CONFIG.GEAR_TITLE;
    
    const menu = document.createElement('div');
    menu.className = BACKGROUND_SELECTOR_CONFIG.CSS_CLASSES.MENU;
    
    BACKGROUND_SELECTOR_CONFIG.MENU_OPTIONS.forEach(({ mode, text }) => {
        const option = document.createElement('div');
        option.className = BACKGROUND_SELECTOR_CONFIG.CSS_CLASSES.OPTION;
        option.textContent = text;
        option.dataset.mode = mode;
        menu.appendChild(option);
    });
    
    return { gear, menu };
};

const setupEventListeners = (elements, state, callback, tracer) => {
    // Gear click
    elements.gear.addEventListener('click', (event) => {
        event.stopPropagation();
        toggleMenuVisibility(elements.menu, state);
    });
    
    // Menu options click
    elements.menu.addEventListener('click', (event) => {
        event.stopPropagation();
        
        const option = event.target.closest(`.${BACKGROUND_SELECTOR_CONFIG.CSS_CLASSES.OPTION}`);
        if (option?.dataset.mode) {
            handleModeSelection(option.dataset.mode, elements.menu, state, callback, tracer);
        }
    });
    
    // Close menu on outside click
    state.documentClickHandler = (event) => {
        if (state.isMenuVisible && 
            !elements.gear.contains(event.target) && 
            !elements.menu.contains(event.target)) {
            setMenuVisibility(elements.menu, state, false);
        }
    };
    
    document.addEventListener('click', state.documentClickHandler);
};

const toggleMenuVisibility = (menuElement, state) => {
    setMenuVisibility(menuElement, state, !state.isMenuVisible);
};

const setMenuVisibility = (menuElement, state, visible) => {
    if (visible) {
        menuElement.classList.add(BACKGROUND_SELECTOR_CONFIG.CSS_CLASSES.MENU_SHOW);
    } else {
        menuElement.classList.remove(BACKGROUND_SELECTOR_CONFIG.CSS_CLASSES.MENU_SHOW);
    }
    state.isMenuVisible = visible;
};

const handleModeSelection = (mode, menuElement, state, callback, tracer) => {
    tracer.trace('modeSelection:start', { mode });
    
    setMenuVisibility(menuElement, state, false);
    
    try {
        callback(mode);
        tracer.trace('modeSelection:success', { mode });
    } catch (error) {
        tracer.trace('modeSelection:error', { mode, error: error.message });
    }
};

const removeElementSafely = (element) => {
    if (element?.parentNode) {
        element.parentNode.removeChild(element);
    }
}; 