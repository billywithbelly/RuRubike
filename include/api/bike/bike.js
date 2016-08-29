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

	app.get('/getBikeBattery', function(req, res) {
		getBikeBattery(req.query.id, function(response) {
			res.send(response);
		});
	});

	app.post('/setBike',function(req,res) {
		var data = func.antiXSS(req.body);
		var kid = func.generateUUID();
		setBike(data.id,data.state,data.battery,data.location,kid,function(response) {
			res.send(response);
		});
	});

	app.post('/update/bikeLocation',function(req, res) {
		//var data = func.antiXSS(req.body);
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

var getBikeBattery = function(id, callback) {
	mongoDataBase.getOneBike({ id : id }, function(err, res) {

		if(err) 
			callback(func.dberror());
		else {
			if(res.length === 0) {
				callback(func.result("no bike", -1));
			}
			else {
				callback(func.result(res[0].battery, 1));
			}
		}

	});
};

var setBike = function(id,state,battery,location,kid,callback) {
	// body...
	mongoDataBase.setBike(id,state,battery,location,kid,function(err,data) {
		if(err){
			callback(func.dberror());
		}
		else{
			callback(func.result('set success',1));
		}
	});
}
