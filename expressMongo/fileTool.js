var ObjectID = require ('mongodb').ObjectID;
var assert = require('assert');
var fs = require('fs');

fileTool = function(db)
{
	this.db = db;
};

fileTool.prototype.setDb = function(db)
{
	this.db = db;
};

fileTool.prototype.getCollection = function(callback)
{
	this.db.collection('files', function(error, files)
	{
		if (error)
			callback(error);
		else
			callback(null, files);
	});
};

fileTool.prototype.get = function(id, callback)
{
	this.getCollection(function(error, files)
		{
			if (error)
				callback(error);
			else
			{
				var checkRegExp = new RegExp("^[0-9a-fA-F]{24}$");
				if (!checkRegExp.test(id))
					callback({error:"invalid id"});
				else
				{
					files.findOne({'_id':ObjctID(id)}, function(error, doc)
					{
						if (error)
							callback(error)
						else
							callback(null, doc);
					});
				}
			}
		});
};

fileTool.prototype.sendGet = function(req, res)
{
	var id = req.params.id;
	if (id)
	{
		this.get(id, function(error, file)
		{
			if (error)
				res.status(400).send(error);
			else
			{
				if (file)
					{
						var fileName = id + file.ext;
						var filePath = '/home/alex/Documents/js_serv/myDisk/upload' + fileName;
						res.sendfile(filePath);
					}
					else
						res.status(400).send('file not found');
			}
		});
	}
	else
		res.status(400).send('file not found');
};

fileTool.prototype.save = function(obj, callback)
{
	this.getCollection(function(error, collection)
	{
		if (error)
			callback(error);
		else
		{
			obj.created_at = new Date();
			collection.insert(obj, function()
			{
				callback(null, obj);
			});
		}
	});
};

fileTool.prototype.getNewFileId = function(obj, callback)
{
	this.save(obj, function(error, obj)
	{
		if (error)
			callback(error);
		else
			callback(null, obj._id);
	});
};

fileTool.prototype.uploadRequest = function(req, res)
{
	var contentType = req.get("content-type");
	var ext = contentType.substr(contentType.indexOf('/')+1);
	if (ext)
		ext = '.' + ext;
	else
		ext = '';
    this.getNewFileId({'content-type':contentType, 'ext':ext}, function(err,id)
    {
        if (err)
        	res.send(400, err); 
        else
        { 	         
            var filename = id + ext;
            filePath = __dirname + '/uploads/' + filename;
	     	var writable = fs.createWriteStream(filePath);
	     	req.pipe(writable);
            req.on('end', function ()
            {
            	res.status(200).send({'_id':id});
             });               
            writable.on('error', function(err)
            {
             	res.status(500).send(err);
            });
        }
    });
};

exports.fileTool = fileTool;