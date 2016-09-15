var func = require('../function.js');
class Contact
{
	constructor(app,db)
	{
		var that = this;
		this.mongoDataBase = db;
		app.post('/sendContact',function(req,res) {
			var data = func.antiXSS(req.body);
			if(data.content!=""){
				that.sendContact(data,function(response) {
					res.send(response);
				});
			}
		});
		app.get('/contact',function(req,res) {
			that.getContact(function(response) {
				res.send(response);
			});
		});

		app.post('/addPlace',function(req,res) {
			var data = func.antiXSS(req.body);
			if(data.name!=""&&data.lat!=""&&data.lng!=""){
				that.addPlace(data,function(response) {
					res.send(response);
				});
			}
		});

		app.get('/place',function(req,res) {
			that.getPlace(function(response) {
				res.send(response);
			});
		});
	}

	sendContact(data,callback) {
		this.mongoDataBase.insertContact(data,function(err,res){
			if(err)callBack(func.dberror());
			else{
				callback(func.result("contact success",1));
			}
		});
	}

	addPlace(data,callback) {
		this.mongoDataBase.insertPlace(data,function(err,res){
			if(err)callBack(func.dberror());
			else{
				callback(func.result("addPlace success",1));
			}
		});
	}

	getContact(callback) {
		this.mongoDataBase.getContact(function(err,res){
			if(err)callBack(func.dberror());
			else{
				callback(func.result(res,1));
			}
		});
	}

	getPlace(callback) {
		this.mongoDataBase.getPlace(function(err,res){
			if(err)callBack(func.dberror());
			else{
				callback(func.result(res,1));
			}
		});
	}
}

module.exports = Contact;