const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
    getSystemInformation: () => ipcRenderer.invoke('application-ready'),
    updateStore: (data) => ipcRenderer.invoke('store-data-updated', data),
    hydrateStore: (callback) => ipcRenderer.on('hydrate-store', (event, ...args) => callback(...args)),
    minimizeApp: () => ipcRenderer.invoke('minimize-app'),
    maximizeApp: () => ipcRenderer.invoke('maximize-app'),
    closeApp: () => ipcRenderer.invoke('quit-app'),
});
