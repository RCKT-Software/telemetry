const path = require('path');
const {app, BrowserWindow, ipcMain} = require('electron');
const si = require('systeminformation');
const packageJSON = require('./package.json');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
    app.quit();
}

const isDev = process.env.IS_DEV === 'true';

function createWindow() {
    const mainWindow = new BrowserWindow({
        show: false,
        minWidth: 800,
        width: 1380,
        minHeight: 600,
        height: 820,
        center: true,
        resizable: true,
        maximizable: true,
        fullscreenable: false,
        icon: path.join(__dirname, 'src/assets/icon.ico'),
        frame: false,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true,
            devTools: isDev
        },
    });
    if (isDev) {
        mainWindow.loadURL('http://localhost:3000');
    } else {
        mainWindow.loadFile(path.join(__dirname, 'app/build', 'index.html'));
    }
    mainWindow.webContents.once('dom-ready', () => {
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

    // Show the application window
    createWindow();

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
