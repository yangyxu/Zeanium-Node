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

                if (_paths.length){
                    switch (_paths.length){
                        case 1:
                            if(_paths[0]=='favicon.ico'){
                                _res.end();
                            }else {
                                _req.setParameter('ERROR_MESSAGE', "The request miss controller.");
                                this.__forward(_defaultAppName, '_error', '__404', _req, _res);
                            }
                            break;
                        case 2:
                            _req.setParameter('ERROR_MESSAGE', "The request miss action.");
                            this.__forward(_defaultAppName, '_error', '__404', _req, _res);
                            break;
                        case 3:
                            this.__forward(_paths[0], _paths[1], _paths[2], _req, _res);
                            break;
                    }
                }else {
                    this.__forward(_defaultAppName, '_default', '__index', _req, _res);
                }
            },
            __forward: function (project, controller, action, req, res){
                try{
                    var _app = this.handlerManager.resolveApplication(project),
                        _defaultAppName = this.handlerManager.defaultDelopyName;

                    if(!_app){
                        req.setParameter('ERROR_MESSAGE', "The http server can't found the ["+project+"] project.");
                        this.__forward(_defaultAppName, '_error', '__404', req, res);
                    }

                    var _controller = _app['_controllers'][controller];
                    if(!_controller){
                        req.setParameter('ERROR_MESSAGE', "The http server can't found the ["+controller+"] controller.");
                        this.__forward(_defaultAppName, '_error', '__404', req, res);
                    }

                    var _action = _controller[action];
                    if(!_action){
                        req.setParameter('ERROR_MESSAGE', "The http server can't found the ["+action+"] action.");
                        this.__forward(_defaultAppName, '_error', '__404', req, res);
                        return;
                    }

                    var _meta = _controller.member(action).meta;
                    if(!this.__checkMeta(_meta, req, res, _defaultAppName)){ return; }

                    _action.call(_controller, req, res, req.get('serverRequest'), res.get('serverResponse'));
                }catch(e){
                    zn.error(e.message);
                    req.setParameter('ERROR_MESSAGE', e.message);
                    //this.__forward(this.get('defaultAppName'), '_error', '__404', req, res);
                }
            },
            __checkMeta: function (_meta, req, res, _defaultAppName){
                var _values = {};
                if(_meta){
                    var _requestMethod = req.method,
                        _method = _meta.method || 'GET&POST',
                        _argv = _meta.argv || {};
                    if(_method.indexOf(_requestMethod) === -1){
                        req.setParameter('ERROR_MESSAGE', "The allowed request method is ["+_route.method+"] but not ["+req.method+"].");
                        this.__forward(_defaultAppName, '_error', '__method_not_allowed', req, res);
                        return false;
                    }

                }

                return _values;
            }
        }
    });

});