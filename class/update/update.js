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

		app.post('/update/location', function(req, res) {
			var data = func.antiXSS(req.body);
				that.updateLocation(data.id, data.latitude, data.longitude, function(response) {
				res.send(response);
			});
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

	updateLocation(id, latitude, longitude, callback) {
		var that = this;
		that.mongoDataBase.getOneBike({ id : id }, function(err, res) {
			if(err) {
				callback(func.dberror());
			}
			else if(res.length === 0) {
				callback(func.result("no bike", -1));
			}
			else {
				that.mongoDataBase.updateBikeLocation(id, latitude, longitude, function(err, res) {
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