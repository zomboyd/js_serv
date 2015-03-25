function route(pathname, handle, response, postData)
{
    console.log("Debut du traitement de l'URL " + pathname + ".");
    if (typeof handle[pathname] === 'function')
      handle[pathname](response, postData);
    else
    {
      console.log(pathname + " non pris en charge.");
      response.writeHead(404, {"Content-Type": "text/plain"});
      response.write("404 non trouvé.");
      response.end();
    }
};

exports.route = route;
