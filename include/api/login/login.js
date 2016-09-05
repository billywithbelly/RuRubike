var func = require('../../function/function.js');
var mongoDataBase;

exports.bindDB = function(db) {
	mongoDataBase = db;
}

exports.bindApp = function(app) {
	app.post('/login',function(req,res) {
		var data = func.antiXSS(req.body);
		login(data.id,data.password,function(response) {
			if(response.code==1){
				req.session.account = data.id;
		        req.session.password = data.password;
			}
			res.send(response);
		});
	});

	app.post('/register',function(req,res) {
		// body...
		var data = func.antiXSS(req.body);
		var uid = func.generateUUID();
		register(data.id,func.md5(data.password),data.email,uid,function(response) {
			res.send(response);
		});
	});

	app.get('/test', function(req, res) {
		if(req.query.id === 'ray') res.send('102062318');
	});
}

var login = function(id,password,callback) {
	// body...
	mongoDataBase.getAccount({id:id,password:func.md5(password)},function(err,res) {
		if(err)callback(func.dberror());
		else{
			if(res.length==0){
				callback(func.result("no account",-1));
			}
			else{
				callback(func.result(res[0],1));
			}
		}
	});
}
exports.login = login;
var register = function(id,password,email,uid,callback) {
	mongoDataBase.getAccount({id:id},function(err,res) {
		var temp;
		if(err)callBack(func.dberror());
		else{
			if(res.length!=0){
				callback(func.result("this id have been registed.",-1));
			}
			else{
				mongoDataBase.register(id,password,email,uid,function(err,res) {
					if(err)callback(func.dberror());
					else{
						callback(func.result("register success",1));
					}
				});
			}
		}
	});
}