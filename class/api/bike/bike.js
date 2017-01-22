var tool = require('../../tool.js');

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
			var data = tool.antiXSS(req.body);
			var kid = tool.generateUUID();
			that.setBike(data.id,data.state,data.battery,kid,function(response) {
				res.send(response);
			});
		});

		app.post('/update/bike', function(req, res) {
			var data = tool.antiXSS(req.body);
			that.updateBikeAll(data.id, data.latitude, data.longitude, data.state, data.battery, function(response)
			{
				res.send(response);
			});
		});
	}

	getBikes(callback) {
		this.mongoDataBase.getBikes(function(err,data) {
			if(err){
				callback(tool.dberror());
			}
			else{
				callback(tool.result(data,1));
			}
		});
	}

	getBikeBattery(id, callback) {
		this.mongoDataBase.getOneBike({ id : id }, function(err, res) {
			if(err) 
				callback(tool.dberror());
			else {
				if(res.length === 0) {
					callback(tool.result("no bike", -1));
				}
				else {
					callback(tool.result(res[0].battery, 1));
				}
			}
		});
	}

	setBike(id, state, battery, kid, callback) {
		this.mongoDataBase.setBike(id, state, battery, kid, function(err, data) {
			if(err){
				callback(tool.dberror());
			}
			else{
				callback(tool.result('set success',1));
			}
		}); 
	}

	updateBikeAll(id, latitude, longitude, state, battery, callback) {
		var that = this;
		that.mongoDataBase.getOneBike({ id : id }, function(err, res)
		{
			if(err) 
			{
				callback(tool.dberror());
			}
			else if(res.length === 0) 
			{
				callback(tool.result("no bike", -1));
			}
			else 
			{
				that.mongoDataBase.updateBike(id, latitude, longitude, state, battery, function(err, res) 
				{
					if(err)	callback(tool.dberror());
					else	callback(tool.result("update location success", 1));
				});
			}
		});
	}
}

module.exports = Bike;