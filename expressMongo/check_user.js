var nano = require('nano')('http://localhost:5984');
var dbLog = nano.db.use('login');

function check_user(req, res, next)
{
  var header = req.headers['authorization']||'',  // get the header
  token = header.split(/\s+/).pop()||'',          // and the encoded auth token
  auth = new Buffer(token, 'base64').toString(),  // convert from base64
  parts = auth.split(/:/),                        // split on colon
  username = parts[0],
  password = parts[1];
  console.log("user = " + username);
  console.log("pass = " + password);

  nano.db.get('login', function(err, body)
  {
    if (err)
      console.log("error on getting the db");
    else
    {
      console.log(body);
      var json = body;
      console.log(json._id);
    }
  });
  next();
}

exports.check_user = check_user;
