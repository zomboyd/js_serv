var http = require("http");
var url = require("url");

function start(route, handle)
{
    function onReq(req, resp)
    {
      var postData = "";
      var pathname = url.parse(req.url).pathname;
      console.log("requete pour le chemin " + pathname + " recu.");
      req.setEncoding("utf8");
      req.addListener("data", function(postDataChunk)
        {
          postData += postDataChunk;
          console.log("Paquet POST recu '" + postDataChunk + "'.");
        });
      req.addListener("end", function()
        {
          route(pathname, handle, resp, postData);
        });
    };
    http.createServer(onReq).listen(8888);
    console.log("Server starts");
}

exports.start = start;
