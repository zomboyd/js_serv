var express = require('express');
var pars = require('body-parser');
var app = express();
var check_user = require("./check_user")

app.use(pars.urlencoded({ extended: false }));
var jsonParser = pars.json();

app.get('/', function(req, res)
{
  var jsonObj = {'key':'value'};                  //test parsing JSON
  console.log(JSON.stringify(jsonObj));           //documents
  var json = JSON.parse(JSON.stringify(jsonObj));
  console.log(json.key);
  res.end("Hello Wolrd!");
});

app.post('/', check_user.check_user, function(req, res)
{
  console.log("POST recu -> " + req.body.id);
  res.send("Tentative de POST -> " + req.body.id);
});

var server = app.listen(8888, function()
{
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});
