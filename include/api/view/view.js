var fs = require('fs');
var ejs = require('ejs');
var func = require('../../function/function.js');
exports.bindApp = function(app) {
	app.post('/view',function (req,res) {
		var data = func.antiXSS(req.body);
		getView(data.action,data.json,function(content) {
			res.send(content);
		});
	});
}

var getView = function (action,json,callback) {
	fs.readFile(__dirname+'/ejs/'+action+'.ejs',function(error, data){
	    if(error){ 
	        callback('error');
	    }
	    else {
	        var rowContent = data.toString();
	        var content = ejs.render(rowContent,json);
	        callback(content);
	    }
	});
}