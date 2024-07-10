const { contextBridge, ipcRenderer } = require('electron');

console.log("Preload script loaded"); // Preload script'in yüklendiğini kontrol edin

contextBridge.exposeInMainWorld('electron', {
  toggleFullScreen: (isFullScreen) => ipcRenderer.send('toggle-full-screen', isFullScreen)
});
