var htmlspecialchars = require('htmlspecialchars');
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
		var data = req.body;
		var kid = generateUUID();
		setBikes(data.id,data.state,data.batery,data.location,kid,function(response) {
			res.send(response);
		});
	});
}

var getBikes = function(callback) {
	mongoDataBase.getBikes(function(err,data) {
		callback(data);
	});
}

var setBike = function(id,state,batery,location,kid,callback) {
	// body...
	mongoDataBase.setBike(id,state,batery,location,kid,function(err,data) {
		callback(data);
	});
}