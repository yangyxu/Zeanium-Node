/**
 * Created by yangyxu on 8/20/14.
 */
zn.define([
    './Request',
    './Response',
    './RequestHandler'
],function (Request, Response, RequestHandler) {

    return zn.class('MvcRequestHandler', RequestHandler, {
        properties: {
            apps: {
                value: {}
            },
            defaultAppName: '__server_default'
        },
        methods: {
            init: function (inConfig){
                this.super(inConfig);
            },
            doRequest: function (request, response){
                var _req = new Request(request),
                    _res = new Response(_req, response);
                var _paths = _req.get('paths'),
                    _defaultAppName = this.get('defaultAppName');
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
                    var _app = this.__resolveApp(project),
                        _defaultAppName = this.get('defaultAppName');
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

                    _action.call(_controller, req, res, req.get('serverRequest'), res.get('serverResponse'));
                }catch(e){
                    zn.error(e.message);
                    req.setParameter('ERROR_MESSAGE', e.message);
                    this.__forward(this.get('defaultAppName'), '_error', '__404', req, res);
                }
            },
            __registerApp: function (app){
                var _app = app||{ _deploy: this.get('defaultAppName'), _controllers: {} };
                var _appName = _app._deploy || this.get('defaultAppName');
                var _appObj = this.get('apps')[_appName];
                if(_appObj){
                    zn.extend(_appObj._controllers, _app._controllers);
                }else{
                    this.get('apps')[_appName] = _app;
                }
                zn.info('Register App: '+_appName);
            },
            __resolveApp: function (appName){
                return this.get('apps')[appName];
            }
        }
    });

});