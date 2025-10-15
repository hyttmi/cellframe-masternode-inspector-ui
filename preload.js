const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
    onDeepLink: (callback) => ipcRenderer.on('deep-link', (event, url) => callback(url)),
    removeDeepLinkListener: () => ipcRenderer.removeAllListeners('deep-link')
});
