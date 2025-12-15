// Components/Background/backgroundController.js - Coordination and Hybrid integration

// IMPORTS
import { createBackgroundRenderer } from './backgroundRenderer.js';
import { createBackgroundSelector } from './backgroundSelector.js';
import { createUITracer } from '../../Utils/uiTracer.js';
import { isValidBackgroundData } from '../../Utils/typeGuards.js';
import { createMyBackgroundBridge, createMyBackgroundGallery } from '../MyBackground/index.js';

// CONFIG
export const BACKGROUND_CONTROLLER_CONFIG = {
    DEFAULT_MODE: 'random'
};

// OPERATIONS
export const createBackgroundController = (businessBridge = null) => {
    const tracer = createUITracer('backgroundController');
    const state = {
        renderer: null,
        selector: null,
        isInitialized: false,
        currentMode: BACKGROUND_CONTROLLER_CONFIG.DEFAULT_MODE
    };
    
    const myBackgroundBridge = createMyBackgroundBridge();

    const handleGallerySelection = async (imagePath) => {
        tracer.trace('gallerySelection:start', { imagePath });

        const result = await myBackgroundBridge.selectMyBackground(imagePath);

        if (result?.success) {
            state.currentMode = 'custom';
            state.renderer.updateModeClass('custom');
            await state.renderer.applyBackground(result.data.backgroundPath);
            tracer.trace('gallerySelection:success');
        } else {
            tracer.trace('gallerySelection:failed', { error: result?.error });
        }
    };

    const handleModeSelection = async (mode) => {
        tracer.trace('modeSelection:start', { mode });

        // Handle MyBackground: Load
        if (mode === 'mybackground:load') {
            tracer.trace('modeSelection:loadMyBackground');

            const result = await myBackgroundBridge.loadMyBackground();

            if (result?.canceled) {
                tracer.trace('modeSelection:loadCanceled');
                return;
            }

            if (result?.success) {
                state.currentMode = 'custom';
                state.renderer.updateModeClass('custom');

                if (result.data?.backgroundPath) {
                    await state.renderer.applyBackground(result.data.backgroundPath);
                }

                tracer.trace('modeSelection:loadSuccess');
            } else {
                tracer.trace('modeSelection:loadFailed', { error: result?.error });
            }
            return;
        }

        // Handle MyBackground: Gallery
        if (mode === 'mybackground:gallery') {
            tracer.trace('modeSelection:openGallery');

            const [imagesResult, settingsResult] = await Promise.all([
                myBackgroundBridge.getMyBackgrounds(),
                myBackgroundBridge.getMyBackgroundSettings()
            ]);

            if (imagesResult?.success) {
                const settings = settingsResult?.success ? settingsResult.data : { randomMode: false };
                const gallery = createMyBackgroundGallery(
                    imagesResult.data.images,
                    handleGallerySelection,
                    settings
                );
                gallery.show();
            } else {
                tracer.trace('modeSelection:galleryFailed', { error: imagesResult?.error });
            }
            return;
        }

        // Handle standard modes (story, random)
        if (!businessBridge) {
            tracer.trace('modeSelection:noBridge');
            return;
        }

        try {
            const result = await businessBridge.setBackgroundMode(mode);

            if (result?.success) {
                state.currentMode = mode;
                state.renderer.updateModeClass(mode);

                if (result.data?.backgroundPath) {
                    await state.renderer.applyBackground(result.data.backgroundPath);
                }

                tracer.trace('modeSelection:success', { mode });
            } else {
                tracer.trace('modeSelection:failed', { mode, error: result?.error });
            }
        } catch (error) {
            tracer.trace('modeSelection:error', { mode, error: error.message });
        }
    };
    
    return {
        initialize: (outerAreaElement) => {
            if (!outerAreaElement?.tagName) {
                tracer.trace('initialize:invalidElement');
                return false;
            }
            
            try {
                state.renderer = createBackgroundRenderer();
                if (!state.renderer.initialize(outerAreaElement)) {
                    throw new Error('Renderer initialization failed');
                }
                
                state.selector = createBackgroundSelector(handleModeSelection);
                if (!state.selector) {
                    throw new Error('Selector creation failed');
                }
                
                outerAreaElement.appendChild(state.selector.elements.gear);
                outerAreaElement.appendChild(state.selector.elements.menu);
                
                state.isInitialized = true;
                tracer.trace('initialize:success');
                return true;
                
            } catch (error) {
                tracer.trace('initialize:error', { error: error.message });
                cleanup();
                return false;
            }
        },
        
        handleBackgroundData: (backgroundData) => {
            if (!state.isInitialized || !isValidBackgroundData(backgroundData)) {
                tracer.trace('handleData:invalid', { initialized: state.isInitialized });
                return;
            }
            
            tracer.trace('handleData:start', { 
                mode: backgroundData.mode,
                hasPath: !!backgroundData.currentPath 
            });
            
            try {
                if (backgroundData.mode && backgroundData.mode !== state.currentMode) {
                    state.currentMode = backgroundData.mode;
                    state.renderer.updateModeClass(backgroundData.mode);
                }
                
                if (backgroundData.currentPath) {
                    state.renderer.applyBackground(backgroundData.currentPath);
                }
            } catch (error) {
                tracer.trace('handleData:error', { error: error.message });
            }
        },
        
        applyBackgroundImmediately: async (imagePath) => {
            if (!state.isInitialized || !imagePath) return false;
            
            tracer.trace('applyImmediate:start', { imagePath });
            
            try {
                const result = await state.renderer.applyBackground(imagePath);
                tracer.trace('applyImmediate:result', { imagePath, success: result });
                return result;
            } catch (error) {
                tracer.trace('applyImmediate:error', { error: error.message });
                return false;
            }
        },
        
        getCurrentState: () => ({
            isInitialized: state.isInitialized,
            currentMode: state.currentMode,
            currentPath: state.renderer?.getCurrentPath() || '',
            isTransitioning: state.renderer?.isTransitioning() || false
        }),
        
        cleanup
    };
    
    function cleanup() {
        tracer.trace('cleanup:start');
        
        if (state.selector) {
            state.selector.cleanup();
            state.selector = null;
        }
        
        if (state.renderer) {
            state.renderer.cleanup();
            state.renderer = null;
        }
        
        state.isInitialized = false;
        state.currentMode = BACKGROUND_CONTROLLER_CONFIG.DEFAULT_MODE;
        
        tracer.trace('cleanup:success');
    }
}; 