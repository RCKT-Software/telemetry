const path = require('path');
const {app, BrowserWindow, ipcMain, globalShortcut} = require('electron');
const si = require('systeminformation');
const packageJSON = require('./package.json');

const {initializeDatabase} = require('./src/system/database');
const {initializeAppData, storeAppData} = require('./src/system/configuration');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
    app.quit();
}

// Define isDev
const isDev = process.env.IS_DEV === 'true';

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
    ipcMain.handle('application-ready', async () => {
        let uuid = null;
        await si.system().then(data => uuid = data.uuid);
        return {
            'uuid': uuid,
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
