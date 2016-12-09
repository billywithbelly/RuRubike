var Login = require('./login/login.js');
var View = require('./view/view.js');
var Contact = require('./contact/contact.js');
var Update = require('./update/update.js');
var Bike = require('./bike/bike.js');
var Imgur = require('./imgur/imgur.js');

class ruruBikeApi
{
	constructor(app,mongodb)
	{
		var that = this;
		this.login = new Login(app,mongodb,this);
		this.update = new Update(app,mongodb);
		this.bike = new Bike(app,mongodb);
		this.view = new View(app,mongodb);
		this.contact = new Contact(app,mongodb);
		this.imgur = new Imgur(app);
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

module.exports = ruruBikeApi;