var func = require('../../function/function.js');
var mongoDataBase;

exports.bindDB = function(db) {
	mongoDataBase = db;
}

exports.bindApp = function(app) {
	app.get('/getBikes',function(req,res) {
		getBikes(function(response) {
			res.send(response);
		});
	});

	app.post('/setBike',function(req,res) {
		var data = func.antiXSS(req.body);
		var kid = func.generateUUID();
		setBike(data.id,data.state,data.batery,data.location,kid,function(response) {
			res.send(response);
		});
	});
}

var getBikes = function(callback) {
	mongoDataBase.getBikes(function(err,data) {
		if(err){
			callback(func.dberror());
		}
		else{
			callback(func.result(data,1));
		}
	});
}

var setBike = function(id,state,batery,location,kid,callback) {
	// body...
	mongoDataBase.setBike(id,state,batery,location,kid,function(err,data) {
		if(err){
			callback(func.dberror());
		}
		else{
			callback(func.result('set success',1));
		}
	});
}
