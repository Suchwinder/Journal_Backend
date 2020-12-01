const isAuthenticated = (req, res, next) => {
  // This middleware is ensuring our user is logged in before making any requests
  if(!req.user){ // if the user object we have defined in our middleware in app.js is undefined it means user isn't logged in
    return res.status(401).json({error: 'User not authenticated'})
  }
  next();
}

module.exports = {
  isAuthenticated
}
