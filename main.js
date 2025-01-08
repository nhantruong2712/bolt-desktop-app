import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(
    import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow;

process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});


app.on('ready', () => {
    mainWindow = new BrowserWindow({
        width: 1280,
        height: 720,
        webPreferences: {
            contextIsolation: true,
            nodeIntegration: false, // For security, nodeIntegration should be false
            preload: path.join(__dirname, 'preload.js'), // Preload script to expose API to renderer
            icon: path.join(__dirname, 'icons/favicon.ico'),
        },
    });

    mainWindow.loadURL('https://bolt-desktop-app.vercel.app');

    // Expose __dirname to renderer process via IPC
    ipcMain.handle('get-app-path', () => {
        return __dirname; // This will return the directory of the main process
    });
});

app.on('window-all-closed', () => {
    app.quit();
});

app.on('ready', () => {
    app.setAppUserModelId(process.execPath); // Ensure correct app ID
});