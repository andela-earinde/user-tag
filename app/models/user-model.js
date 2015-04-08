var bookshelf = require('bookshelf'),
    knex = require('../../config/postgres');


var db = bookshelf(knex);

var User = db.Model.extend({
	tableName: 'users'
});

module.exports = User;