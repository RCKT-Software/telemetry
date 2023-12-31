const fs = require('fs').promises;
const path = require('path');
const {app} = require('electron');
const _ = require('lodash');

const userDataPath = app.getPath('userData');
const dataFilePath = path.join(userDataPath, 'configuration.json');

/**
 * Initializes the application data from the file system
 * @returns {Promise<string>}
 */
async function initializeAppData() {
    let jsonData = {};
    try {
        const data = await fs.readFile(dataFilePath, 'utf8');
        jsonData = JSON.parse(data);
    } catch (readError) {
        // If there's an error, handle it appropriately
        if (readError.code === 'ENOENT') {
            console.log('Data file does not exist, initializing with default data...');
            jsonData = {
                collections: [{
                    label: "My Collection"
                }]
            };
        } else {
            console.error('Error reading or parsing the data file:', readError);
        }
    }
    return JSON.stringify(jsonData);
}

/**
 * Stores the application data to the file system
 * @param data
 * @returns {Promise<{success: boolean, message}|{success: boolean, message: string}>}
 */
async function storeAppData(data) {
    return writeAppDataFile(dataFilePath, data);
}

/**
 * Writes the application data to the file system with a 250ms debounce
 * @param filePath
 * @param data
 * @returns {Promise<{success: boolean, message}|{success: boolean, message: string}>}
 */
const writeAppDataFile = _.debounce(async (filePath, data) => {
    try {
        await fs.writeFile(dataFilePath, data);
        console.log('App data has been saved to', dataFilePath);
        return {success: true, message: 'Data saved successfully.'};
    } catch (err) {
        console.error('Failed to save data:', err.message);
        return {success: false, message: err.message};
    }
}, 250);

module.exports = {initializeAppData, storeAppData};
