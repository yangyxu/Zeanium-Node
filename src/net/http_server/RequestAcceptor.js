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
                this._dynamicManager = new RequestHandlerManager(config.dynamicHandlerManager||{});
                this._staticManager = new RequestHandlerManager(config.staticHandlerManager||{});
                /**scanProject for dynamicManager**/
                this.__scanProject(config, this._dynamicManager);
            },
            accept: function (request, response){
                var _url = request.url;

                if(this._staticManager.match(_url)){
                    this._staticManager.accept(request, response);
                }else if(this._dynamicManager.match(_url)) {
                    this._dynamicManager.accept(request, response);
                }else {

                }
            },
            __scanProject: function (config, dynamicManager){
                var _appScanner = new AppScanner(),
                    _catalog = config.catalog;

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
                    zn.info('http://'+config.host+":"+config.port+"/[project]/[controller]/[action]");
                });
            }
        }
    });

});