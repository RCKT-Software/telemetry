const path = require('path');
const {app, BrowserWindow, ipcMain} = require('electron');
const fs = require('fs').promises;
const si = require('systeminformation');
const packageJSON = require('./package.json');
const sqlite3 = require('sqlite3').verbose();
const { Sequelize, DataTypes } = require('sequelize');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
    app.quit();
}

const isDev = process.env.IS_DEV === 'true';
const userDataPath = app.getPath('userData');
const dataFilePath = path.join(userDataPath, 'configuration.json');
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
    ipcMain.handle('store-data-updated', async (event, data) => {
        try {
            await fs.writeFile(dataFilePath, data);
            console.log('Data has been successfully saved to', dataFilePath);
            return { success: true, message: 'Data saved successfully.' };
        } catch (err) {
            console.error('Failed to save data:', err.message);
            return { success: false, message: err.message };
        }
    });

}

async function initializeDatabase() {
    const database = new Sequelize({
        dialect: 'sqlite',
        storage: timeSeriesPath,
        logging: false, // Set to true to see SQL logs
    });

    try {
        await database.authenticate();
        console.log('Connection to the time-series database has been established successfully with Sequelize.');
        return database;
    } catch (error) {
        console.error('Unable to connect to the database:', error);
        throw error;
    }
}

async function initializeAppData() {
    let jsonData = {};
    try {
        const data = await fs.readFile(dataFilePath, 'utf8');
        jsonData = JSON.parse(data);
    } catch (readError) {
        // If there's an error, handle it appropriately
        if (readError.code === 'ENOENT') {
            console.log('Data file does not exist, initializing with default data...');
        } else {
            console.error('Error reading or parsing the data file:', readError);
        }
    }
    return JSON.stringify(jsonData);
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

    initialize().then();

    // Handle macOS activation of an existing app window.
    // TODO: Consider that createWindow needs data to be passed in to hydrate the store.
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
