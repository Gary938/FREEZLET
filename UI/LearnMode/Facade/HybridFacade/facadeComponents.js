// Facade/HybridFacade/facadeComponents.js - Facade component management

// CONFIG
export const COMPONENTS_CONFIG = {
    INITIALIZATION_TIMEOUT: 5000,
    ERROR_CODES: {
        CONTROLLER_FAILED: 'CONTROLLER_CREATION_FAILED',
        UI_INIT_FAILED: 'UI_INITIALIZATION_FAILED'
    }
};

// OPERATIONS
export const recreateComponents = async (testPath, createEventCoordinator, createHybridController, renderInitialUI, handleClose, tracer, options = {}) => {
    tracer.trace('recreateComponents:begin', { testPath, mode: options.mode });

    const eventCoordinator = createEventCoordinator();

    eventCoordinator.subscribe('LEARN_MODE_CLOSE', () => {
        handleClose();
    });

    tracer.trace('recreateComponents:creatingController', { testPath, mode: options.mode });
    const controller = await createHybridController(testPath, options);

    tracer.trace('recreateComponents:renderingUI', { testPath });
    // Delegate rendering to Components layer
    await renderInitialUI(controller, eventCoordinator, tracer);

    tracer.trace('recreateComponents:success', { testPath, mode: options.mode });
    return { eventCoordinator, controller };
};

export const initializeUI = async (testPath, isolationManager, createHybridController, renderInitialUI, eventCoordinator, tracer, options = {}) => {
    await isolationManager.hideMainUI();
    const controller = await createHybridController(testPath, options);

    // Delegate rendering to Components layer
    await renderInitialUI(controller, eventCoordinator, tracer);

    return controller;
}; 