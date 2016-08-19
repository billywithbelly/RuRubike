var htmlspecialchars = require('htmlspecialchars');
var mongoDataBase;
exports.bindDB = function(db) {
	// body...
	mongoDataBase = db;
	mongoDataBase.toString();
}
exports.bindApp = function(app) {
	// body...
	app.post('/login',function(req,res) {
		// body...
		var data = antiXSS(req.body);
		var json = login(data.id,data.password);
		if(json.code=="1"){
			req.session.account = data.id;
	        req.session.password = data.password;
		}
		res.send(json);
	});

	app.post('/register',function(req,res) {
		// body...
		var data = antiXSS(req.body);
		var uid = generateUUID();
		res.send(register(data.id,data.password,uid,data.email));
	});
}

var login = function(id,password) {
	// body...
	mongoDataBase.getAccount({id:id,password:password},function(err,res) {
		// body...
		if(err)dberror();
		else{
			if(res.length==0){
				return 
				JSON.parse({
					result : "no account",
					type : "-1"
				});
			}
			else{
				return
				JSON.parse({
					result : res[0],
					type : "1"
				});
			}
		}
		
	});
}

var register = function(id,password,email,uid) {
	// body...
	mongoDataBase.getAccount({id:id},function(err,res) {
		// body...
		if(err)dberror();
		if(res.length!=0){
			return
			JSON.parse({
				result : "this id have been registed.",
				type : "-1"
			});
		}
		else{
			mongoDataBase.insertAccount(id,password,email,function(err,res) {
				// body...
				if(err)dberror();
				else{
					return
					JSON.parse({
						result : "register success",
						type : "1"
					});
				}
			});
		}
	});
}

var dberror =  function(){
	return
	JSON.parse({
		result : "db error",
		type : "-2"
	});
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