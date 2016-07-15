var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var url = 'mongodb://raywu:ray840406@ds031948.mlab.com:31948/rurubike';
var db;
MongoClient.connect(url, function (err, database) {
	if (err) 
	{
		console.log('Unable to connect to the mongoDB server. Error:', err);
	} 
	else 
	{
		db = database;
		//Must opening the app before opening the database
		app.set('port', (process.env.PORT || 5000));
		app.listen(app.get('port'), function() {
		  console.log('Node app is running on port', app.get('port'));
		});
	}
});

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

app.get('/searchid', function(request, response) {
	var studentID;
	switch(request.query.name)
	{
		case 'raywu'	: 
			studentID = '102062318';
			break;
		case 'willywu' 	:
			studentID = '102062124';
			break;
	}
  	response.send(studentID);
});

function findCourses(request, response){
	var data = request.query;
	var answer = {};
	var courses = db.collection("courses");
	courses.find({course : data.course},{_id:0}).toArray(function(err,callBack) 
	{
		answer = callBack;
		response.send(answer);
	});
}

app.post('/searchCourse',findCourses);

