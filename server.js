var postgres = require('./config/postgres'),
    express = require('./config/express');

var app = express();

app.set('port', (process.env.PORT || 5000));

app.listen(app.get('port'), function() {
	console.log("server running at http://localhost:"+app.get('port'));
});

module.exports = app;