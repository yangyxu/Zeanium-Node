/**
 * Created by yangyxu on 8/20/14.
 */
zn.define([
    './RequestHandler'
],function (RequestHandler) {

    return zn.class('MvcRequestHandler', RequestHandler, {
        properties: {

        },
        methods: {
            init: function (inConfig){
                this.sets(inConfig);
                this.super(inConfig);
            },
            doRequest: function (serverRequest, serverResponse, handlerManager){
                this.__reset(serverRequest, serverResponse, handlerManager);
                var _req = this.request,
                    _res = this.response,
                    _paths = _req.get('paths'),
                    _self = this,
                    _defaultAppName = handlerManager.defaultDelopyName;

                this.status = 1;
                _res.on('end', function (){
                    _self.status = 0;
                });

                if (!_paths.length){
                    return this.__forward(_defaultAppName, '_default', '__index', _req, _res);
                }

                switch (_paths.length){
                    case 1:
                        _req.setErrorMessage("The request miss controller.");
                        return this.__forward(_defaultAppName, '_error', '__404', _req, _res);
                    case 2:
                        _req.setErrorMessage("The request miss action.");
                        return this.__forward(_defaultAppName, '_error', '__404', _req, _res);
                    case 3:
                        return this.__forward(_paths[0], _paths[1], _paths[2], _req, _res);
                }
            },
            __forward: function (project, controller, action, req, res){
                try{
                    var _app = this.handlerManager.resolveApplication(project),
                        _defaultAppName = this.handlerManager.defaultDelopyName;

                    if(!_app){
                        req.setErrorMessage("The http server can't found the ["+project+"] project.");
                        return this.__forward(_defaultAppName, '_error', '__404', req, res);
                    }

                    var _controller = _app['_controllers'][controller];
                    if(!_controller){

                        req.setErrorMessage("The http server can't found the ["+controller+"] controller.");
                        return this.__forward(_defaultAppName, '_error', '__404', req, res);
                    }

                    var _action = _controller[action];
                    if(!_action){
                        req.setErrorMessage("The http server can't found the ["+action+"] action.");
                        return this.__forward(_defaultAppName, '_error', '__404', req, res);
                    }

                    var _meta = _controller.member(action).meta,
                        _values = this.__checkMeta(_meta, req, res, _defaultAppName);
                    if(!_values){
                        return false;
                    }

                    res.getConfig = function (){ return _controller.config; }
                    _action.call(_controller, req, res, _values, req.get('serverRequest'), res.get('serverResponse'));
                }catch(e){
                    zn.error(e.message);
                    req.setErrorMessage(e.message);
                    this.__forward(_defaultAppName, '_error', '__404', req, res);
                }
            },
            __checkMeta: function (_meta, req, res, _defaultAppName){
                if(_meta){
                    var _requestMethod = req.method,
                        _method = _meta.method || 'GET&POST',
                        _argv = _meta.argv || {};
                    if(_method.indexOf(_requestMethod) === -1){
                        req.setErrorMessage("The allowed request method is [" + _meta.method + "] but not [" + req.method + "].");
                        this.__forward(_defaultAppName, '_error', '__405', req, res);
                        return false;
                    }

                    return req.checkArgs(_argv, res);
                }

                return req.checkArgs({}, res);
            }
        }
    });

});