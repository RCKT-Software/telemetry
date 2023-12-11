const {dialog} = require('electron');
const path = require('path');
const fs = require('fs');
const csv = require('csv-parser');
const Sugar = require('sugar');
const {captureBulkDataPoints} = require('./database');

Sugar.extend();

/**
 * Open a dialog to select a CSV file, and return data about that file to the user to confirm.
 */
async function openCSVFileDialog(data) {
    return dialog.showOpenDialog({
        properties: ['openFile'],
        filters: [
            {name: 'CSV', extensions: ['csv']}
        ]
    }).then(async result => {
        if (result.canceled) return;
        const filePath = result.filePaths[0];
        const fileExtension = path.extname(filePath).toLowerCase();
        if (fileExtension === '.csv') {
            return await validateCSVFile(filePath);
        } else {
            console.log('Selected file is not a CSV file.');
            return false;
        }
    }).catch(err => {
        console.error('An error occurred:', err);
        return false;
    });
}

async function validateCSVFile(filePath) {
    return new Promise((resolve, reject) => {
        let numRecords = 0;
        let earliestRecord = null;
        let latestRecord = null;
        fs.createReadStream(filePath)
            .pipe(csv({
                headers: false
            }))
            .on('data', (data) => {

                // Validate the date/time column
                const date = new Date.create(data[0].toString().trim());
                if (!date.isValid()) {
                    console.log(data[0], date, date.medium());
                    reject('Invalid date format found in the CSV file.');
                }

                // Validate the value column
                const value = data[1];
                if (value === undefined || value === null || value.toString().trim() === '') {
                    reject('Empty value found in the CSV file.');
                }

                // Track the earliest and latest record
                if (earliestRecord === null || date.isBefore(earliestRecord)) {
                    earliestRecord = date;
                }
                if (latestRecord === null || date.isAfter(latestRecord)) {
                    latestRecord = date;
                }

                numRecords++;
            })
            .on('end', () => {
                if (numRecords === 0) {
                    reject('No records found in the CSV file.');
                }
                resolve({
                    filePath,
                    numRecords,
                    earliestRecord,
                    latestRecord
                });
            })
            .on('error', (err) => reject(err));
    });
}

/**
 * Import the CSV file to the tracker provided by the user.
 * @param data
 */
const importCSVToTracker = (data) => {
    return new Promise((resolve, reject) => {
        const records = [];
        fs.createReadStream(data.filePath)
            .pipe(csv({
                headers: ['date', 'value'],
            }))
            .on('data', (record) => {
                records.push({
                    trackerId: data.trackerId,
                    value: parseFloat(record['value'].replace(/[\$, ]/g, '')),
                    createdAt: new Date(record['date'].toString().trim()),
                });
            })
            .on('end', async () => {
                try {
                    await importBatches(records); // Process records in batches
                    resolve(); // Resolve after all batches are imported
                } catch (e) {
                    reject(e);
                }
            })
            .on('error', (err) => reject(err));
    });
};

const importBatches = async (records) => {
    const batchSize = 1000;
    for (let i = 0; i < records.length; i += batchSize) {
        const batch = records.slice(i, i + batchSize);
        await captureBulkDataPoints(batch);
        console.log(`Imported ${batch.length} records`);
    }
};

module.exports = {openCSVFileDialog, importCSVToTracker};
