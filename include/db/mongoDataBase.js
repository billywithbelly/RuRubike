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