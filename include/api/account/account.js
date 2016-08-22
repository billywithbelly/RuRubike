var func = require('../../function/function.js');
var mongoDataBase;

exports.bindDB = function(db) {
	mongoDataBase = db;
}

exports.bindApp = function(app) {

	app.post('/update/password',function(req, res) {
		var data = func.antiXSS(req.body);
		updatePassword(data.id, func.md5(data.password), func.md5(data.newpassword), function(response) {
			res.send(response);
		});
	});

	app.post('/update/email',function(req, res) {
		var data = func.antiXSS(req.body);
		updateEmail(data.id, func.md5(data.password), data.newemail, function(response) {
			res.send(response);
		});
	});
}

var updatePassword = function(id, password, newpassword, callback) {
	
	mongoDataBase.getAccount({ id : id }, function(err, res) {

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
					mongoDataBase.updateAccountPassword(id, newpassword, function(err, res) {
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

var updateEmail = function(id, password, newemail, callback) {
	
	mongoDataBase.getAccount({ id : id }, function(err, res) {

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
				mongoDataBase.updateAccountEmail(id, newemail, function(err, res) {
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