zn.define([
    '../handler/MvcRequestHandler',
    '../handler/ResourceRequestHandler',
],function (MvcRequestHandler, ResourceRequestHandler){

    return {
        host: '127.0.0.1',
        port: 8888,
        catalog: '/webapps/',
        mode: 'release',     //release, debug, view,

        dynamicHandlerManager: {
            min: 0,
            max: 100,
            T: MvcRequestHandler,
            TArgs: {},
            mapping: {
                routs: [
                    ''
                ],
                convert: function (rout, url){
                    return url.indexOf('.') === -1 && url.split('/').length === 4;
                }
            }
        },
        staticHandlerManager: {
            min: 0,
            max: 20,
            T: ResourceRequestHandler,
            TArgs: {},
            mapping: {
                routs: [
                    '/resources/*'
                ],
                convert: function (rout, url){
                    if(url.indexOf('.') !== -1){
                        return true;
                    }
                    if(rout.slice(-1)==='*' && url.indexOf(rout.substring(0, rout.length-1)) !== -1){
                        return true;
                    }
                    if(rout === url){
                        return true;
                    }
                }
            }
        }
    }

});