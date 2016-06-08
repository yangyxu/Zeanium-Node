/**
 * Created by yangyxu on 8/20/14.
 */
zn.define([
    'node:url',
    './RequestHandlerManager'
],function (node_url, RequestHandlerManager) {

    return zn.Class({
        methods: {
            init: function (context){
                this._context = context;
                this._handlerManagers = {};
                this.registerRequestHandlers();
            },
            registerRequestHandlers: function (){
                var _config = this._context.config;
                var _handlerManager = null;
                zn.each(_config.requestHandlers, function (handler, index){
                    _handlerManager = new RequestHandlerManager(handler, this._context);
                    this._handlerManagers[handler.name||index] = _handlerManager;
                }.bind(this));
            },
            accept: function (serverRequest, serverResponse){
                if(serverRequest.url === '/favicon.ico'){
                    return serverResponse.end();
                }
                var _url = node_url.parse(serverRequest.url, true).pathname,
                    _handlerManager = null,
                    _result = null,
                    _chain = false;

                for(var key in this._handlerManagers){
                    _handlerManager = this._handlerManagers[key];
                    _chain = _handlerManager.match(_url);
                    //zn.info('Do [' + key + '] request handler : ' + _match);
                    if(_chain){
                        return _handlerManager.accept(serverRequest, serverResponse, _chain);
                    }
                }
                // TODO:
                serverResponse.writeHead(404, 'Not Found Resource: ' + _url);
                serverResponse.end();
            }
        }
    });

});
