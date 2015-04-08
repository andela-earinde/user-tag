var config = require('./config'),
    knex = require('knex');

module.exports = function() {
	var db = knex({
        client: 'pg',
        connection: config.db  
	});
    
	return db;
}