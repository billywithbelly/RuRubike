var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var MongoDatabase;
exports.connect = function(url,callback) {
	// body...
	MongoClient.connect(url, function (err, db) {
		if (err) {
			console.log('Unable to connect to the mongoDB server. Error:', err);
		} 
		else {
			//HURRAY!! We are connected. :)
			console.log('Connection established to', url);
			MongoDatabase = db;
            exports.MongoDatabase = MongoDatabase;
            callback();
		}
	});
}

exports.getAccount = function (json,callback) {
	// body...
	MongoDatabase.collection('account').find(json).toArray(callback);
}

exports.updateAccountPassword = function(id, newpassword, callback) {
	MongoDatabase.collection('account').updateOne(
		{ id 	: id },
		{ $set	: { password : newpassword } }
	,callback);
}

exports.updateAccountEmail = function(id, newemail, callback) {
	MongoDatabase.collection('account').updateOne(
		{ id 	: id },
		{ $set 	: { email : newemail } }
	,callback);
}

exports.register = function(id,password,email,uid,callback) {
	// body...
	MongoDatabase.collection('account').insertOne(
    {
        id:id,
        password:password,
        NFC:"none",
        status:"node",
        email:email,
        log:[],
        uid:uid,
        time: new Date()
    }
    ,callback);
}

exports.getBikes = function(callback) {
	MongoDatabase.collection('bike').find({}).toArray(callback);
}

exports.getOneBike = function(json, callback) {
	MongoDatabase.collection('bike').find(json).toArray(callback);
}

exports.setBike = function(id,status,battery,kid,callback) {
	// body...
	MongoDatabase.collection('bike').insertOne(
	{
		id 		: id,
		status 	: status,
		battery : battery,
		location: {
			latitude  : -1,
			longitude : -1
		},
		kid		: kid,
		time: new Date()
	}
	,callback);
}

exports.updateBikeLocation = function(id, lat, long, callback) {
	MongoDatabase.collection('bike').updateOne(
		{ id : id },
		{ $set : { location : { latitude : lat, longitude : long } } },
		callback);
}

exports.insertContact = function(data,callback) {
	MongoDatabase.collection('contact').insertOne(
    {
        data: data,
        time: new Date()
    }
    ,callback);
}

exports.getContact = function(callback) {
	MongoDatabase.collection('contact').find({}).toArray(callback);
}