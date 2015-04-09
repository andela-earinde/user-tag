var app = require("../../server"),
    request = require("request"),
    User = require('../../config/postgres')()[0],
    db = require('../../config/postgres')()[1];


describe("Controller Test: using the routing test method", function() {
    
    beforeEach(function(done) {
		User.forge({
			username: "eniola",
    		password: "opeyemi",
    		firstname: "eniola",
    		lastname: "arinde",
    		is_admin: false,
    		auth: "1234"
		})       
        .save().then(function(method) {
           console.log("done");
           done();
        });

       
	});

	afterEach(function(done) {
		db.knex('users')
		  .where('firstname', 'eniola')
		  .del().then(function() {
		      console.log("deleted");
		  });
		  done();
	});

	describe("Test if user is created when the Post /users/signup routes is requested", function() {
		it("should create a new user when the post method is called", function(done) {
			request.post({url: "http://localhost:5000/api/users/login", form:
			    {
			        username: "eniola",
    		        password: "opeyemi",
    		        firstname: "eniola",
    		        lastname: "arinde",
    	            is_admin: false,
    		        auth: "1234"	
			    }},function(err, res, body) {
			    	 console.log(err);
			    	 done();
			    });
		});
	});
});

