var User = require('../../config/postgres')()[0];

exports.test = function(req, res) {
	User.forge({
			username: "Abdul",
    		password: "opeyemi",
    		firstname: "eniola",
    		lastname: "arinde",
    		is_admin: false,
    		auth: "1234"
		})       
        .save().then(function(method) {
           res.json({saved: "yes"})
        });
}