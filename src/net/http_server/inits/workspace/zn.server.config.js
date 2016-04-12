zn.define(function (){

    return {
        host: '127.0.0.1',
        port: 8888,
        catalog: '/webapps/',
        mode: 'debug',     //release, debug, view,
        indexs: ['index.html', 'index.htm', 'default.html', 'default.htm'],
        requestHandlers: [
            /*
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
            }*/
        ]
    }

});
