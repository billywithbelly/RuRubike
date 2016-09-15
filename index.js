var http = require('http');
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var cors = require('cors');
var compression = require('compression');
var requester = require('request');

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

var RurubikeAPI = require('./class/ruruBikeAPI.js');
var MongoDataBase = require('./class/mongoDataBase.js');
var SocketIO = require('./class/socket.js');
var mongoDataBase = new MongoDataBase('mongodb://rurubike:87878787@ds021994.mlab.com:21994/luludatabase');
var rurubike = new RurubikeAPI(app,mongoDataBase);
var socket = new SocketIO(httpServer,mongoDataBase);

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
  if(request.session.account){
  	rurubike.apiAccess.login(request.session.account,request.session.password,function(res){
  		if(res.result.master=='yes'){
  			rurubike.apiAccess.getContact(function(res) {
  				response.render('pages/index',{logined:true,user:res.result,master:true,contact:res});
  			});
  		}
  		else{
  			response.render('pages/index',{logined:true,user:res.result,master:false,contact:{}});
  		}
  		
  	});
  }
  else{
  	response.render('pages/index',{logined:false,master:false,contact:{}});
  }
});
