/**
 * Created by yangyxu on 8/20/14.
 */
zn.define([
    'node:url'
],function (node_url) {

    return zn.Class({
        properties: {
            applicationContext: {
                get: function (){
                    return this._applicationContext;
                },
                set: function (value){
                    this._applicationContext = value;
                }
            },
            size: {
                get: function (){
                    return this._handlers.length;
                }
            }
        },
        methods: {
            init: function (context){
                this._handlers = [];
            },
            push: function (handler){
                if(!this._applicationContext){
                    this._applicationContext = handler.appContext;
                }
                return this._handlers.push(handler), this;
            },
            next: function (request, response){
                try {
                    var _request = request || this._request;
                    var _response = response || this._response;

                    var _handler = this._handlers.shift();
                    if(!_handler){
                        return;
                    }
                    this._request = _request;
                    this._response = _response;
                    zn.extend(request._$get, _handler.pathArgv||{});
                    var _controller = _handler.controller,
                        _action = _handler.action,
                        _meta = _controller.member(_action).meta,
                        _values = this.__checkMeta(_meta, request, response);

                    if(!_values){
                        return false;
                    }
                    //console.log(_handler);
                    if(!!_handler.validate && !_request.session.hasItem()){
                        return response.error('Session is invalid. Please login into system first.');
                    }
                    _controller[_action].call(_controller, request, response, this);
                } catch (e) {
                    zn.error('RequestHandlerChain doRequest line 45 Error: ' + e.message);
                    console.log(e.stack);
                }
            },
            __checkMeta: function (_meta, request, response){
                if(_meta){
                    var _requestMethod = request.method,
                        _method = _meta.method || 'GET&POST',
                        _argv = _meta.argv || {};

                    if(_method.indexOf(_requestMethod) === -1){
                        return response.forword('__zn__/error/__405'), false;
                    }

                    return request.checkArgs(_argv, response);
                }

                return request.checkArgs({}, response);
            }
        }
    });

});
