var func = require('../function.js');

class Bike
{
	constructor(app,db)
	{
		var that = this;
		this.mongoDataBase = db;

		app.get('/getBikes',function(req,res) {
			that.getBikes(function(response) {
				res.send(response);
			});
		});

		app.get('/getBikeBattery', function(req, res) {
			that.getBikeBattery(req.query.id, function(response) {
				res.send(response);
			});
		});

		app.post('/setBike',function(req,res) {
			var data = func.antiXSS(req.body);
			var kid = func.generateUUID();
			that.setBike(data.id,data.state,data.battery,kid,function(response) {
				res.send(response);
			});
		});
		app.post('/loraDick',function(req,res) {
			var data = func.antiXSS(req.body);
			console.log(data.data);
			res.send("OK");
		});
	}

	getBikes(callback) {
		this.mongoDataBase.getBikes(function(err,data) {
			if(err){
				callback(func.dberror());
			}
			else{
				callback(func.result(data,1));
			}
		});
	}

	getBikeBattery(id, callback) {
		this.mongoDataBase.getOneBike({ id : id }, function(err, res) {
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
	}
	setBike(id, state, battery, kid, callback) {
		this.mongoDataBase.setBike(id, state, battery, kid, function(err, data) {
			if(err){
				callback(func.dberror());
			}
			else{
				callback(func.result('set success',1));
			}
		}); 
	}
}

module.exports = Bike;