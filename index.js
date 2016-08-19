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
app.use(cors());
app.use(compression());
app.use(session({
  secret: '12345678123456781234567812345678123456781234567812345678123456781234567812345678123456781234567812345678123456781234567812345678',
  cookie: { maxAge: 60 * 1000 }
}));

var mongoDataBase = require('./include/db/mongoDataBase.js').connect('mongodb://rurubike:87878787@ds021994.mlab.com:21994/luludatabase');
var rurubike = require('./include/api/ruruBikeAPI.js');
rurubike.bindDBs({mongodb:mongoDataBase});
rurubike.bindApp(app);

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
  response.render('pages/index');
});
