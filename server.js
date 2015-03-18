var http = require("http");
var url = require("url");

function start(route)
{
    function onReq(req, resp)
    {
	var pathname = url.parse(req.url).pathname;
	console.log("requete pour le chemin " + pathname + " recu.");
	route(pathname);
	resp.writeHead(200, {"Content-Type": "text/plain"});
	resp.write("Hello!");
	resp.end();
    };    
    http.createServer(onReq).listen("8888");
    console.log("Server starts");
}

exports.start = start;
