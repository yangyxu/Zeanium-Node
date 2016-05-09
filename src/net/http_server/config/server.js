zn.define([
    '../handler/RestfulRequestHandler',
    '../handler/ResourceRequestHandler',
],function (RestfulRequestHandler, ResourceRequestHandler){

    return {
        host: '127.0.0.1',
        port: 8888,
        catalog: '/webapps/',
        mode: 'debug',     //release, debug, view,
        indexs: ['index.html', 'index.htm', 'default.html', 'default.htm'],
        requestHandlers: [
            {
                name: 'restful',
                min: 0,
                max: 100,
                handlerClass: RestfulRequestHandler,
                mapping: function (url, context, handler){
                    var _routers = context._routers;
                    if(_routers[url]){
                        return true;
                    } else {
                        return false;
                    }
                }
            },
            {
                name: 'resource',
                min: 0,
                max: 5,
                handlerClass: ResourceRequestHandler,
                mapping: function (url, context, handler){
                    return true;
                }
            }
        ]
    }

});
