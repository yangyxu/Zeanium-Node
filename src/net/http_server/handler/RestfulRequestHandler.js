/**
 * Created by yangyxu on 8/20/14.
 */
zn.define(['node:url'], function (node_url) {

    return zn.RequestHandler('RestfulRequestHandler', {
        methods: {
            doRequest: function (request, response){
                return this.forword(request.url, request, response);
            },
            forword: function (url, request, response){
                try{
                    zn.debug('Restful: ' + url);
                    var _context = this._context,
                        _routers = _context._routers;

                    var _router = _routers[node_url.parse(url, true).pathname];
                    if(!_router){
                        return response.writeURL(url), false;
                    }
                    response.applicationContext = _router.appContext;
                    request.parse(function (data){
                        try {
                            var _controller = _router.controller,
                                _action = _router.action,
                                _meta = _controller.member(_action).meta,
                                _values = this.__checkMeta(_meta, request, response);

                            if(!_values){
                                return false;
                            }
                            _controller[_action].call(_controller, request, response, _values, request.$post, request.$get, request.$files, data);
                        } catch (e) {
                            zn.error('RestfulRequestHandler doRequest line 66 Error: ' + e.message);
                            console.log(e.stack);
                        } finally {

                        }
                    }.bind(this));
                }catch(e){
                    zn.error(e.message);
                    console.log(e.stack);
                    request.setErrorMessage(e.message);
                    return this.forword('__zn__/error/__404', request, response);
                }

                return false;
            },
            __checkMeta: function (_meta, request, response){
                if(_meta){
                    var _requestMethod = request.method,
                        _method = _meta.method || 'GET&POST',
                        _argv = _meta.argv || {};

                    if(_method.indexOf(_requestMethod) === -1){
                        request.setErrorMessage("The allowed request method is [" + _meta.method + "] but not [" + request.method + "].");
                        return this.forword('__zn__/error/__405', request, response), false;
                    }

                    return request.checkArgs(_argv, response);
                }

                return request.checkArgs({}, response);
            }
        }
    });

});
