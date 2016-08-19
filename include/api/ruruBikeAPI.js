var login = require('./login/login.js');
var bike = require('./bike/bike.js');

exports.bindDBs = function(mongodb) {
	// body...
	login.bindDB(mongodb);
	bike.bindDB(mongodb);
}
exports.bindApp = function(app) {
	// body...
	login.bindApp(app);
	bike.bindApp(app);
}

