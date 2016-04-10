/**
 * Created by yangyxu on 8/20/14.
 */
zn.define(function () {

    return zn.handler('MvcRequestHandler', {
        properties: {

        },
        methods: {
            init: function (inConfig){
                this.super(inConfig);
            },
            doRequest: function (request, response){
                this.super(request, response);
                var _paths = request.get('paths');
                if (!_paths.length){
                    return this.forword('_zn', '_default', '__index', request, response);
                }

                console.log('paths, ', _paths);

                switch (_paths.length){
                    case 1:
                        return response.writeURL(request.url), false;
                    case 2:
                        return response.writeURL(request.url), false;
                    case 3:
                        return this.forword(_paths[0], _paths[1], _paths[2], request, response);
                }
            },
            forword: function (project, controller, action, request, response){
                try{
                    zn.info('MvcRequestHandler forword: { project: ' + project + ', controller: ' + controller + ', action: ' + action+' }');
                    if(!this._apps){
                        return response.writeURL(request.url), false;
                    }

                    var _app = this._apps[project];
                    if(!_app){
                        return response.writeURL(request.url), false;
                    }

                    response.setWebConfig(_app._config);

                    var _controller = _app['_controllers'][controller];
                    if(!_controller){
                        return response.writeURL(request.url), false;
                    }

                    var _action = _controller[action];
                    if(!_action){
                        return response.writeURL(request.url), false;
                    }

                    request.parse(function (data){
                        var _meta = _controller.member(action).meta,
                            _values = this.__checkMeta(_meta, request, response);

                        if(!_values){
                            return false;
                        }
                        _action.call(_controller, request, response, _values, request.$post, request.$get, request.$files, data);
                    }.bind(this));
                }catch(e){
                    zn.error(e.message);
                    req.setErrorMessage(e.message);
                    return this.forword('_zn', '_error', '__404', request, response);
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
                        this.forword('_zn', '_error', '__405', request, response);
                        return false;
                    }

                    return request.checkArgs(_argv, response);
                }

                return request.checkArgs({}, response);
            }
        }
    });

});
