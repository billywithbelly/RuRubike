var Login = require('./login/login.js');
var View = require('./view/view.js');
var Contact = require('./contact/contact.js');

module.exports = class
{
	constructor(app,mongodb)
	{
		var that = this;
		this.login = new Login(app,mongodb);
		this.view = new View(app,mongodb);
		this.contact = new Contact(app,mongodb);
		this.apiAccess = {};
		this.apiAccess.login = function(id,password,callback) 
		{
			that.login.login(id,password,callback);
		}
		this.apiAccess.getContact = function(callback)
		{
			that.contact.getContact(callback);
		}
	}
}