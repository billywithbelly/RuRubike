var func = require('../../function/function.js');
var mongoDataBase;

exports.bindDB = function(db) {
	mongoDataBase = db;
}

exports.bindApp = function(app) {
	app.post('/sendContact',function(req,res) {
		var data = func.antiXSS(req.body);
		if(data.content!=""){
			sendContact(data,function(response) {
				res.send(response);
			});
		}
	});
	app.get('/contact',function(req,res) {
		getContact(function(response) {
			res.send(response);
		});
	});

	app.post('/addPlace',function(req,res) {
		var data = func.antiXSS(req.body);
		if(data.name!=""&&data.lat!=""&&data.lng!=""){
			addPlace(data,function(response) {
				res.send(response);
			});
		}
	});

	app.get('/place',function(req,res) {
		getPlace(function(response) {
			res.send(response);
		});
	});
}

var sendContact = function(data,callback) {
	mongoDataBase.insertContact(data,function(err,res){
		if(err)callBack(func.dberror());
		else{
			callback(func.result("contact success",1));
		}
	});
}

var addPlace = function(data,callback) {
	mongoDataBase.insertPlace(data,function(err,res){
		if(err)callBack(func.dberror());
		else{
			callback(func.result("addPlace success",1));
		}
	});
}

var getContact = function(callback) {
	mongoDataBase.getContact(function(err,res){
		if(err)callBack(func.dberror());
		else{
			callback(func.result(res,1));
		}
	});
}

var getPlace = function(callback) {
	mongoDataBase.getPlace(function(err,res){
		if(err)callBack(func.dberror());
		else{
			callback(func.result(res,1));
		}
	});
}
exports.getContact = getContact;