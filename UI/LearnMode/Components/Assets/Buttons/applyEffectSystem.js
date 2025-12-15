// Components/Assets/Buttons/applyEffectSystem.js - Advanced button effects system

// IMPORTS
import { createUITracer } from '../../../Utils/uiTracer.js';

// CONFIG
export const EFFECT_SYSTEM_CONFIG = {
    CORRECT_EFFECTS: ['Float', 'GlowLine', 'Glint', 'PulseGlow', 'Wave'],
    INCORRECT_EFFECTS: ['Leaf', 'Explod', 'PortalVanish', 'SmokeDissolveEffect', 'falling', 'ElectricShock', 'Some', 'Freeze'],
    EFFECT_TIMEOUT: 5000,
    RETRY_ATTEMPTS: 2
};

// OPERATIONS
export const applyRandomEffect = async (button, isCorrect) => {
    const tracer = createUITracer('applyEffectSystem');
    tracer.trace('applyRandomEffect:start', { 
        hasButton: !!button, 
        isCorrect,
        buttonText: button?.textContent
    });
    
    // Guard clauses
    if (!button) {
        tracer.trace('applyRandomEffect:noButton');
        return false;
    }
    
    if (!button.parentElement) {
        tracer.trace('applyRandomEffect:noParent');
        return false;
    }
    
    const effectList = isCorrect ? 
        EFFECT_SYSTEM_CONFIG.CORRECT_EFFECTS : 
        EFFECT_SYSTEM_CONFIG.INCORRECT_EFFECTS;
    
    const effectName = selectRandomEffect(effectList);
    const effectType = isCorrect ? 'Correct' : 'Incorrect';
    
    tracer.trace('applyRandomEffect:selected', { 
        effectName, 
        effectType, 
        isCorrect,
        totalEffects: effectList.length
    });
    
    return await loadAndApplyEffect(button, effectType, effectName, tracer);
};

export const applySpecificEffect = async (button, effectName, isCorrect) => {
    const tracer = createUITracer('applyEffectSystem');
    tracer.trace('applySpecificEffect:start', { effectName, isCorrect });
    
    // Guard clauses
    if (!button || !effectName) return false;
    
    const effectType = isCorrect ? 'Correct' : 'Incorrect';
    const effectList = isCorrect ? 
        EFFECT_SYSTEM_CONFIG.CORRECT_EFFECTS : 
        EFFECT_SYSTEM_CONFIG.INCORRECT_EFFECTS;
    
    if (!effectList.includes(effectName)) {
        tracer.trace('applySpecificEffect:effectNotFound', { effectName, effectType });
        return false;
    }
    
    return await loadAndApplyEffect(button, effectType, effectName, tracer);
};

// HELPERS
const selectRandomEffect = (effectList) => {
    return effectList[Math.floor(Math.random() * effectList.length)];
};

const loadAndApplyEffect = async (button, effectType, effectName, tracer) => {
    try {
        const module = await import(`./${effectType}/${effectName}.js`);
        
        if (!module?.applyEffect) {
            tracer.trace('loadAndApplyEffect:noApplyFunction', { effectName, effectType });
            return false;
        }
        
        // Apply effect with hang protection
        const effectPromise = Promise.resolve(module.applyEffect(button));
        const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Effect timeout')), EFFECT_SYSTEM_CONFIG.EFFECT_TIMEOUT)
        );
        
        await Promise.race([effectPromise, timeoutPromise]);
        
        tracer.trace('loadAndApplyEffect:success', { effectName, effectType });
        return true;
        
    } catch (error) {
        tracer.trace('loadAndApplyEffect:error', { 
            effectName, 
            effectType, 
            error: error.message 
        });
        return false;
    }
};

const validateButton = (button) => {
    return button && 
           button.nodeType === Node.ELEMENT_NODE && 
           button.parentElement;
}; 