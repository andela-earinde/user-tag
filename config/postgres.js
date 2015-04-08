var config = require('./config'),
    knex = require('knex');

module.exports = function() {
	var db = knex({
        client: 'pg',
        connection: config.db  
	});

	db.schema.createTable(config.name, function(table) {
		table.increments().primary();
		table.string('username');
		table.string('password');
		table.string('firstname');
		table.string('lastname');
        table.boolean('is_admin');
        table.string('auth');
		table.timestamps();
	});

	return db;
}