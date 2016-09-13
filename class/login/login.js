var func = require('../function.js');
module.exports = class
{
	constructor(app,db)
	{
		var that = this;
		this.mongoDataBase = db;
		app.post('/login',function(req,res) {
			var data = func.antiXSS(req.body);
			that.login(data.id,data.password,function(response) {
				if(response.code==1){
					req.session.account = data.id;
			        req.session.password = data.password;
				}
				res.send(response);
			});
		});

		app.post('/register',function(req,res) {
			var data = func.antiXSS(req.body);
			var uid = func.generateUUID();
			that.register(data.id,func.md5(data.password),data.email,uid,function(response) {
				res.send(response);
			});
		});

		app.get('/test', function(req, res) {
			if(req.query.id === 'ray') res.send('102062318');
		});
	}

	login(id,password,callback) {
		this.mongoDataBase.getAccount({id:id,password:func.md5(password)},function(err,res) {
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
	register(id,password,email,uid,callback) {
		this.mongoDataBase.getAccount({id:id},function(err,res) {
			var temp;
			if(err)callBack(func.dberror());
			else{
				if(res.length!=0){
					callback(func.result("this id have been registed.",-1));
				}
				else{
					this.mongoDataBase.register(id,password,email,uid,function(err,res) {
						if(err)callback(func.dberror());
						else{
							callback(func.result("register success",1));
						}
					});
				}
			}
		});
	}
}