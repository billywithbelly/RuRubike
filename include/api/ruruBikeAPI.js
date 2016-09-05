var login = require('./login/login.js');
var bike = require('./bike/bike.js');
var account = require('./account/account.js');

exports.bindMongoDB = function(mongodb) {
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

exports.apiAccess = {};
exports.apiAccess.login = function(id,password,callback) {
	login.login(id,password,callback);
}