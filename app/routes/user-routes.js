var express = require('express');
var router = express.Router();
var index = require('../controllers/controller');

module.exports = function(app) {
   
	router.route('/users/login')

	.post(index.login);

	router.route('/users/signup')

	.post(index.signup);

	router.route('/users/signout')

	.post(index.signout);

	router.route('/users/edit')

	.put(index.edit);

    //for truncting the table
	router.route('/users/remove')

	.post(index.removeAll);

	router.route('/users/delete')

	.delete(index.remove);

	app.use('/api', router);

	// catch 404 and forward to error handler
    app.use(function(req, res, next) {
        res.status(404).json({error: "The path does not exist"});
    });
}