var express = require('express');
var router = express.Router();
var index = require('../controllers/controller');

module.exports = function(app) {
   
	router.route('/users/login')

	.post(index.test);

	router.route('/users/signup')

	.post(function(req, res) {
		res.json({success: "success"});
	});

	app.use('/api', router);

	// catch 404 and forward to error handler
    app.use(function(req, res, next) {
        res.status(404).json({error: "The path does not exist"});
    });
}