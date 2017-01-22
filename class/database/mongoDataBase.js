var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
class Mongo
{
	constructor(url)
	{
		var temp = this;
		temp.MongoDatabase = null;
		MongoClient.connect(url, function (err, db) {
			if (err) {
				console.log('Unable to connect to the mongoDB server. Error:', err);
			} 
			else {
				console.log('Connection established to', url);
				temp.MongoDatabase = db;
			}
		});
	}

	getAccount(json,callback) 
	{
		this.MongoDatabase.collection('account').find(json).toArray(callback);
	}

	updateAccountPassword(id, newpassword, callback) 
	{
		this.MongoDatabase.collection('account').updateOne(
			{ id 	: id },
			{ $set	: { password : newpassword } }
		,callback);
	}

	updateAccountEmail(id, newemail, callback) 
	{
		this.MongoDatabase.collection('account').updateOne(
			{ id 	: id },
			{ $set 	: { email : newemail } }
		,callback);
	}

	register(id,password,email,uid,callback) 
	{
		this.MongoDatabase.collection('account').insertOne(
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

	getBikes(callback) 
	{
		this.MongoDatabase.collection('bike').find({}).toArray(callback);
	}

	getOneBike(json, callback) 
	{
		this.MongoDatabase.collection('bike').find(json).toArray(callback);
	}

	setBike(id,state,battery,kid,callback) 
	{
		this.MongoDatabase.collection('bike').insertOne(
		{
			id 		: id,
			state 	: state,
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

	updateBike(id, lat, long, state, battery, callback) 
	{
		this.MongoDatabase.collection('bike').updateOne(
			{ id : id },
			{ $set : { location : { latitude : lat, longitude : long },
					   state    : state,
					   battery  : battery } },
			callback);
	}

	insertContact(data,callback) 
	{
		this.MongoDatabase.collection('contact').insertOne(
	    {
	        data: data,
	        time: new Date()
	    }
	    ,callback);
	}

	getContact(callback) 
	{
		this.MongoDatabase.collection('contact').find({}).toArray(callback);
	}

	insertPlace(data,callback) 
	{
		this.MongoDatabase.collection('place').insertOne(
	    {
	        data: data,
	        time: new Date()
	    }
	    ,callback);
	}

	getPlace(callback) 
	{
		this.MongoDatabase.collection('place').find({}).toArray(callback);
	}

	postIOTData(data,callback)
	{
		this.MongoDatabase.collection('iot').insertOne(
	    {
	        data: data,
	        time: new Date()
	    }
	    ,callback);
	}

	getIOTData(callback) 
	{
		this.MongoDatabase.collection('iot').find({}).toArray(callback);
	}
}

module.exports = Mongo;