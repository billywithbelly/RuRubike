var func = require('../function.js');
var imgur = require('imgur');

class Imgur{

    constructor(app){
        app.get = app.get.bind(this);
        app.get('/upload',function(req,res) {
            var data = func.antiXSS(req.body);
			this.upload(data,function(response) {
				res.send(response.data.link);
			});
		});
    }

    upload(data,callback){
        imgur.uploadBase64(data)
        .then(callback)
        .catch(function (err) {
            console.error(err.message);
        });
    }
}