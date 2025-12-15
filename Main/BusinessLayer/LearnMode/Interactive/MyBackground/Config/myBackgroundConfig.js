// Interactive/MyBackground/Config/myBackgroundConfig.js - MyBackground configuration

import path from 'path';

// CONFIG
export const MY_BACKGROUND_CONFIG = {
    FOLDER_PATH: path.join(process.cwd(), 'MyBackground'),
    SUPPORTED_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.webp', '.gif'],
    MODE_NAME: 'custom'
};

export const DIALOG_OPTIONS = {
    title: 'Select background images',
    filters: [
        { name: 'Images', extensions: ['jpg', 'jpeg', 'png', 'webp', 'gif'] }
    ],
    properties: ['openFile', 'multiSelections']
};
