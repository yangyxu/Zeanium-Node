/**
 * Created by yangyxu on 8/20/14.
 */
zn.define([
    './controller/index',
    './Request',
    './Response',
    './RequestHandlerManager',
    './AppScanner'
],function (controllers, Request, Response, RequestHandlerManager, AppScanner) {

    return zn.class('RequestAcceptor', {
        static: true,
        properties: {
            
        },
        methods: {
            init: function (){
                this._accepts = [];
            },
            initHandlerManager: function (config){
                var _root = config.__dirname + config.catalog,
                    _common = {
                        serverRoot: _root
                    },
                    _dynamic = zn.extend(config.dynamicHandlerManager||{}, _common),
                    _static = zn.extend(config.staticHandlerManager||{}, _common);

                this._dynamicManager = new RequestHandlerManager(_dynamic);
                this._staticManager = new RequestHandlerManager(_static);
                /**scanProject for dynamicManager**/

                this.__getContext = function (){ return config.__context__; }
                this.__scanProject(config, this._dynamicManager);
            },
            accept: function (serverRequest, serverResponse){
                var _url = serverRequest.url;

                serverResponse.getContext = this.__getContext;

                if(this._staticManager.match(_url)){
                    this._staticManager.accept(serverRequest, serverResponse);
                }else if(this._dynamicManager.match(_url)) {
                    this._dynamicManager.accept(serverRequest, serverResponse);
                }else {

                }
            },
            __scanProject: function (config, dynamicManager){
                var _appScanner = new AppScanner(),
                    _catalog = config.catalog,
                    _self = this;

                /************load system default controllers************/
                var __default = {
                    _delopy: dynamicManager.defaultDelopyName,
                    _controllers: _appScanner.__convertController(controllers)
                };
                dynamicManager.registerApplication(__default);

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