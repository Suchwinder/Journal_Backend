const Sequelize = require('sequelize');
/**
 * Need our database connection via sequelize to define models
 */
const db = require('../index');

/**
 * Creating a User table with sequlize models, via the define approach
 * more info: https://sequelize.org/v5/manual/getting-started.html#modeling-a-table
 */
const User = db.define('user', {
    //attributes
    id: {
        type: Sequelize.INTEGER,
        // primaryKey: true,
        autoIncrement: true // Automatically gets converted to SERIAL for postgres
    },

    username: {
        type: Sequelize.STRING,
        allowNull: false
    },

    password: {
        type: Sequelize.STRING,
        allowNull: false
    }
})

module.exports = User;
