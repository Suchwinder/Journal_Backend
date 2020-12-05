/**
 * Imports for all our routes in order to use them in our app.js
 * Before Express v4, and in general you coul use app.get or app.use etc.
 * but as applications have grown, each of these routes can get complex.
 * As a result, instead of having app which is our express instance for the main app
 * we can create mini apps that basically are routers and these routers can
 * do the same thing as app.use etc.. but its designed for modularizing routes
 * more info : https://stackoverflow.com/questions/28305120/differences-between-express-router-and-app-get
 * https://expressjs.com/en/api.html#router
 */

const express = require('express');
const router = express.Router();

const userRouter = require('./UserController');
const journalRouter = require('./journalController');

router.use('/user', userRouter);
router.use('/journal', journalRouter);

module.exports = router;
