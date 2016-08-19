var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var MongoDatabase;
exports.connect = function(url) {
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
		}
	});
}

exports.getAccount = function (json,callback) {
	// body...
	MongoDatabase.collection('account').find(json).toArray(callback);
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