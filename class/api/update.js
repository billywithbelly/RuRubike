var func = require('../function.js');
class Update
{
	constructor(app,db)
	{
		var that = this;
		this.mongoDataBase = db;

		app.post('/update/bike', function(req, res) {
			var data = func.antiXSS(req.body);
			that.updateBikeAll(data.id, data.latitude, data.longitude, data.state, data.battery, function(response)
			{
				res.send(response);
			});
		});
	}

	updateBikeAll(id, latitude, longitude, state, battery, callback) {
		var that = this;
		that.mongoDataBase.getOneBike({ id : id }, function(err, res)
		{
			if(err) 
			{
				callback(func.dberror());
			}
			else if(res.length === 0) 
			{
				callback(func.result("no bike", -1));
			}
			else 
			{
				that.mongoDataBase.updateBike(id, latitude, longitude, state, battery, function(err, res) 
				{
					if(err)	callback(func.dberror());
					else	callback(func.result("update location success", 1));
				});
			}
		});
	}
}

module.exports = Update;