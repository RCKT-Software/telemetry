const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
    getSystemInformation: () => ipcRenderer.invoke('application-ready'),
    updateStore: (data) => ipcRenderer.invoke('store-data-updated', data),
    hydrateStore: (callback) => ipcRenderer.on('hydrate-store', (event, ...args) => callback(...args)),
});

// Delegate events for minimizing the application
window.addEventListener('DOMContentLoaded', () => {
    document.body.addEventListener('click', (event) => {
        if (event.target.classList.contains('minimize-app')) {
            ipcRenderer.invoke('minimize-app').then();
        }
    });
});

// Delegate events for maximizing the application
window.addEventListener('DOMContentLoaded', () => {
    document.body.addEventListener('click', (event) => {
        if (event.target.classList.contains('maximize-app')) {
            ipcRenderer.invoke('maximize-app').then();
        }
    });
});

// Delegate events for closing the application window
window.addEventListener('DOMContentLoaded', () => {
    document.body.addEventListener('click', (event) => {
        if (event.target.classList.contains('close-app')) {
            ipcRenderer.invoke('quit-app').then();
        }
    });
});
