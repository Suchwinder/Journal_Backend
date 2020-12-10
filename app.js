/* Need to import express*/
const express = require("express");
/* Instantiate Express Application */
const app = express();
/**
 * path module lets you interact with file systems in 
 * different ways
 * more info: https://nodejs.dev/the-nodejs-path-module
 */
const path = require('path');
/**
 * Gives detail logs of requests made
 * more info: https://github.com/expressjs/morgan
 */
const logger = require('morgan');

/**
 * Additional security
 * more info: https://helmetjs.github.io/
 */
const helmet = require('helmet');

/**
 * Used to decrease size of request body for better performance
 * more info: https://expressjs.com/en/advanced/best-practice-performance.html#use-gzip-compression
 */
const compression = require('compression');

/**
 * Used in order for react app thats on port 3000 to make requests to our backend thats on port 3001
 * more info: https://www.freecodecamp.org/news/fullstack-react-blog-app-with-express-and-psql/
 * or: https://www.npmjs.com/package/cors
 */
const cors = require('cors');

/**
 * Use in order to pass information from one request to another,
 * basically a way to keep track of who is making the request, without using user data
 * that can be accessed on the browser via cookies, but rather a session id that is stored in the cookie on the browser
 * more info: https://www.tutorialspoint.com/expressjs/expressjs_sessions.htm
 * https://flaviocopes.com/express-sessions/
 */
const session = require('express-session');

/**
 * Need to set up database with sequalize
 */
const db = require('./database')

/**
 * function to create local database
 */
const createLocalDatabase = require('./utilities/createLocalDatabase');

// creating function to sync database asynchoronously
const prepareDatabase = async () => {
  if(process.env.NODE_ENV === 'production') {
    db.sync()
    // .then( () => seedDatabase() )
  }
  else {
    console.log('As a reminder, the forced synchronization option is on');
    /**
     * sync will create tables that dont exist, and force:true will recreate tables 
     * more info: https://stackoverflow.com/questions/50358977/what-is-really-sync-in-sequelize-for 
    */
    db.sync({force:true})
    // .then( async () => {
    //   await seedDatabase()})
    .catch( async (err) => {
      // if (err.name === 'SequelizeConnectionError') {
        // create the local database
        await createLocalDatabase();
        // need to connect sequelize instance to database before seeding
        // force:true drops tables that exist and recreates them
        await db.sync({force:true});
        // and now can populate database
        // await seedDatabase();
      // }
      // else {
      //   console.log("everything exists already");
      // }
    });
  }
};

/**
 * So with our session storing informatio to see which of the users is making requests
 * we now need to be able to store this somewhere. Below (in configureApp function) when we are setting up our 
 * session we emphasize the required parameter (secret in order to sign our cookie so it cannot 
 * be decrypted easily and messed with). In addition there is an optional parameter called store.
 * By default this is set to memoryStore which isnt good for production as the docs state it leads to
 * memory leaks. So for use we will use this library below to store it into a sequelize database.
 * more info: https://www.npmjs.com/package/connect-session-sequelize
 * mor info on secret: https://martinfowler.com/articles/session-secret.html#HowToCrackAWeakSessionSecret
 */
// const SequelizeStore = require('connect-session-sequelize')(session.Store);

// const { User } = require('./database/models') // to use in our middleware in configureApp 

// creating a function to be called aynchornously when setting up middleware 
const configureApp = async () => {
  // Using the various middleware, and other imports
  app.use(logger('dev')); // for logging requests
  app.use(helmet()); // for addidtional security in headers
  app.use(express.json()); // take incoming requests as a json (easier to parse), based on bodyParser middleware: https://expressjs.com/en/api.html#express.json
  app.use(express.urlencoded({ extended: false })); // takes URL encoded links and parses them I think, based on bodyParser middleware: https://expressjs.com/en/api.html#express.urlencoded
  app.use(compression()); // reduce request body size, more info refer to above link when imported
  // Will be used later when our app is built and need to use 
  // static files like css, js, and images etc. : https://expressjs.com/en/starter/static-files.html
  // app.use(express.static("../FrontEnd/build")); 
  app.use(cors()); // enable us to interact with the different origin when front end interacts with back end
  // Since our web app is using login in order to authenitcate users, a means to 
  // enforce that the same user is logged in we will use sessions.
  // The sessions will store and ID in the cookie that will be used by the browser.
  // Each time a request is sent from the browser to the server the server will
  // decode the cookie based on the secret we have assigned it, and then use the ID to get
  // the data in order to ensure the same user is logged in
  // more info: https://www.npmjs.com/package/express-session, https://flaviocopes.com/express-sessions/
  // app.use(session({
  //   secret: 'a bad secret',
  //   store: new SequelizeStore({db}),
  //   saveUninitialized: false,
  //   resave: false, // we support the touch method so per the express-session docs this should be set to false
  //   proxy: true // if you do SSL outside of node.
  // }));

  // app.use(async (req, res, next) => {
  //   try {
  //     // Check if there is a user_id stored in our session, meaning someone is logged in
  //     if(req.session.user_id){
  //       const user = await User.findOne({ where: { username: req.session.user_id} });
  //       // create a user key in the request object and store it
  //       // this middle ware function isnt necessary, based on my understaind
  //       // but its use is good for undesratnding how the express server is set up
  //       req.user = user;
  //     } 
  //   } catch(error) {
  //     console.log(error);
  //   } finally {
  //     next();
  //   }
  // });

  // Use the below console.log in order to see the call stack and how next passes down into the next layer on the stack
  // which in this case is our router, that has all the api functions
  // console.log(app._router.stack);

  // In order to take all controllers and use them in our express main app
  const apiRouter = require('./routes/');
  app.use('/api', apiRouter);

  // NOTE THIS ENTIRE CONFIGURE APP HAPPENS ON EACH REQUEST FROM THE FRONT END TO THE BACK END

  // console.log("This is the stack: ", app._router.stack);
};


// want to asynchonously set up database but ensure the order of
// events occurs properly. 
const bootApp = async () => {
  await prepareDatabase();
  await configureApp();

  // need a port to listen to, front end is 3000 so I will use 3001
  port = process.env.PORT||3001;
  app.listen(port, ()=> console.log(`Listening on port: ${port}`)); 
};

// set up application
bootApp();
