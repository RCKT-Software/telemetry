const { contextBridge, ipcRenderer, shell } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
    openLink: (url) => shell.openExternal(url),
    getSystemInformation: () => ipcRenderer.invoke('application-ready'),
    updateStore: (data) => ipcRenderer.invoke('store-data-updated', data),
    hydrateStore: (callback) => ipcRenderer.on('hydrate-store', (event, ...args) => callback(...args)),
    minimizeApp: () => ipcRenderer.invoke('minimize-app'),
    maximizeApp: () => ipcRenderer.invoke('maximize-app'),
    closeApp: () => ipcRenderer.invoke('quit-app'),
    captureDataPoint: (data) => ipcRenderer.invoke('capture-data-point', data),
    getDataPoints: (trackerId, configuration, callback) => {
        ipcRenderer.invoke('get-data-points', trackerId, configuration)
            .then(dataPoints => {
                callback(dataPoints);
            })
            .catch(err => {
                console.error("Error getting data points: ", err);
            });
    },
    deleteDataPoint: (dataPointId) => ipcRenderer.invoke('delete-data-point', dataPointId),
    getChartData: (trackerId, configuration, callback) => {
        ipcRenderer.invoke('get-chart-data', trackerId, configuration)
            .then(dataPoints => {
                callback(dataPoints);
            })
            .catch(err => {
                console.error("Error getting chart data: ", err);
            });
    },
    importCSV: (trackerId) => ipcRenderer.invoke('import-csv', trackerId),
});
