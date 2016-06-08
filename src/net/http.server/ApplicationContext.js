/**
 * Created by yangyxu on 8/20/14.
 */
zn.define([
    'node:path',
    './controller/ApplicationController'
], function (node_path, ApplicationController) {

    return zn.Class({
        events: ['register'],
        properties: {
            deploy: null,
            root: null,
            appRoot: null,
            appConfig: null,
            routers: null,
            serverContext: null,
            APP_PATH: null
        },
        methods: {
            init: function (appConfig, serverContext){
                this._config = this._appConfig = appConfig;
                this._serverContext = serverContext;
                this._APP_PATH = appConfig.APP_PATH;
                this._deploy = appConfig.deploy||'';
                this._routers = {};
                this._models = {};
                this._actions = {};
                this._controllers = {};
                this._appContexts= {};
                this._appRoot = this._root = serverContext._root + zn.SLASH + this._deploy;
                this.__initDBStore(appConfig.databases);
                this.__registerApplicationController();
            },
            __registerApplicationController: function (){
                var _key = ApplicationController.getMeta('controller') || '';
                var _controller = new ApplicationController(this, this._stores);
                var _member,
                    _router,
                    _self = this;
                ApplicationController._methods_.forEach(function (method, index){
                    _member = ApplicationController.member(method);
                    if(_member.meta.router!==null){
                        _router = _member.meta.router || _member.name;
                        _router = node_path.normalize(zn.SLASH + (_self._deploy||'') + zn.SLASH + _key + zn.SLASH + _router);
                        _self._routers[_router] = {
                            controller: _controller,
                            action: method,
                            handler: _member,
                            appContext: _self
                        };
                    }
                });

                //console.log;
            },
            registerApplicationContext: function (appContext){
                if(appContext){
                    this._appContexts[appContext._deploy] = appContext;
                    zn.extend(this._serverContext._routers, appContext._routers);
                }
            },
            registerModels: function (models){
                return zn.extend(this._models, models), this;
            },
            registerActions: function (actions){
                return zn.extend(this._actions, actions), this;
            },
            registerControllers: function (controllers){
                zn.extend(this._controllers, controllers);
                zn.extend(this._routers, this.__convertControllers(controllers));

                return this;
            },
            __convertControllers: function (controllers) {
                var _config = this._appConfig,
                    _stores = this._stores,
                    _self = this,
                    _key,
                    _controller,
                    _routers = {},
                    _router = null,
                    _member = null;

                zn.each(controllers, function (controller, name){
                    _key = controller.getMeta('controller') || name;
                    _controller = new controller(_self, _stores);
                    controller._methods_.forEach(function (method, index){
                        _member = controller.member(method);
                        if(_member.meta.router!==null){
                            _router = _member.meta.router || _member.name;
                            _router = node_path.normalize(zn.SLASH + (_config.deploy||'') + zn.SLASH + _key + zn.SLASH + _router);
                            _routers[_router] = {
                                controller: _controller,
                                action: method,
                                handler: _member,
                                appContext: _self
                            };
                        }
                    });
                });

                return _routers;
            },
            __initDBStore: function (databaseSetting){
                var _stores = {},
                    _store = null,
                    _self = this;
                zn.each((databaseSetting || []), function (config, index){
                    _store = zn.Store.getStore(config);
                    _stores[index] = _store;
                    if(config.default){
                        _self._store = _store;
                    }
                });

                this._stores = _stores;
            }
        }
    });

});
