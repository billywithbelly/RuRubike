var tool = require('../../tool.js');
class Login
{
	constructor(app,db,rurubike)
	{
		var that = this;
		this.mongoDataBase = db;
		app.post('/login',function(req,res) {
			var data = tool.antiXSS(req.body);
			that.login(data.id,data.password,function(response) {
				if(response.code==1){
					req.session.account = data.id;
			        req.session.password = data.password;
				}
				res.send(response);
			});
		});

		app.post('/register',function(req,res) {
			var data = tool.antiXSS(req.body);
			var uid = tool.generateUUID();
			that.register(data.id,tool.md5(data.password),data.email,uid,function(response) {
				res.send(response);
			});
		});

		app.post('/isLogin',function(request, response){
			if(request.session.account){
				this.login(request.session.account,request.session.password,function(loginRes){
					if(loginRes.result.master=='yes'){
						rurubike.apiAccess.getContact(function(contactRes) {
							response.send({contact:contactRes,login:'yes',data:loginRes});
						});
					}
					else{
						response.send({contact:{},login:'yes',data:loginRes});
					}
				});
			}
			else{
				response.send({contact:{},login:'no'});
			}
		}.bind(this));

	}

	login(id,password,callback) {
		this.mongoDataBase.getAccount({id:id,password:tool.md5(password)},function(err,res) {
			if(err)callback(tool.dberror());
			else{
				if(res.length==0){
					callback(tool.result("no account",-1));
				}
				else{
					callback(tool.result(res[0],1));
				}
			}
		});
	}

	register(id,password,email,uid,callback) {
		this.mongoDataBase.getAccount({id:id},function(err,res) {
			var temp;
			if(err)callBack(tool.dberror());
			else{
				if(res.length!=0){
					callback(tool.result("this id have been registed.",-1));
				}
				else{
					this.mongoDataBase.register(id,password,email,uid,function(err,res) {
						if(err)callback(tool.dberror());
						else{
							callback(tool.result("register success",1));
						}
					});
				}
			}
		});
	}
}

module.exports = Login;