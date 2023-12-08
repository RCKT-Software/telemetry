const fs = require('fs').promises;
const path = require('path');
const os = require('os');

const userDataPath = path.join(os.homedir(), 'AppData', 'Roaming', 'telemetry');

// Configuration File
const configurationFilePath = path.join(userDataPath, 'configuration.json');
const backupConfigurationFilePath = path.join(userDataPath, 'backup.json');

// Database
const databaseFilePath = path.join(userDataPath, 'timeseries.db');
const backupDatabaseFilePath = path.join(userDataPath, 'backup.db');

// Rename the configuration and database files to back up files
async function resetAppData() {
    await fs.rename(configurationFilePath, backupConfigurationFilePath);
    await fs.rename(databaseFilePath, backupDatabaseFilePath);
}

resetAppData().then(() => {
    console.log('App data has been backed up and reset.');
});
