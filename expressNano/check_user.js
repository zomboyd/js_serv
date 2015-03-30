var nano = require('nano')('http://localhost:5984');
var dbLog = nano.db.use('white_list');

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

  nano.db.get('white_list', function(err, body)
  {
    if (!err)
    {
      console.log(body);
      var json = JSON.parse(body);
      console.log(json.key);
    }
  });
  next();
}

exports.check_user = check_user;
