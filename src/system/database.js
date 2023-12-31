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
 */
async function captureDataPoint(data) {
    try {
        return DataPoint.create(data);
    } catch (error) {
        console.error('Failed to capture data point:', error);
        throw error;
    }
}

/**
 * Captures data points in bulk.
 */
async function captureBulkDataPoints(data) {
    try {
        return DataPoint.bulkCreate(data);
    } catch (error) {
        console.error('Failed to capture bulk data points:', error);
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
            limit: 1000
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

module.exports = {initializeDatabase, captureDataPoint, captureBulkDataPoints, getDataPoints, deleteDataPoint};
