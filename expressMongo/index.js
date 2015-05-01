var express = require('express');
var pars = require('body-parser');
var app = express();
var check_user = require("./check_user");
var path = require('path');
var MongoClient = require('mongodb').MongoClient;
var Server = require('mongodb').Server;
var DbTool = require('./dbTool').dbTool;
var assert = require('assert');
var FileTool = require('./fileTool').fileTool;

/*
Set server
 */

app.set('port', process.env.PORT || 3000);

/*
load views
 */

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

/*
Connexion to MongoDb server
 */

var url = 'mongodb://localhost:27017/mydb';

var dbTool = new DbTool();
var fileTool = new FileTool();
MongoClient.connect(url, function(err, db)
{
  assert.equal(null, err);
  fileTool.setDb(db);
  dbTool.setDb(db);
  console.log("Connected correctly to server");
});

/*
Parsing of the requests
 */

app.use(pars.urlencoded({extended: false}));
app.use(pars.json());

/*
file request
 */

app.use(express.static(path.join(__dirname, 'public')));
app.get('/', function (req, res)
{
  res.send('<html><body><h1>Hello World</h1></body></html>');
});

app.post('/files', function(req,res)
{
  fileTool.uploadRequest(req,res);
});

app.get('/files/:id', function(req, res)
{
  fileTool.sendGet(req,res);
});

/*
GET Request
 */

app.get('/:collection', function(req, res)
{
  var params = req.params;
  dbTool.findItems(req.params.collection, function(error, objs)
  { 
    if (error)
      res.send(400, error);
    else
    { 
      if (req.accepts('html'))
        res.render('data',{objects: objs, collection: req.params.collection});
      else
      {
        res.set('Content-Type','application/json');
        res.send(200, objs);
      }
    }
  });
});
 
app.get('/:collection/:entity', function(req, res)
{
  var params = req.params;
  var entity = params.entity;
  var collection = params.collection;
  if (entity)
  {
    dbTool.get(collection, entity, function(error, objs)
    {
      if (error)
        res.status(400).send(error);
      else
        res.send(200, objs);
    });
  }
  else
    res.send(400, {error: 'bad url', url: req.url});
});

/*
POST request
 */

app.post('/:collection', check_user.check_user, function(req, res)
{
  var params = req.params;
  var collection = params.collection;
  dbTool.save(collection, req.body, entity, function(error, doc)
    {
      if (error)
        res.status(400).send(error);
      else
        res.status(201).send(doc);
    });
  console.log("POST recu ->  "+ req.body.id);
  console.log("--> /" + collection);
});

/*
PUT request
 */

app.put('/:collection', function(req, res)
{
  var obj = req.body;
  var collection = req.params.collection;
  dbTool.save(collection, obj, function(error, doc)
    {
      if (error)
        res.status(400).send(error);
      else
      {
        res.status(201).send(doc);
        console.log('put ok');
      }
    });
})

app.put('/:collection/:entity', function(req, res)
{
  var params = req.params;
  var entity = params.entity;
  var collection = params.collection;

  dbTool.save(collection, req.body, entity, function(error, doc)
    {
      if (error)
        res.status(400).send(error);
      else
        res.status(201).send(doc);
    });
})

/*
DELETE request
delete only one item
 */

app.delete('/:collection/:entity', function (req, res)
{
  var params = req.params;
  var entity = params.entity;
  var collection = params.collection;

  if (entity)
  {
    dbTool.delete(collection, entity, function(error, obj)
    {
      if (error)
        res.status(400).send(error);
      else
        res.status(201).send(obj);
    });
  }
  else
  {
    var error = {"message":"cannot delete a collection"}
    res.status(400).send(error);
  }
})

/*
default page
 */

app.use(function (req,res)
{
  res.render('404', {url:req.url});
});

var server = app.listen(8888, function()
{
  var host = server.address().address;
  var port = server.address().port;

  console.log('app listening on the port: %s', port);
  console.log('app executed in: %s', __dirname);
});

/*
**  event ctr-C
*/

server.on('close', function()
{
  dbTool.db.close();
  console.log(' Stopping ...');
});

process.on('SIGINT', function()
{
  server.close();
});
