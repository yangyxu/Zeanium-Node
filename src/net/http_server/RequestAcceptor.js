/**
 * Created by yangyxu on 8/20/14.
 */
zn.define([
    'node:chokidar',
    './controller/index',
    './Request',
    './Response',
    './RequestHandlerManager',
    './AppScanner',
    './handler/CatalogRequestHandler'
],function (chokidar, controllers, Request, Response, RequestHandlerManager, AppScanner, CatalogRequestHandler) {

    return zn.class('RequestAcceptor', {
        static: true,
        methods: {
            init: function (){
                this._accepts = [];
                this._catalogRequestHandler = new CatalogRequestHandler();
            },
            initHandlerManager: function (config){
                var _root = config.__dirname + config.catalog,
                    _common = { serverRoot: _root },
                    _dynamic = zn.extend(config.dynamicHandlerManager||{}, _common),
                    _static = zn.extend(config.staticHandlerManager||{}, _common);

                this._dynamicManager = new RequestHandlerManager(_dynamic);
                this._staticManager = new RequestHandlerManager(_static);
                this._config = config;
                /**scanProject for dynamicManager**/

                this.__getContext = function (){ return config.__context__; }
                this.__scanProject(this._config, this._dynamicManager);
            },
            accept: function (serverRequest, serverResponse){
                var _url = serverRequest.url,
                    _realUrl = _url
                    _mode = this._config.mode;

                if(_realUrl.slice(-1) === '/'){
                    _realUrl = _url.substring(0, _realUrl.length-1);
                }

                this._config.__context__.url = this._config.__context__.root + _realUrl;
                serverResponse.getContext = this.__getContext;

                if(_url === '/favicon.ico'){
                    return this.__doIdle(serverRequest, serverResponse);
                }

                if(_url === '/' || _mode === 'view'){
                    return this._catalogRequestHandler.doRequest(serverRequest, serverResponse, this._config);
                }

                if(this._staticManager.match(_url)){
                    this._staticManager.accept(serverRequest, serverResponse);
                }
                else if(this._dynamicManager.match(_url)) {
                    this._dynamicManager.accept(serverRequest, serverResponse);
                }
                else {
                    if(_mode === 'debug'){
                        return this.__doDebug(serverRequest, serverResponse, _url);
                    }else {
                        return this._catalogRequestHandler.doError(serverRequest, serverResponse, '403');
                    }
                }
            },
            __doIdle: function (serverRequest, serverResponse){
                serverResponse.end();
            },
            __doDebug: function (serverRequest, serverResponse, url){
                var _paths = url.split('/');
                    _paths.shift();

                var _project = _paths[0],
                    _controller = _paths[1],
                    _action = _paths[2],
                    _app = null;

                if(!_project){
                    return this._catalogRequestHandler.doError(serverRequest, serverResponse, '404');
                }

                _app = this._config.apps[_project];

                if(!_app){
                    return this._catalogRequestHandler.doError(serverRequest, serverResponse, '404');
                }

                var _controllers = _app._controllers;

                if(!_controllers){
                    return this._catalogRequestHandler.doError(serverRequest, serverResponse, '404');
                }

                if(_controller){
                    var _ctl = _controllers[_controller];
                    if(_ctl){
                        return this._catalogRequestHandler.viewModel(serverRequest, serverResponse, '_apis', {

                        });
                    }
                    else {
                        return this._catalogRequestHandler.doError(serverRequest, serverResponse, '404');
                    }
                }
                else {
                    return this._catalogRequestHandler.viewModel(serverRequest, serverResponse, '_controllers', {
                        ctls: Object.keys(_controllers)
                    });
                }

                if(_action){

                }
                else {

                }

            },
            __watch: function (){
                chokidar.watch('.', {
                    ignored: /[\/\\]\./
                }).on('raw', function(event, path, details) {
                    this.__doFileChange(path);
                }.bind(this));
            },
            __doFileChange: function (path){
                if(path.substr(-3, 3)=='.js'){
                    this.__scanProject(this._config, this._dynamicManager);
                    //console.log(path);
                }
            },
            __scanProject: function (config, dynamicManager){
                var _appScanner = new AppScanner(config),
                    _catalog = config.catalog,
                    _self = this;

                /************load system default controllers************/
                var __default = {
                    _delopy: dynamicManager.defaultDelopyName,
                    _controllers: _appScanner.__convertController(controllers)
                };
                dynamicManager.registerApplication(__default);
                this.__watch(config.__dirname + _catalog);
                /************load apps controllers************/
                _appScanner.scan(config.__dirname + _catalog, _catalog, function (app){
                    dynamicManager.registerApplication(app);
                }).then(function (apps){

                }).finally(function (){
                    zn.info(config.__context__.root + "/[project]/[controller]/[action]");
                });
            }
        }
    });

});
