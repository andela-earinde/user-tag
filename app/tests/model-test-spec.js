var app = require('../../server'),
    User = require('../models/user-model'),
    knex = require('../../config/postgres')(),
    user;

describe('user-model Test', function() {
    
    beforeEach(function(done) {
    	user = new User({
    		username: "eniola",
    		password: "opeyemi",
    		firstname: "eniola",
    		lastname: "arinde",
    		is_admin: false,
    		auth: "1234"
    	});
    	done();
    });

    afterEach(function(done) {
        knex.schema.dropTable('users');
        done();
    });

    describe("Test if the new row is saved", function() {
    	it("should be able to save a data without issues", function(done) {
            user.save().then(function(model) {
                //console.log(model);
            });
            done();
    	});
    });
});
    

