const Sequelize = require('sequelize');

/**
 * Need these imports to start creating associations 
 * more info: https://sequelize.org/master/manual/assocs.html
 */
const User = require('./User');
const Journals = require('./Journals');

// Associations
User.hasMany(Journals);
Journals.belongsTo(User);


// Exporting models to be used in routes
module.exports = {
    User,
    Journals,
}
