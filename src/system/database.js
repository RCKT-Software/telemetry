const path = require('path');
const {app, dialog} = require('electron');
const {Sequelize, DataTypes} = require("sequelize");

const userDataPath = app.getPath('userData');
const timeSeriesPath = path.join(userDataPath, 'timeseries.db');

// Initialize the time-series database
const database = new Sequelize({
    dialect: 'sqlite',
    storage: timeSeriesPath,
    logging: false,
});

// Define the model for a single data point
const DataPoint = database.define('DataPoint', {
        value: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            isDecimal: true,
        },
        trackerId: {
            type: DataTypes.UUID,
            allowNull: false
        }
    },
    {
        timestamps: true,
        indexes: [
            {
                unique: false,
                fields: ['trackerId']
            },
            {
                unique: false,
                fields: ['createdAt']
            }
        ]
    });

async function initializeDatabase() {
    try {
        await database.authenticate();
        console.log('Connection to the time-series database has been established successfully with Sequelize.');
        await database.sync({alter: true});
        console.log('The time-series database schema has been synced.');
        return database;
    } catch (error) {
        console.error('Unable to connect to the database:', error);
        throw error;
    }
}

/**
 * Captures a single data point.
 * @returns {Promise<void>}
 */
async function captureDataPoint(data) {
    try {
        const dataPoint = await DataPoint.create(data);
    } catch (error) {
        console.error('Failed to capture data point:', error);
        throw error;
    }
}

/**
 * Retrieves all data points for a given tracker and configuration.
 * @param trackerId
 * @param configuration
 */
async function getDataPoints(trackerId, configuration) {
    try {
        const dataPoints = await DataPoint.findAll({
            where: {
                trackerId: trackerId
            },
            order: [
                ['createdAt', 'DESC']
            ],
            limit: 500
        });
        return dataPoints.map(record => record.dataValues);
    } catch (error) {
        console.error('Failed to retrieve data points:', error);
        throw error;
    }
}

/**
 * Deletes a single data point.
 * @param data
 * @returns {Promise<boolean>}
 */
async function deleteDataPoint(data) {
    try {
        await DataPoint.destroy({
            where: {
                id: data.id
            }
        });
        return true;
    } catch (error) {
        console.error('Failed to delete data point:', error);
        throw error;
    }
}

function initCSVImport() {
    dialog.showOpenDialog({
        properties: ['openFile'],
        filters: [
            { name: 'CSV', extensions: ['csv'] }
        ]
    }).then(result => {
        if (result.canceled) return;
        const filePath = result.filePaths[0];
        const fileExtension = path.extname(filePath).toLowerCase();
        if (fileExtension === '.csv') {
            console.log('Selected file is a CSV file.');
            // Do something with the CSV file
        } else {
            console.log('Selected file is not a CSV file.');
            // Handle error or notify user
        }
    }).catch(err => {
        console.error('An error occurred:', err);
    });
}

module.exports = {initializeDatabase, captureDataPoint, getDataPoints, deleteDataPoint, initCSVImport};
