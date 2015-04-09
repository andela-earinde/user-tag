var User = require('../../config/postgres')()[0],
    db = require('../../config/postgres')()[1],
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
        db.knex('users')
          .where('username', "eniola")
          .del().then(function() {
          	 console.log("deleted");
          });
        done();
    });

    describe("Test if the new row is saved", function() {
    	it("should be able to save a data without issues", function(done) {
            user.save().then(function(model) {
                expect(model.attributes).toEqual(jasmine.objectContaining({
                    "username": "eniola",
                    "password": "opeyemi"
                }));
                 done();
            });
    	});
    });
});
    

