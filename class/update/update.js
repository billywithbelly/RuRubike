var func = require('../function.js');
class Update
{
	constructor(app,db)
	{
		var that = this;
		this.mongoDataBase = db;
		app.post('/update/password',function(req,res) {
			var data = func.antiXSS(req.body);
			that.updatePassword(data.id, func.md5(data.password), func.md5(data.newpassword), function(response) {
				res.send(response);
			});
		});

		app.post('/update/email',function(req, res) {
			var data = func.antiXSS(req.body);
			that.updateEmail(data.id, func.md5(data.password), data.newemail, function(response) {
				res.send(response);
			});
		});

		app.post('/update/bike', function(req, res) {
			var data = func.antiXSS(req.body);
			that.updateBikeAll(data.id, data.latitude, data.longitude, data.state, data.battery, function(response) {
				res.send(response);
			});
		});

		app.post('/loraDick',function(req,res) {
			var data = func.antiXSS(req.body);
			
			var lat = (parseInt(data.data.substr(14, 8), 16) / 1000000 + 24.7).toFixed(6).toString();
			var lon = (parseInt(data.data.substr(6, 8), 16) / 1000000 + 120.9).toFixed(6).toString();
			var idstatebat = parseInt(data.data.substr(0, 6), 16).toString(2);
			var state = (parseInt(idstatebat.substr(idstatebat.length-5,2), 2)).toString();
			var bat = (parseInt(idstatebat.substr(idstatebat.length-3,3), 2)*25).toString();
			var id = (parseInt(idstatebat.substr(0,idstatebat.length-5), 2)).toString();
			console.log(id +'|'+ state +'|'+ bat);
			that.updateBikeAll(id, lat, lon, state, bat, function (response) {
				res.send(response);
			})
			
		});
	}

	updatePassword(id, password, newpassword, callback) {
		var that = this;
		that.mongoDataBase.getAccount({ id : id }, function(err, res) {

			if(err) 
				callback(func.dberror());
			else {
				if(res.length === 0) {
					callback(func.result("no account", -1));
				}
				else {
					if(res[0].password !== password) {
						callback(func.result("wrong password", -1));
					}
					else {
						that.mongoDataBase.updateAccountPassword(id, newpassword, function(err, res) {
							if(err) {
								callback(func.dberror());
							}
							else {
								callback(func.result("update password success", 1));
							}
						});
					}
				}
			}		
		});
	}

	updateEmail(id, password, newemail, callback) {
		var that = this;
		that.mongoDataBase.getAccount({ id : id }, function(err, res) {

			if(err) 
				callback(func.dberror());
			else {
				if(res.length === 0) {
					callback(func.result("no account", -1));
				}
				else {
					if(res[0].password !== password) {
						callback(func.result("wrong password", -1));
					}
					that.mongoDataBase.updateAccountEmail(id, newemail, function(err, res) {
						if(err) 
							callback(func.dberror());
						else {
							callback(func.result("update email success", 1));
						}
					});
				}
			}
		});
	}

	updateBikeAll(id, latitude, longitude, state, battery, callback) {
		var that = this;
		that.mongoDataBase.getOneBike({ id : id }, function(err, res) {
			if(err) {
				callback(func.dberror());
			}
			else if(res.length === 0) {
				callback(func.result("no bike", -1));
			}
			else {
				that.mongoDataBase.updateBike(id, latitude, longitude, state, battery, function(err, res) {
					if(err)
						callback(func.dberror());
					else
						callback(func.result("update location success", 1));
				});
			}
		});
	}
}

module.exports = Update;