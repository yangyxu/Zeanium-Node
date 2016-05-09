/**
 * Created by yangyxu on 8/20/14.
 */
zn.define([
    'node:path'
], function (node_path) {

    return zn.Class({
        events: ['register'],
        properties: {
            deploy: null,
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
                this._actions = {};
                this._controllers = {};
                this._appContexts= {};
                this._appRoot = serverContext._root + zn.SLASH + this._deploy;
                this.__initDBStore(appConfig.databases);
            },
            registerApplicationContext: function (appContext){
                if(appContext){
                    this._appContexts[appContext._deploy] = appContext;
                    zn.extend(this._serverContext._routers, appContext._routers);
                }
            },
            registerActions: function (actions){
                zn.extend(this._actions, actions);
            },
            registerControllers: function (controllers){
                zn.extend(this._controllers, controllers);
                zn.extend(this._routers, this.__convertControllers(controllers));
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
                        _router = _member.meta.router || _member.name;
                        _router = node_path.normalize(zn.SLASH + (_config.deploy||'') + zn.SLASH + _key + zn.SLASH + _router);
                        _routers[_router] = {
                            controller: _controller,
                            action: method,
                            appContext: _self
                        };
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
