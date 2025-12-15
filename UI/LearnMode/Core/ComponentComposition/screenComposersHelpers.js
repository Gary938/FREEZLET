// Core/ComponentComposition/screenComposersHelpers.js - Helper functions for composers

// IMPORTS
import { createExplosionEffects } from '../../Components/Pacman/Effects/index.js';
import { PACMAN_CONFIG } from '../../Components/Pacman/pacmanConfig.js';

// OPERATIONS

/**
 * Triggers pacman explosion effect on results display
 */
export const explodePacmanOnResults = (tracer) => {
    setTimeout(() => {
        try {
            const pacmanContainer = document.getElementById(PACMAN_CONFIG.CONTAINER_ID);
            if (!pacmanContainer) {
                tracer.trace('pacmanExplosion:containerNotFound');
                return;
            }

            const pacmanElement = pacmanContainer.querySelector(`.${PACMAN_CONFIG.PACMAN_CLASS}`);
            if (!pacmanElement) {
                tracer.trace('pacmanExplosion:pacmanNotFound');
                return;
            }

            createExplosionEffects(pacmanContainer, pacmanElement);
            tracer.trace('pacmanExplosion:success', {
                containerFound: true,
                pacmanFound: true,
                explosionTriggered: true
            });

        } catch (error) {
            tracer.trace('pacmanExplosion:error', { error: error.message });
        }
    }, 500);
};
