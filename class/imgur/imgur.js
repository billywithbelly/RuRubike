var func = require('../function.js');
var imgur = require('imgur');

class Imgur{

    constructor(app){
        var that = this;
        app.post('/upload',function(req,res) {
            var data = func.antiXSS(req.body);
			that.upload(data.url,function(response) {
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

module.exports = Imgur;