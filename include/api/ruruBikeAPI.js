var login = require('./login/login.js');
var bike = require('./bike/bike.js');
var account = require('./account/account.js');
var view = require('./view/view.js');
var contact = require('./contact/contact.js');

exports.bindMongoDB = function(mongodb) {
	login.bindDB(mongodb);
	bike.bindDB(mongodb);
	account.bindDB(mongodb);
	contact.bindDB(mongodb);
}
exports.bindApp = function(app) {
	login.bindApp(app);
	bike.bindApp(app);
	account.bindApp(app);
	view.bindApp(app);
	contact.bindApp(app);
}

exports.apiAccess = {};
exports.apiAccess.login = function(id,password,callback) {
	login.login(id,password,callback);
}
exports.apiAccess.getContact = function(callback) {
	contact.getContact(callback);
}