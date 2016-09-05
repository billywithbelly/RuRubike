var func = require('../function/function.js');
var mongoDataBase;

exports.bindMongoDB = function(mongodb) {
	mongoDataBase = mongodb;
}

exports.bindHttpServer = function(httpServer) {
	var io = require('socket.io').listen(httpServer);

	io.sockets.on('connection',function(socket){

		socket.emit("log","connection success");

		var getBikesInterval =  setInterval(function() {
			mongoDataBase.getBikes(function(err,data) {
				if(err){
					socket.emit('bikes',func.dberror());
				}
				else{
					socket.emit('bikes',func.result(data,1));
				}
			});
		},1000);

		socket.on('disconnect',function() {
			clearInterval(getBikesInterval);
		});
	});
}