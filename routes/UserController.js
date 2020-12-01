// Here we will create all of the necessary routes for user
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { isAuthenticated } = require('../middleware');

const { User } = require("../database/models");

//––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
/**     These are all the Necessary Functions for User Controls      */

const createUser = async (req, res) => { 
  try {
    if(!req.body.username || req.body.username.length === 0) {
      return res.status(400).json({error: "Please enter a username"});
    }
    if(!req.body.password || req.body.password.length === 0) {
      return res.status(400).json({error: "Please enter a password"});
    }
    req.body.password = bcrypt.hashSync(req.body.password, 10); // encrypt password 
    const user = await User.create(req.body); // create user with encrypted password and remainder of body
    // so by creating an express session, we are checking the valididty of if the client is coming from the same browser, 
    // and we store the id of the user (in this case email) in our session, so we specifically know who the user is. Otherwaise
    // if we dont store it, we know the client using our app is the same one, but we dont specifically know who it is.
    // this happens on every request. This is what passport, the module, does as well
    req.session.user_id = user.email; // adding key: value pair for future requests that require the user to be logged in, basically this is what passport would do 
    return res.status(200).json({message: 'User Successfully Created'}); // Successfuly created
  } catch(error) {
    return res.status(400).json({error: "User Already Exists"});
  }
}

const getUser = async (req, res) => {
  try {
    if(req.session.user_id){
      return res.status(400).json({error: 'User already logged in'});
    }
    if(!req.body.username || req.body.username.length === 0){
      return res.status(400).json({error: "Please enter a username"});
    }
    if(!req.body.password || req.body.password.length === 0) {
      return res.status(400).json({error: "Please enter a password"});
    }
    req.body.password = bcrypt.hashSync(req.body.password, 10); // we encrypt password inputted to see if it matches the one existing in the database
    const user = await User.findByPk(req.body.username);
    if(user) {
      req.session.user_id = user.userId;
      return res.status(200).json({message: 'User logged in'});
    } else {
      throw Error("User doesn't exist");
    }
  } catch(error) {
    return res.status(400).json({error: error.message});
  }
}

const logOutUser = async (req, res) => {
  try {
    await req.session.destroy();
    delete req.user;
    return res.status(200).json({message: "User successfuly logged out"});
  } catch(error) {
    return res.status(400).json({error: "User has already been logged out"});
  }
}

//––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

// Create a user
router.post('/signup', createUser);

// Sign in a user
router.post('/login', getUser);

// Log out a user
router.delete('/logout', isAuthenticated, logOutUser)

module.exports = router;
