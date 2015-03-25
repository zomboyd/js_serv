var express = require('express');
var nano = require('nano')('http://localhost:5984');
var pars = require('body-parser');
var app = express();

app.use(pars.urlencoded({ extended: false }));

app.get('/', function(req, res)
{
  res.send("Hello Wolrd!");
});

app.post('/', function(req, res)
{
  res.end(req);
  console.log("POST recu -> " + req);
  res.send("Tentative de POST");
});

var server = app.listen(8888, function()
{
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});
