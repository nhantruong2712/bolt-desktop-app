import { contextBridge, ipcRenderer } from 'electron';

// Expose a safe API to the renderer process
contextBridge.exposeInMainWorld('electron', {
    getAppPath: () => ipcRenderer.invoke('get-app-path'), // Communicate with the main process
});