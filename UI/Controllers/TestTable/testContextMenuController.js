// UI/Controllers/TestTable/testContextMenuController.js
// Controller for test context menu

import { contextMenuService } from '../ContextMenu/contextMenuService.js';
import { modalService } from '../Modal/modalService.js';
import { createLogger } from '../../Utils/loggerService.js';
import { testTableBridge } from '../../Bridge/TestTable/index.js';
import { uiEventDispatcher } from '../uiEventDispatcher.js';
import { t } from '../../i18n/index.js';

const logger = createLogger('UI/TestTable/ContextMenuController');

/**
 * Handles test rename action
 * @param {string} testPath - Path to test
 */
async function handleRenameTestClick(testPath) {
  try {
    logger.debug(`Rename request for test: ${testPath}`);

    // Extract current name from path (without .txt extension)
    const pathParts = testPath.split('/');
    const currentFileName = pathParts[pathParts.length - 1];
    const currentName = currentFileName.replace('.txt', '');

    // Show prompt with current name
    const newName = await modalService.prompt(
      t('test.renameTitle') || 'Rename Test',
      currentName
    );

    // If cancelled or empty
    if (!newName || newName.trim() === '') {
      logger.debug('Rename cancelled by user');
      return;
    }

    // If name didn't change
    if (newName.trim() === currentName) {
      logger.debug('Name unchanged, skipping rename');
      return;
    }

    // Call bridge to rename
    const result = await testTableBridge.renameTest(testPath, newName.trim());

    if (result.success) {
      logger.success(`Test renamed: ${result.oldPath} → ${result.newPath}`);

      // Dispatch event to refresh table
      uiEventDispatcher.dispatch(uiEventDispatcher.events.TESTS_UPDATED, {
        action: 'rename',
        oldPath: result.oldPath,
        newPath: result.newPath,
        timestamp: Date.now()
      });
    } else {
      logger.error(`Rename error: ${result.error}`);
      await modalService.alert(
        result.error || t('test.renameError') || 'Failed to rename test',
        t('modal.error') || 'Error'
      );
    }
  } catch (error) {
    logger.error(`Error handling rename: ${error.message}`, error);
    await modalService.alert(
      error.message,
      t('modal.error') || 'Error'
    );
  }
}

/**
 * Handles test edit action
 * @param {string} testPath - Path to test
 */
async function handleEditTestClick(testPath) {
  try {
    logger.debug(`Edit request for test: ${testPath}`);

    // Get current content
    const contentResult = await testTableBridge.getTestContent(testPath);

    if (!contentResult.success) {
      logger.error(`Error getting content: ${contentResult.error}`);
      await modalService.alert(
        contentResult.error || t('test.getContentError') || 'Failed to get test content',
        t('modal.error') || 'Error'
      );
      return;
    }

    // Show textarea with current content
    const newContent = await modalService.textareaPrompt(
      t('test.editTitle') || 'Edit Test',
      contentResult.content
    );

    // If cancelled
    if (newContent === null) {
      logger.debug('Edit cancelled by user');
      return;
    }

    // If content didn't change
    if (newContent === contentResult.content) {
      logger.debug('Content unchanged, skipping update');
      return;
    }

    // Call bridge to update content
    const updateResult = await testTableBridge.updateTestContent(testPath, newContent);

    if (updateResult.success) {
      logger.success(`Test content updated: ${updateResult.path} (${updateResult.questions} questions)`);

      // Dispatch event to refresh table
      uiEventDispatcher.dispatch(uiEventDispatcher.events.TESTS_UPDATED, {
        action: 'update',
        path: testPath,
        questions: updateResult.questions,
        timestamp: Date.now()
      });
    } else {
      logger.error(`Update error: ${updateResult.error}`);
      await modalService.alert(
        updateResult.error || t('test.updateError') || 'Failed to update test',
        t('modal.error') || 'Error'
      );
    }
  } catch (error) {
    logger.error(`Error handling edit: ${error.message}`, error);
    await modalService.alert(
      error.message,
      t('modal.error') || 'Error'
    );
  }
}

/**
 * Builds and displays context menu for test
 * @param {string} testPath - Path to test
 * @param {Object|Event} position - Position or event
 * @returns {HTMLElement|null} - Context menu DOM element
 */
export function showTestContextMenu(testPath, position) {
  try {
    logger.info(`Opening context menu for test: ${testPath}`);

    // Build menu items
    const menuItems = [
      // Rename item
      contextMenuService.item(t('contextMenu.rename') || 'Rename', () => {
        logger.debug(`Click on "Rename" for ${testPath}`);
        handleRenameTestClick(testPath);
      }, { icon: '✏️' }),

      // Edit item
      contextMenuService.item(t('contextMenu.edit') || 'Edit', () => {
        logger.debug(`Click on "Edit" for ${testPath}`);
        handleEditTestClick(testPath);
      }, { icon: '📝' })
    ];

    logger.debug(`Created menu with ${menuItems.length} items for test ${testPath}`);

    // Display menu
    const menuElement = contextMenuService.show(menuItems, position);

    if (!menuElement) {
      logger.error(`Failed to create menu for test ${testPath}`);
    } else {
      logger.debug(`Menu for test ${testPath} successfully displayed`);
    }

    return menuElement;
  } catch (error) {
    logger.error(`Error displaying context menu for test ${testPath}`, error);
    return null;
  }
}

/**
 * Sets up handler for menu icon click
 * @param {HTMLElement} menuIcon - Icon DOM element
 * @param {string} testPath - Path to test
 */
export function setupTestMenuIconHandler(menuIcon, testPath) {
  try {
    logger.debug(`Setting up handler for test menu icon: ${testPath}`);

    menuIcon.addEventListener('click', (event) => {
      event.stopPropagation();
      logger.debug(`Click on menu icon for test: ${testPath}`);

      showTestContextMenu(testPath, {
        top: event.clientY,
        left: event.clientX
      });
    });

    logger.debug(`Handler for test menu icon successfully set: ${testPath}`);
  } catch (error) {
    logger.error(`Error setting up menu icon handler: ${error.message}`, error);
  }
}

/**
 * Sets up context menu handler for test row
 * @param {HTMLElement} row - Test row DOM element
 * @param {string} testPath - Path to test
 */
export function setupTestContextMenuHandler(row, testPath) {
  try {
    logger.debug(`Setting up context menu handler for test: ${testPath}`);

    row.addEventListener('contextmenu', (event) => {
      event.preventDefault();
      logger.debug(`Right click on test: ${testPath}`);

      showTestContextMenu(testPath, event);
    });

    logger.debug(`Context menu handler for test successfully set: ${testPath}`);
  } catch (error) {
    logger.error(`Error setting up context menu handler: ${error.message}`, error);
  }
}
