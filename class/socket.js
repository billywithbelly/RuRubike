var func = require('./function.js');
class SocketIO
{
	constructor(httpServer,mongodb)
	{
		var that = this;
		this.mongoDataBase = mongodb;
		this.io = require('socket.io').listen(httpServer);
		this.io.sockets.on('connection',function(socket){

			socket.emit("log","connection success");

			var getBikesInterval =  setInterval(function() {
				if(that.mongoDataBase.MongoDatabase!=null){
					that.mongoDataBase.getBikes(function(err,data) {
						if(err){
							socket.emit('bikes',func.dberror());
						}
						else{
							socket.emit('bikes',func.result(data,1));
						}
					});
				}
			},1000);

			socket.on('disconnect',function() {
				clearInterval(getBikesInterval);
			});
		});
	}
}

module.exports = SocketIO;