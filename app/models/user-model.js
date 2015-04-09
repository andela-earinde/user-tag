var config = require('../../config/config'),
    bookshelf = require('bookshelf');
    

module.exports = function(knex) {
	var db = bookshelf(knex);

	db.knex.schema.hasTable(config.name).then(function(exists) {
	       if(!exists) {
	       	    db.knex.schema.createTable(config.name, function(table) {
			        table.increments("id").primary();
			        table.string('username');
			        table.string('password');
			        table.string('firstname');
			        table.string('lastname');
	                table.boolean('is_admin');
	                table.string('auth');
			        table.timestamps();
		        }).then(function() {
			        console.log("created");
		        });
	       }
	   });

	   
	var User = db.Model.extend({
		tableName: 'users',
		hasTimestamps: true
	});

	return [User, db];

}

