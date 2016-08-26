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
		var data = antiXSS(req.body);
		var kid = generateUUID();
		setBike(data.id,data.state,data.batery,data.location,kid,function(response) {
			res.send(response);
		});
	});
}

var getBikes = function(callback) {
	mongoDataBase.getBikes(function(err,data) {
		if(err){
			callback(dberror());
		}
		else{
			callback(result(data,1));
		}
	});
}

var setBike = function(id,state,batery,location,kid,callback) {
	// body...
	mongoDataBase.setBike(id,state,batery,location,kid,function(err,data) {
		if(err){
			callback(dberror());
		}
		else{
			callback(result('set success',1));
		}
	});
}

var dberror = function() {
	// body...
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

var generateUUID =  function() {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c=='x' ? r : (r&0x3|0x8)).toString(16);
    });
    return uuid;
};
