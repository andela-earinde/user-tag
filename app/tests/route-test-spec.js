 var app = require("../../server"),
    request = require("supertest"),
    User = require('../../config/postgres')()[0],
    db = require('../../config/postgres')()[1];

describe("Controller Test: using the routing test method", function() {
    
    beforeEach(function(done) {
		User.forging({
			username: "eniola",
            email: "arindeeniola@yahoo.com",
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
                    email: "crap@crap",
    		        firstname: "eniola",
    		        lastname: "arinde",
    		        is_admin: false	
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

		it("should return an error if the username, password or email field is empty", function(done) {
		    request("http://localhost:5000/api").post('/users/signup')
                .send({
                    username: "",
    		        password: " ",
                    email: "crap@crap",
    		        firstname: "eniola",
    		        lastname: "arinde",
    		        is_admin: false
                })
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200)
                .end(function(err, res) {
                	if(err) {
                        console.log(err);
                    }
                    expect(res.body).toEqual(jasmine.objectContaining({
                    	error: "the username,password and email field are require"
                    }));
                    done();
                });	
		});

		it("should return an error if the username field contain space between the letters", function(done) {
            request("http://localhost:5000/api").post('/users/signup')
                .send({
                    username: "op eyemi",
    		        password: "eniola",
                    email: "crap@crap",
    		        firstname: "eniola",
    		        lastname: "arinde",
    		        is_admin: false	
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

        it("Should return with a token when the user is succesfully signed up", function(done) {
            request("http://localhost:5000/api").post('/users/signup')
                .send({
                    username: "opeyemi",
                    password: "eniola",
                    email: "crap@crap",
                    firstname: "eniola",
                    lastname: "arinde",
                    is_admin: false 
                })
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200)
                .end(function(err, res) {
                    if(err) {
                        console.log(err);
                    }
                    expect(res.body.token).toBeDefined();
                    done();
                });
        });

        it("Should return an error if the username already exist in the database", function(done) {
            request("http://localhost:5000/api").post('/users/signup')
                .send({
                    username: "eniola",
                    password: "opeyemi",
                    email: "crap@crap",
                    firstname: "eniola",
                    lastname: "arinde",
                    is_admin: false 
                })
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200)
                .end(function(err, res) {
                    if(err) {
                        console.log(err);
                    }
                    expect(res.body).toEqual(jasmine.objectContaining({
                        error: "The username already exist"
                    }));
                    done();
                });
        });
    });

    describe("Test if user request for login is working when route Post /users/login is requested", function() {
    	it("should login a user when the correct information is passed", function(done) {
    	    request("http://localhost:5000/api").post('/users/login')
                .send({
                    email: "arindeeniola@yahoo.com",
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

        it("should return with a token when the user succesfully signs up", function(done) {
            request("http://localhost:5000/api").post('/users/login')
                .send({
                    email: "arindeeniola@yahoo.com",
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
                        success: "success",
                        token: "1234"
                    }));
                    done(); 
                }); 
        });
    });	

    describe("Test that the user can change its information when PUT /users/edit route is requested", function() {
        it("should change the user information when requested", function(done) {
            request("http://localhost:5000/api").put('/users/edit')
                .send({
                    inituser: "eniola",
                    username: "abdul",
                    email: "crap@crap",
                    password: "ope"
                })
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200)
                .end(function(err, res) {
                    if(err) {
                        console.log(err);
                    }
                    expect(res.body).toEqual(jasmine.objectContaining({
                        success: "Your information has been changed"
                    }));
                    done();
                });    
        });

        it("should return a token when the user registration is a success", function(done) {
            request("http://localhost:5000/api").put('/users/edit')
                .send({
                    inituser: "eniola",
                    username: "abdul",
                    email: "crap@crap",
                    password: "ope"
                })
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200)
                .end(function(err, res) {
                    if(err) {
                        console.log(err);
                    }
                    expect(res.body.token).toBeDefined();
                    done();
                });    
        });

        it("should reject the user information when the username or password field is invalid", function(done) {
            request("http://localhost:5000/api").put('/users/edit')
                .send({
                    inituser: "eniola",
                    username: "",
                    email: "crap@crap",
                    password: " "
                })
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200)
                .end(function(err, res) {
                    if(err) {
                        console.log(err);
                    }
                    expect(res.body).toEqual(jasmine.objectContaining({
                        error: "The username or password is invalid"
                    }));
                    done();
                });       
        })
    });

    describe("Test if the user can delete information when the DELETE users/delete route is requested", function(){
        it("should delete the user account when requested", function(done) {
             request("http://localhost:5000/api").delete('/users/delete')
                .send({
                    username: "eniola"
                })
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200)
                .end(function(err, res) {
                    if(err) {
                        console.log(err);
                    }
                    expect(res.body).toEqual(jasmine.objectContaining({
                       success: "The account is deleted"
                    }));
                    done();
                });                 
        });

        it("should return an error if the user does not exists", function(done) {
             request("http://localhost:5000/api").delete('/users/delete')
                .send({
                    username: "opeyemi"
                })
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200)
                .end(function(err, res) {
                    if(err) {
                        console.log(err);
                    }
                    expect(res.body).toEqual(jasmine.objectContaining({
                        error: "The user does not exists"
                    }));
                    done();
                });                 
        });
    });

    describe("Test if the user can sign out when the POST users/signout route is requested", function(){
        it("should reset the token when the signup function is called", function(done) {
            request("http://localhost:5000/api").post('/users/signout')
                .send({
                    username: "eniola"
                })
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200)
                .end(function(err, res) {
                    if(err) {
                        console.log(err);
                    }
                    expect(res.body).toEqual(jasmine.objectContaining({
                        success: "The token is reset",
                        token: 0
                    }));
                    done();
                });              
        });

        it("should reset the token when the signup function is called", function(done) {
            request("http://localhost:5000/api").post('/users/signout')
                .send({
                    username: "opeyemi"
                })
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200)
                .end(function(err, res) {
                    if(err) {
                        console.log(err);
                    }
                    expect(res.body).toEqual(jasmine.objectContaining({
                        error: "The User does not exist"
                    }));
                    done();
                });              
        });
    });
});


