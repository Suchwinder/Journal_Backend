/**
 * You can create the database locally and then have the mdels in the database folder
 * populate your database with the appropriate table. If however you want
 * your server to generate your database for you, then there are several ways to do 
 * it. One is using pg module, another is to use the pg-tools library (THIS IS WHAT ILL USE)
 * and another is to use sequalize.
 */

/**
 * Need to import pg-tools to create database
 * more info: https://www.npmjs.com/package/pgtools
 * can use pg directly, haven't practiced it myself
 */
const pgtools = require('pgtools');

/**
 * Getting private hidden dbname for this app
 */
const { dbname } = require('../config')

/**
 * Set up configurations to connect/create database
 */
const config = {
  user: 'postgres',
  host: 'localhost',
  port: 5432, //this is why CORS doesnt occur on the database https://stackoverflow.com/questions/36958999/cors-is-it-a-client-side-thing-a-server-side-thing-or-a-transport-level-thin
  password: ''
}

const createLocalDatabase = () => pgtools.createdb(config, dbname, function (err, res) {
  console.log(`Attempting to create the database: ${dbname}!`);
  if (err) {
    console.error(err.message);
    // removal in case the database already exists locally
    // process.exit(-1);
  }
  else{
    console.log(res);
    console.log(`Successfully created the database: ${dbname}!`);
  }
  // This I believe deletes the database
  // pgtools.dropdb(config, dbname, function (err, res) {
  //   if (err) {
  //     console.error(err);
  //     process.exit(-1);
  //   }
  //   console.log(res);
  // });
});

module.exports = createLocalDatabase;
