zn.define([
    '../handler/RequestHandler',
    '../handler/MvcRequestHandler',
    '../handler/ResourceRequestHandler',
],function (RequestHandler, MvcRequestHandler, ResourceRequestHandler){

    return {
        host: '127.0.0.1',
        port: 8888,
        catalog: '/webapps/',
        mode: 'debug',     //release, debug, view,
        indexs: ['index.html', 'index.htm', 'default.html', 'default.htm'],
        requestHandlers: [
            {
                name: 'mvc',
                min: 0,
                max: 100,
                TClass: MvcRequestHandler,
                TClassArgv: {},
                mapping: {
                    routs: [
                        ''
                    ],
                    convert: function (rout, url){
                        return url.indexOf('.') === -1 && url.split('/').length > 3;
                    }
                }
            },
            {
                name: 'resource',
                min: 0,
                max: 20,
                TClass: ResourceRequestHandler,
                TClassArgv: {},
                mapping: {
                    routs: [
                        '/',
                        '/resources/*'
                    ],
                    convert: function (rout, url){
                        return true;
                        /*
                        if(url.indexOf('.') !== -1){
                            return true;
                        }
                        if(rout.slice(-1)==='*' && url.indexOf(rout.substring(0, rout.length-1)) !== -1){
                            return true;
                        }
                        if(rout === url){
                            return true;
                        }*/
                    }
                }
            }
        ]
    }

});
