var app = require("../../server"),
    request = require("supertest"),
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
			request("http://localhost:5000/api").post('/users/signup')
                .send({
                    username: "opeyemi",
    		        password: "eniola",
    		        firstname: "eniola",
    		        lastname: "arinde",
    		        is_admin: false,
    		        auth: "1234"	
                })
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200)
                .end(function(err, res) {
                	if(err) {
                        console.log(err);
                    }
                    expect(res.body).toEqual(jasmine.objectContaining({
                    	success: "User created"
                    }));
                    done();
                });
		});

		it("should return an error if the username or password field is empty", function(done) {
		    request("http://localhost:5000/api").post('/users/signup')
                .send({
                    username: "",
    		        password: " ",
    		        firstname: "eniola",
    		        lastname: "arinde",
    		        is_admin: false,
    		        auth: "1234"	
                })
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200)
                .end(function(err, res) {
                	if(err) {
                        console.log(err);
                    }
                    expect(res.body).toEqual(jasmine.objectContaining({
                    	error: "the username and password field are require"
                    }));
                    done();
                });	
		});

		it("should return an error if the username field contain space between the letters", function(done) {
            request("http://localhost:5000/api").post('/users/signup')
                .send({
                    username: "op eyemi",
    		        password: "eniola",
    		        firstname: "eniola",
    		        lastname: "arinde",
    		        is_admin: false,
    		        auth: "1234"	
                })
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200)
                .end(function(err, res) {
                	if(err) {
                        console.log(err);
                    }
                    expect(res.body).toEqual(jasmine.objectContaining({
                    	error: "no spaces between the username"
                    }));
                    done();
                });
		});
    });

    describe("Test if user request for login is working when route Post /users/login is requested", function() {
    	it("should login a user when the currect information is passed", function(done) {
    	    request("http://localhost:5000/api").post('/users/login')
                .send({
                    username: "eniola",
    		        password: "opeyemi",	
                })
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200)
                .end(function(err, res) {
                    if(err) {
                        console.log(err);
                    }
                    expect(res.body).toEqual(jasmine.objectContaining({
                    	success: "success"
                    }));
                    done();	
                });	
    	});

    	it("should return an error if the login information is invalid", function(done) {
            request("http://localhost:5000/api").post('/users/login')
                .send({
                    username: "sunday",
    		        password: "opeyemi",	
                })
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200)
                .end(function(err, res) {
                    if(err) {
                        console.log(err);
                    }
                    expect(res.body).toEqual(jasmine.objectContaining({
                    	error: "login information invalid"
                    }));
                    done();	
                });	
    	});
    });	
});
