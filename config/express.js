var express = require('express'),
    morgan = require('morgan'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override');

module.exports = function() {
	var app = expres();

	if(process.env.NODE_ENV === 'development') {
		app.use(morgan('dev'));
	}

	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({
		extended: true
	}));
	app.use(methodOverride());

	require('../app/routes/tag-routes')(app);

	return app;
}