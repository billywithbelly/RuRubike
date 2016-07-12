var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var url = 'mongodb://raywu:ray840406@ds031948.mlab.com:31948/rurubike';

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({
    extended: true
}));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
  response.render('pages/index');
});

app.get('/raywu', function(request, response) {
	var studentId = 102062318
  	response.send(studentId);
});

app.post('/raywu',function(request, response) {
	var data = request.body;
	console.log(data);
	var answer = {};
	MongoClient.connect(url, function (err, db) {
		if (err) 
		{
			console.log('Unable to connect to the mongoDB server. Error:', err);
		} 
		else 
		{
			var courses = db.collection("courses");
			courses.find({course:{"$in":data.classes}},{_id:1}).toArray(function(err,callBack) 
			{
				answer.courses = callBack;
				console.log(answer);
				response.send(answer);
				db.close();
			});
		}
	});
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

