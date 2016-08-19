var login = require('./login/login.js');
var bike = require('./bike/bike.js');

exports.bindDBs = function(dbs) {
	// body...
	login.bindDB(dbs.mongodb);
	bike.bindDB(dbs.mongodb);
}
exports.bindApp = function(app) {
	// body...
	login.bindApp(app);
	bike.bindApp(app);
}

