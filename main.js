const path = require('path');
const {app, BrowserWindow, ipcMain} = require('electron');
const fs = require('fs');
const si = require('systeminformation');
const packageJSON = require('./package.json');
const sqlite3 = require('sqlite3').verbose();

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
    app.quit();
}

const isDev = process.env.IS_DEV === 'true';
const userDataPath = app.getPath('userData');
const dataFilePath = path.join(userDataPath, 'collectionData.json');
const timeSeriesPath = path.join(userDataPath, 'timeseries.db');

function createWindow(userData = {}) {
    const mainWindow = new BrowserWindow({
        show: false,
        minWidth: 1160,
        width: 1520,
        minHeight: 800,
        height: 860,
        center: true,
        resizable: true,
        maximizable: true,
        fullscreenable: false,
        icon: path.join(__dirname, 'src/assets/icon.ico'),
        frame: false,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: false,
            devTools: isDev
        },
        backgroundColor: '#FFFFFF'
    });
    if (isDev) {
        mainWindow.loadURL('http://localhost:3000');
    } else {
        mainWindow.loadFile(path.join(__dirname, 'app/build', 'index.html'));
    }

    // Show the window when the page is ready
    mainWindow.webContents.once('dom-ready', () => {
        mainWindow.webContents.send('hydrate-store', userData);
        mainWindow.show();
        mainWindow.focus();
        if (isDev) {
            mainWindow.webContents.openDevTools();
        }
    });

    // Handle user-initiated "close" method
    ipcMain.handle('quit-app', () => {
        app.quit();
    });

    // Handle user-initiated "minimize" method
    ipcMain.handle('minimize-app', () => {
        mainWindow.minimize();
    });

    // Handle user-initiated "maximize" method
    ipcMain.handle('maximize-app', () => {
        mainWindow.isMaximized() ? mainWindow.unmaximize() : mainWindow.maximize();
    });

    // Handle updates to user data
    ipcMain.handle('store-data-updated', (event, data) => {
        fs.writeFileSync(dataFilePath, data);
    });

}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {

    // Get system initialization information once the application is ready
    ipcMain.handle('application-ready', async () => {
        let uuid = null;
        await si.system().then(data => uuid = data.uuid);
        return {
            'uuid': uuid,
            'version': packageJSON.version,
        }
    });

    // Get the user data once the application is ready
    fs.readFile(dataFilePath, 'utf8', (err, data) => {

        let db = new sqlite3.Database(timeSeriesPath, (err) => {
            if (err) {
                console.error(err.message);
            }
            console.log('Connected to the time-series SQLite database.', timeSeriesPath);
        });

        // Define the default data as an empty JSON string
        let jsonData = '{}';

        if (err) {
            // If there is an error reading the file, it might not exist or might be inaccessible
            // Log the error and continue with default data
            console.log('Error reading the data file:', err);
        } else {
            // Try to parse the data as JSON
            try {
                jsonData = JSON.parse(data);
            } catch (jsonErr) {
                // If there is an error parsing the JSON, log it and continue with default data
                console.log('Error parsing JSON from data file:', jsonErr);
            }
        }

        // Ensure jsonData is a valid JSON object, even if it's just empty
        jsonData = typeof jsonData === 'object' ? jsonData : {};

        // Convert back to a string if necessary
        const userData = JSON.stringify(jsonData);

        // Show the application window, passing in the user data
        createWindow(userData);
    });

    // Handle macOS activation of an existing app window.
    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
