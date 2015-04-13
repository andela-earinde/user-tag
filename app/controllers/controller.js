var User = require('../../config/postgres')()[0],
    db = require('../../config/postgres')()[1],
    jwt = require('jsonwebtoken'),
    secret = require('../../config/config').secret,
    user;

exports.signup = function(req, res) {
    if(req.body.username && req.body.password && req.body.email){
        if(!/\w+\s+\w+/.test(req.body.username)){
            var profile = {
                username: req.body.username,
                email: req.body.email
            }

            var token = jwt.sign(profile, secret);

        	User.forging({
        			username: req.body.username,
            		password: req.body.password,
                    email: req.body.email,
            		firstname: req.body.firstname,
            		lastname: req.body.lastname,
            		is_admin: false,
            		auth: token
        		})       
                .save().then(function(method) {
                   res.json({success: "User created",
                             token: method.attributes.auth});
                });
        }
        else {
            res.json({error: "no spaces between the username"});
        }
    }
    else {
        res.json({error: "the username,password and email field are require"});
    }
}

exports.login = function(req, res) {
    new User({"email": req.body.email,
              "password": User.hashPassword(req.body.password)})
        .fetch()
        .then(function(model) {
            if(model) {
                 res.json({success: "success",
                           token: model.attributes.auth}); 
            }
            else {
                res.json({error: "login information invalid"});
            }
        }); 
}

exports.signout = function(req, res) {
    new User({username: req.body.username})
        .fetch()
        .then(function(model) {
            if(model) {
                model.set({"auth": 0});
                res.json({ success: "The token is reset",
                           token: model.get("auth")});
            }
            else {
                res.json({error: "The User does not exist"});
            }
        });
}

exports.edit = function(req, res) {
    new User({"username": req.body.inituser})
        .fetch()
        .then(function(model) {
            //console.log(model);
            if(model && req.body.) {
                var profile = {
                    username: req.body.username,
                    email: req.body.email
                }
                var token = jwt.sign(profile, secret);

                req.body.auth = token;

                delete req.body.inituser;

                model.set(req.body);

                model.save(); 
                
                if(model.get("auth") === req.body.auth) {
                    console.log(model);
                    res.json({success: "Your information has been changed",
                              token: model.get('auth')});
                }                       
            }
            else{
                res.json({error: "The username or password is invalid"});
            }
        });
   
}

exports.remove = function(req, res) {
    new User({"username": req.body.username})
        .fetch()
        .then(function(model) {
            if(model) {
                db.knex('users')
                  .where("username", req.body.username)
                  .del().then(function() {
                      res.json({success: "The account is deleted"});
                  });
            }
            else {
                res.json({error: "The user does not exists"});
            }
        });
}



