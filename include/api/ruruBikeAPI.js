var login = require('./login/login.js');
var bike = require('./bike/bike.js');
var account = require('./account/account.js');

exports.bindDBs = function(mongodb) {
	// body...
	login.bindDB(mongodb);
	bike.bindDB(mongodb);
	account.bindDB(mongodb);
}
exports.bindApp = function(app) {
	// body...
	login.bindApp(app);
	bike.bindApp(app);
	account.bindApp(app)
}

