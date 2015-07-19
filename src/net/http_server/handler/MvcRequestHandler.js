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
                    _defaultAppName = handlerManager.defaultDelopyName;

                this.status = 1;

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
                        _defaultAppName = this.handlerManager.defaultDelopyName,
                        _self = this;

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

                    var _route = _controller.member(action).meta.route;
                    if(_route){
                        if(_route.method.toUpperCase() !== req.method.toUpperCase()){
                            req.setParameter('ERROR_MESSAGE', "The allowed request method is ["+_route.method+"] but not ["+req.method+"].");
                            this.__forward(_defaultAppName, '_error', '__method_not_allowed', req, res);
                            return;
                        }
                    }

                    res.on('end', function (){
                        _self.status = 0;
                    });

                    _action.call(_controller, req, res, req.get('serverRequest'), res.get('serverResponse'));
                }catch(e){
                    zn.error(e.message);
                    req.setParameter('ERROR_MESSAGE', e.message);
                    this.__forward(this.get('defaultAppName'), '_error', '__404', req, res);
                }
            }
        }
    });

});