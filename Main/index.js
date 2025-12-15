// 导入 Electron 模块
const { app, BrowserWindow } = require('electron');

// Create main window
function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: __dirname + '/preload.js'
        }
    });

    win.loadFile('UI/index.html'); // Updated path to index.html to match project structure
}

// Create window on app startup
app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

// Close app when all windows are closed
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});