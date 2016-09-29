var socket = {};
socket.run = function() {
	var socketIo = io.connect();
	socketIo.on('log', function (log) {
		console.log(log);
	});
	socketIo.on('bikes',function (response) {
		var bikes = response.result;
		map.setBikes(bikes);
	});
}