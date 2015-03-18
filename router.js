function route(pathname, handle)
{
    console.log("Debut du traitement de l'URL" + pathname + ".");
    if (typeof handle[pathname] === 'function')
      handle[pathname]();
    else
      console.log(pathname + " non pris en charge.");
};

exports.route = route;
