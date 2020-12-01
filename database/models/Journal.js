const Sequelize = require('sequelize');
const db = require('../index');

const StudySession = db.define ('studySession', {
    id: {
		type: Sequelize.INTEGER,
		primaryKey: true,
		autoIncrement: true
	},

	description: {
		type: Sequelize.STRING,
		allowNull: false
    },

    dateCreated: {
        type: Sequelize.DATE,
        allowNull: false
    }
})

module.exports = StudySession;
