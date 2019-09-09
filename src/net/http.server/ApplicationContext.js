/**
 * Created by yangyxu on 8/20/14.
 */
zn.define([
    'node:path',
    'node:fs',
    './controller/ApplicationController'
], function (node_path, node_fs, ApplicationController) {

    return zn.Class({
        events: ['register'],
        properties: {
            config: null,
            serverContext: null,
            deploy: null,
            root: null,
            uploadConfig: null,
            APP_PATH: null,
            routers: null,
            models: null,
            collections: null,
            controllers: null
        },
        methods: {
            init: function (config, serverContext){
                this._routers = {};
                this._models = {};
                this._collections = {};
                this._controllers = {};
                this._appContexts= {};


                this._config = config;
                this._serverContext = serverContext;
                this._deploy = config.deploy;
                this._root = node_path.join(serverContext._root, this._deploy);
                this._uploadConfig = this.__getUploadInfo();
                this._APP_PATH = config.APP_PATH;
                this.__initDBStore(config.databases||serverContext.config.databases);
                this.__registerApplicationController();
            },
            __makeDir: function (dir){
                var _paths = dir.split('/');
            },
            __getUploadInfo: function (){
                if(!this.config.upload && !this.serverContext.config.upload){
                    return;
                }

                var _uploadConfig = zn.extend({
                        root: this.config.root,
                        temp: node_path.join('uploads', 'temp'),
                        catalog: node_path.join('uploads', 'catalog'),
                        forward: '',
                        fileServer: null
                    }, this.config.upload, this.serverContext.config.upload),
                    _temp = node_path.join(_uploadConfig.root, _uploadConfig.temp),
                    _catalog = node_path.join(_uploadConfig.root, _uploadConfig.catalog),
                    _path = _uploadConfig.root;

                _uploadConfig.temp.split('/').map(function (value){
                    _path = node_path.join(_path, value);
                    if(value && !node_fs.existsSync(_path)){
                        node_fs.mkdirSync(_path, 0766);
                    }
                });

                _path = _uploadConfig.root;
                _uploadConfig.catalog.split('/').map(function (value){
                    _path = node_path.join(_path, value);
                    if(value && !node_fs.existsSync(_path)){
                        node_fs.mkdirSync(_path, 0766);
                    }
                });

                _uploadConfig.tempDir = _temp;
                _uploadConfig.catalogDir = _catalog;

                return _uploadConfig;
            },
            __registerApplicationController: function (){
                var _key = ApplicationController.getMeta('controller') || '';
                var _controller = new ApplicationController(this, this._stores);
                var _member,
                    _router,
                    _self = this;
                ApplicationController._methods_.forEach(function (method, index){
                    if(method!=='init'){
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
                    }
                });
            },
            getModels: function (){
                var _models = {};
                zn.extend(_models, this._models);
                zn.each(this._appContexts, function (appContext, index){
                    zn.extend(_models, appContext.getModels());
                });

                return _models;
            },
            getCollections: function (){
                var _collections = {};
                zn.extend(_collections, this._collections);
                zn.each(this._appContexts, function (appContext, index){
                    zn.extend(_collections, appContext.getCollections());
                });

                return _collections;
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
            registerCollections: function (collections){
                return zn.extend(this._collections, collections), this;
            },
            registerControllers: function (controllers){
                zn.extend(this._controllers, controllers);
                zn.extend(this._routers, this.__convertControllers(controllers));

                return this;
            },
            doLoaded: function (){

            },
            __convertControllers: function (controllers) {
                var _config = this._config,
                    _stores = this._stores,
                    _self = this,
                    _key,
                    _validate,
                    _controller,
                    _routers = {},
                    _router = null,
                    _member = null;

                zn.each(controllers, function (controller, name){
                    _key = controller.getMeta('controller') || name;
                    _validate = (controller.getMeta('validate') !== undefined) ? controller.getMeta('validate') : false;
                    _controller = new controller(_self, _stores);
                    controller._methods_.forEach(function (method, index){
                        if(method!="init"){
                            _member = controller.member(method);
                            if(_member.meta.router!==null){
                                _router = _member.meta.router || _member.name;
                                _router = node_path.normalize(zn.SLASH + (_config.deploy||'') + zn.SLASH + _key + zn.SLASH + _router);
                                _routers[_router] = {
                                    controller: _controller,
                                    action: method,
                                    handler: _member,
                                    appContext: _self,
                                    validate: (_member.meta.validate !== undefined) ? _member.meta.validate : _validate
                                };
                            }
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
                    _store = zn.db.data.Store.getStore(config);
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
