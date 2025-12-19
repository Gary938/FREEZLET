// Components/Background/backgroundRenderer.js - Background rendering with effects

// IMPORTS
import { createUITracer } from '../../Utils/uiTracer.js';
import { escapeCSSUrl } from '../../Utils/domValidator.js';

// CONFIG
export const BACKGROUND_RENDERER_CONFIG = {
    PRELOAD_TIMEOUT: 10000,
    ADAPTIVE_BREAKPOINT: { WIDTH: 1366, HEIGHT: 768 },
    CSS_CLASSES: { STORY: 'background-story', RANDOM: 'background-random', CUSTOM: 'background-custom' }
};

// OPERATIONS
export const createBackgroundRenderer = () => {
    const tracer = createUITracer('backgroundRenderer');
    let targetElement = null;
    let currentImagePath = '';
    
    return {
        initialize: (outerAreaElement) => {
            if (!outerAreaElement?.tagName) return false;
            
            targetElement = outerAreaElement;
            targetElement.classList.add(BACKGROUND_RENDERER_CONFIG.CSS_CLASSES.STORY);
            tracer.trace('initialize:success');
            return true;
        },
        
        applyBackground: async (imagePath) => {
            if (!targetElement || !imagePath) return false;
            
            tracer.trace('applyBackground:start', { imagePath });
            
            try {
                const imageLoaded = await preloadImage(imagePath);
                if (imageLoaded) {
                    await applyWithTransition(targetElement, imagePath);
                    currentImagePath = imagePath;
                }
                
                tracer.trace('applyBackground:success', { imagePath });
                return imageLoaded;
            } catch (error) {
                tracer.trace('applyBackground:error', { error: error.message });
                return false;
            }
        },
        
        updateModeClass: (mode) => {
            if (!targetElement || !['story', 'random', 'custom'].includes(mode)) return;

            const { STORY, RANDOM, CUSTOM } = BACKGROUND_RENDERER_CONFIG.CSS_CLASSES;
            targetElement.classList.remove(STORY, RANDOM, CUSTOM);

            if (mode === 'story') {
                targetElement.classList.add(STORY);
            } else if (mode === 'random') {
                targetElement.classList.add(RANDOM);
            } else if (mode === 'custom') {
                targetElement.classList.add(CUSTOM);
            }

            tracer.trace('updateModeClass:success', { mode });
        },
        
        getCurrentPath: () => currentImagePath,
        
        cleanup: () => {
            if (!targetElement) return;
            
            const stylesToRemove = ['backgroundImage', 'backgroundRepeat', 'backgroundPosition',
                'backgroundAttachment', 'backgroundColor', 'backgroundSize',
                'opacity'];
            
            stylesToRemove.forEach(prop => {
                targetElement.style.removeProperty(prop);
            });
            
            // Remove CSS classes
            Object.values(BACKGROUND_RENDERER_CONFIG.CSS_CLASSES).forEach(className => {
                targetElement?.classList.remove(className);
            });
        }
    };
};

// HELPERS
const preloadImage = (imagePath) => {
    return new Promise((resolve) => {
        const img = new Image();
        const timeout = setTimeout(() => resolve(false), BACKGROUND_RENDERER_CONFIG.PRELOAD_TIMEOUT);
        
        img.onload = () => { clearTimeout(timeout); resolve(true); };
        img.onerror = () => { clearTimeout(timeout); resolve(false); };
        img.src = imagePath;
    });
};

const applyWithTransition = (element, imagePath) => {
    return new Promise((resolve) => {
        const tracer = createUITracer('instantChange');
        tracer.trace('instantChange:start', { imagePath });
        
        // Instant style setup WITHOUT transition
        Object.assign(element.style, {
            backgroundImage: `url("${escapeCSSUrl(imagePath)}")`,
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center center",
            backgroundAttachment: "fixed",
            backgroundColor: "#000",
            backgroundSize: getAdaptiveSize(),
            opacity: "1"  // Immediately visible background
        });
        
        tracer.trace('instantChange:complete', { imagePath });
        resolve();
    });
};

const getAdaptiveSize = () => {
    const { WIDTH, HEIGHT } = BACKGROUND_RENDERER_CONFIG.ADAPTIVE_BREAKPOINT;
    return (window.screen.width <= WIDTH && window.screen.height <= HEIGHT) ? "100% 100%" : "cover";
}; 