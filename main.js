const path = require('path');
const {app, BrowserWindow, ipcMain, globalShortcut, screen} = require('electron');
const si = require('systeminformation');
const packageJSON = require('./package.json');
const { updateElectronApp } = require('update-electron-app');

const crypto = require('crypto');

const {initializeDatabase, captureDataPoint, getDataPoints, deleteDataPoint} = require('./src/system/database');
const {initializeAppData, storeAppData} = require('./src/system/configuration');
const {openCSVFileDialog, importCSVToTracker} = require('./src/system/importer');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
    app.quit();
}

// Define isDev
const isDev = process.env.IS_DEV === 'true';

function createWindow(userData = {}) {
    const { height } = screen.getPrimaryDisplay().size;
    const windowHeight = Math.round(Math.max(height * 0.85, 860));
    const mainWindow = new BrowserWindow({
        show: false,
        minWidth: 1160,
        width: 1520,
        minHeight: 800,
        height: windowHeight,
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
        mainWindow.loadURL('http://localhost:3000').then();
    } else {
        mainWindow.loadFile(path.join(__dirname, 'app/build', 'index.html')).then();
    }

    // Show the window when the page is ready
    mainWindow.webContents.once('dom-ready', () => {
        mainWindow.webContents.send('hydrate-store', userData);
        mainWindow.show();
        mainWindow.focus();
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
    ipcMain.handle('store-data-updated', async (event, data) => {
        storeAppData(data);
    });

    // Handle capturing a data point
    ipcMain.handle('capture-data-point', async (event, data) => {
        captureDataPoint(data);
    });

    // Handle deleting a data point
    ipcMain.handle('delete-data-point', async (event, data) => {
        deleteDataPoint(data);
    });

    // Handle the user request to import a CSV file
    ipcMain.handle('get-csv-data', async (event) => {
        return await openCSVFileDialog();
    });

    // Handle the user request to import a CSV file to a specific tracker
    ipcMain.handle('import-csv-to-tracker', async (event, data) => {
        importCSVToTracker(data);
    });

    // Handle getting data points for a given tracker
    ipcMain.handle('get-data-points', async (event, trackerId, configuration) => {
        try {
            return await getDataPoints(trackerId, configuration);
        } catch (err) {
            console.error("Error retrieving data points: ", err);
            throw err;
        }
    });

}

async function initialize() {
    try {
        // Initialize database and app data
        const database = await initializeDatabase();
        const appData = await initializeAppData();
        createWindow(appData);
    } catch (error) {
        console.error('Failed to initialize the application:', error);
    }
}

// App is ready to start loading
app.whenReady().then(async () => {

    // Register Control+D to open dev tools
    if (isDev) {
        globalShortcut.register('Control+D', () => {
            let win = BrowserWindow.getFocusedWindow();
            if (win) {
                win.webContents.toggleDevTools();
            }
        });
    }

    // Get system initialization information once the application is ready
    // We hash the UUID to prevent tracking of individual users
    ipcMain.handle('application-ready', async () => {
        let uuid = null;
        await si.system().then(data => uuid = data.uuid);
        const hash = crypto.createHash('sha256');
        hash.update(uuid);
        return {
            'uuid': hash.digest('hex'),
            'platform': process.platform,
            'version': packageJSON.version,
        }
    });

    // Initialize the database/application data and create the app window.
    await initialize();

    // Handle macOS activation of an existing app window.
    // TODO: Consider that createWindow needs data to be passed in to hydrate the store when we port to MacOS.
    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
    globalShortcut.unregisterAll();
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

// Automatic updates
updateElectronApp();
