/**
 * Created by yangyxu on 8/20/14.
 */
zn.define(function (fs) {

    return zn.class('RequestHandlerManager', zn.data.List, {
        properties: {
            mapping: {},
            apps: {},
            defaultDelopyName: '__default'
        },
        methods: {
            init: function (args){
                this.sets(args);
                zn.extend(this.TArgs, {
                    root: args.serverRoot
                });
                this.super(args);
            },
            match: function (path){
                var _mapping = this.get('mapping'),
                    _paths = _mapping.routs,
                    _convert = _mapping.convert,
                    _path = path;

                for(var i= 0, _len = _paths.length; i < _len; i++){
                    if(_convert(_paths[i], _path)){
                        return true;
                    }
                }

                return false;
            },
            accept: function (request, response){
                this.__getHandler().doRequest(request, response, this);
            },
            registerApplication: function (app){
                var _app = app,
                    _appName = _app._deploy || this.defaultDelopyName;

                var _appObj = this.resolveApplication(_appName);

                if(_appObj){
                    zn.extend(_appObj._controllers, _app._controllers);
                }else{
                    this.get('apps')[_appName] = _app;
                }

                zn.info('Register App: '+_appName);
            },
            resolveApplication: function (appName){
                return this.get('apps')[appName];
            },
            __getHandler: function (){
                var _handler = this.findOneT(function (handler, index){
                    if(handler.status === 0){
                        return true;
                    }
                });

                if(!_handler){
                    _handler = this.push();
                }

                return _handler;

            }
        }
    });

});