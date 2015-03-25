var express = require('express');
var nano = require('nano')('http://localhost:5984');
var pars = require('body-parser');
var app = express();

app.use(pars.urlencoded({ extended: false }));

app.get('/', function(req, res)
{
  res.end("Hello Wolrd!");
});

app.post('/', function(req, res)
{
  var header=req.headers['authorization']||'',  // get the header
  token=header.split(/\s+/).pop()||'',          // and the encoded auth token
  auth=new Buffer(token, 'base64').toString(),  // convert from base64
  parts=auth.split(/:/),                        // split on colon
  username=parts[0],
  password=parts[1];
  console.log("POST recu -> " + req);
  res.send("Tentative de POST -> " +
  req.body.id + " user -> " +
  username + " pass -> " + password);
});

var server = app.listen(8888, function()
{
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});
