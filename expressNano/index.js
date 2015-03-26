var express = require('express');
var nano = require('nano')('http://localhost:5984');
var pars = require('body-parser');
var app = express();
var check_user = require('./check_user')

app.use(pars.urlencoded({ extended: false }));

app.get('/', function(req, res)
{
  res.end("Hello Wolrd!");
});

app.post('/', function(req, res)
{
  check_user(req, res);
  console.log("POST recu -> " + req);
  res.send("Tentative de POST -> " + req.body.id);
});

var server = app.listen(8888, function()
{
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});
