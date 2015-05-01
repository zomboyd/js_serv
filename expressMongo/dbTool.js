var ObjectID = require ('mongodb').ObjectID;
var assert = require('assert');

dbTool = function(db)
{
	this.db = db;
}

dbTool.prototype.setDb = function(db)
{
	this.db = db;
}

dbTool.prototype.getCollection = function (collectionName, callback)
{
	this.db.collection(collectionName, function (error, foundCollection)
	{
		if (error)
			callback(error);
		else
			callback(null, foundCollection);
	});
}

dbTool.prototype.findItems = function (collectionName, callback)
{
	this.getCollection(collectionName, function (error, collection)
	{
		if (error)
			callback(error);
		else
		{
			collection.find().toArray(function (error, res)
			{
				if (error)
					callback(error);
				else
					callback(null, res);
			});
		}
	})
}

dbTool.prototype.get = function(collectionName, id, callback)
{
	this.getCollection(collectionName, function(error, collection)
	{
		if (error)
			callback(error);
		else
		{
			var checkRegExp = new RegExp("^[0-9a-fA-F]{24}$");
			if (!checkRegExp.test(id))
				callback({error: "invalid id"});
			else
				collection.findOne({'_id':ObjctID(id)}, function(error, doc)
				{
					if (error)
						callback(error)
					else
						callback(null, doc);
				});	
		}
	});
}

dbTool.prototype.save = function (collectionName, obj, entity, callback)
{
	this.getCollection(collectionName, function(error, collection)
	{
		if (error)
			callback(error);
		else
		{
			obj.created_at = new Date();
			collection.insertOne(obj, function(error, r)
			{
				assert.equal(null, error);
				assert.equal(1, r.insertedCount);
				callback(null, obj);
			});
		}
	});
}

dbTool.prototype.update = function(collectionName, obj, id, callback)
{
	this.getCollection(collectionName, function (error, collection)
	{
		if (error)
			callback(error);
		else
		{
			obj._id = ObjectID(id);
			obj.updated_at = new Date();
			collection.updateOne(obj, function (error, r)
			{
				assert.equal(null, error);
				assert.equal(1, r.matchedCount);
				assert.equal(1, r.modifiedCount);
				callback(null, obj);
			})
		}
	})
};

dbTool.prototype.delete = function(collectionName, id, callback)
{
	this.getCollection(collectionName, function(error, collection)
	{
		if (error)
			callback(error);
		else
		{
			collection.deleteOne({'_id':ObjectID(id)}, function(error, r)
				{
					if (error)
						callback(error);
					else if (r.deletedCount == 0)
						callback("no item deleted\n");
					else
						callback(null, 'item with id:' + id + ' deleted\n');
				});
		}
	})
};

dbTool.prototype.query = function(collectionName, query, callback)
{
	this.getCollection(collectionName, function (error, collection)
	{
		if (error)
			callback(error);
		else
		{
			collection.find(query).toArray(function(error, results)
			{
				if (error)
					callback(error);
				else
					callback(null, results);
			});
		}
	});
};

exports.dbTool = dbTool;