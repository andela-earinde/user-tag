var User = require('../../config/postgres')()[0],
    db = require('../../config/postgres')()[1],
    user;

exports.signup = function(req, res) {
    if(req.body.username && req.body.password && req.body.email){
        if(!/\w+\s+\w+/.test(req.body.username)){
        	User.forging({
        			username: req.body.username,
            		password: req.body.password,
                    email: req.body.email,
            		firstname: req.body.firstname,
            		lastname: req.body.lastname,
            		is_admin: false,
            		auth: req.body.auth
        		})       
                .save().then(function(method) {
                   res.json({success: "User created"});
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
                 res.json({success: "success"}); 
            } 
            res.json({error: "login information invalid"})
        }); 
}

exports.edit = function(req, res) {
    new User({"username": req.body.inituser})
        .fetch()
        .then(function(model) {
            //console.log(model);
            if(model && req.body.username && req.body.password) {
                model.set(req.body); 

                if(model.get("username") === req.body.username) {
                    res.json({success: "Your information has been changed"});
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



