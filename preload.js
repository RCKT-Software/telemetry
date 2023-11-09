const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
    getSystemInformation: () => ipcRenderer.invoke('application-ready'),
    updateStore: (data) => ipcRenderer.invoke('store-data-updated', data)
});

// Handle user minimizing the application
window.addEventListener('DOMContentLoaded', () => {
    document.getElementById('minimize-app').addEventListener('click', () => {
        ipcRenderer.invoke('minimize-app').then();
    });
});

// Handle user maximizing the application
window.addEventListener('DOMContentLoaded', () => {
    document.getElementById('maximize-app').addEventListener('click', () => {
        ipcRenderer.invoke('maximize-app').then();
    });
});

// Handle user closing the application window
window.addEventListener('DOMContentLoaded', () => {
    document.getElementById('close-app').addEventListener('click', () => {
        ipcRenderer.invoke('quit-app').then();
    });
});
