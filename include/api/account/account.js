var md5 = require('js-md5');
var htmlspecialchars = require('htmlspecialchars');
var func = require('../../function/function.js');
var mongoDataBase;

exports.bindDB = function(db) {
	mongoDataBase = db;
}

exports.bindApp = function(app) {

	app.post('/update/password',function(req, res) {
		var data = antiXSS(req.body);
		updatePassword(data.id, md5(data.password), md5(data.newpassword), function(response) {
			res.send(response);
		});
	});

	app.post('/update/email',function(req, res) {
		var data = antiXSS(req.body);
		updateEmail(data.id, md5(data.password), data.newemail, function(response) {
			res.send(response);
		});
	});
	

}

var updatePassword = function(id, password, newpassword, callback) {
	
	mongoDataBase.getAccount({ id : id }, function(err, res) {

		if(err) 
			callback(dberror());
		else {
			if(res.length === 0) {
				callback(result("no account", -1));
			}
			else {
				if(res[0].password !== password) {
					callback(result("wrong password", -1));
				}
				else {
					mongoDataBase.updateAccountPassword(id, newpassword, function(err, res) {
						if(err) {
							callback(dberror());
						}
						else {
							callback(result("update password success", 1));
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
			callback(dberror());
		else {
			if(res.length === 0) {
				callback(result("no account", -1));
			}
			else {
				if(res[0].password !== password) {
					callback(result("wrong password", -1));
				}
				mongoDataBase.updateAccountEmail(id, newemail, function(err, res) {
					if(err) 
						callback(dberror());
					else {
						callback(result("update email success", 1));
					}
				});
			}
		}
	});
}

var dberror = function() {
	var temp = {};
	temp.result = "db error";
	temp.code = -2;
	return temp;
}

var result = function (result,code) {
	// body...
	var temp = {};
	temp.result = result;
	temp.code = code;
	return temp;
}

var antiXSS =  function(data) {
    var ans = data;
    for(var key in ans){
        if(typeof(ans[key])=="string"){
            ans[key] = htmlspecialchars(ans[key]);
        }
    }
    return ans;
}