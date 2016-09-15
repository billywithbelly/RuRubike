var bike = require('./bike/bike.js');
var account = require('./account/account.js');

exports.bindMongoDB = function(mongodb) {
	bike.bindDB(mongodb);
	account.bindDB(mongodb);
}
exports.bindApp = function(app) {
	bike.bindApp(app);
	account.bindApp(app);
}