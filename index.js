var http = require('http');
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var cors = require('cors');
var compression = require('compression');

var app = express();
var httpServer = http.createServer(app);
httpServer.listen(process.env.PORT || 5000);

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({limit: '50mb',extended: true}));
app.use(bodyParser.json());
app.use(cors());
app.use(compression());
app.use(session({
  secret: process.env.SESSION_SECRET,
  cookie: { maxAge: 60 * 1000 }
}));

var RurubikeAPI = require('./class/api/rubikeAPI.js');
var MongoDB = require('./class/database/mongoDataBase.js');
var SocketIO = require('./class/socket/socket.js');
var mongoDataBase = new MongoDB(process.env.MONGODB_ADDRESS);
var rurubike = new RurubikeAPI(app,mongoDataBase);
var socket = new SocketIO(httpServer,mongoDataBase);

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

//nthu rurubike main page

app.get('/', function(request, response) {
  response.render('pages/react/index');
});


//IOT
app.get('/IOT', function(request, response) {
  response.render('pages/react/iot');
});

app.post('/postIOT',function(req,res){
  var data = req.body
  mongoDataBase.postIOTData(data,function(err,response){
    res.send(response);
  });
});

app.get('/getIOT',function(req,res) {
  mongoDataBase.getIOTData(function(err,response) {
    res.send(response);
  });
});

