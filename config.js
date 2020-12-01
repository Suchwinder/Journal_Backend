/**
 * Here we will maually configure the environemnt with all necessary variables, 
 * then export them to be used as through out our app
 */

/**
 * This import lets us use dotenv that can find the .env file
 * and also pull information from it
 * more info: https://www.npmjs.com/package/dotenv
 * https://medium.com/the-node-js-collection/making-your-node-js-work-everywhere-with-environment-variables-2da8cdf6e786
*/
const dotenv = require('dotenv');

/**
 * Loads .env variables to be used
 */
dotenv.config();

module.exports = {
    // host: process.env.DB_HOST,
    // user: process.env.DB_USER,
    // port: process.env.DB_PORT,
    dbname: process.env.DB_NAME
};
