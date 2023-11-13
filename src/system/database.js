const path = require('path');
const {app} = require('electron');
const {Sequelize} = require("sequelize");

const userDataPath = app.getPath('userData');
const timeSeriesPath = path.join(userDataPath, 'timeseries.db');

const database = new Sequelize({
    dialect: 'sqlite',
    storage: timeSeriesPath,
    logging: false,
});

async function initializeDatabase() {
    try {
        await database.authenticate();
        console.log('Connection to the time-series database has been established successfully with Sequelize.');
        return database;
    } catch (error) {
        console.error('Unable to connect to the database:', error);
        throw error;
    }
}

module.exports = { initializeDatabase };
