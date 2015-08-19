/**
 * Created by yangyxu on 8/20/14.
 */
zn.define([
    'node:fs',
    'db'
],function (fs, db) {
    var Async = zn.async,
        Store = db.data.Store;

    return zn.class('AppScanner', {
        properties: {

        },
        methods: {
            init: function (config){
                config.apps = {};
                this._config = config;
            },
            scan: function (path, catalog, onLoadApp){
                var _defer = Async.defer(),
                    _onLoadApp = onLoadApp || function (){},
                    _self = this;

                zn.info('Scanning catalog:'+path);

                fs.readdir(path, function(err, files){
                    if(err){
                        zn.error(err);
                        return;
                    }
                    var _apps = [],
                        _appPath = {};
                    files.forEach(function(file){
                        if(file.indexOf('.')===-1){
                            var _path = path + file,
                                _web_config = _path + '/web_config';

                            zn.info('Loading Path: '+ catalog + file);

                            zn.load(_web_config, function (config){
                                if(!_appPath[file] && config.controllers){
                                    _appPath[file] = _path;
                                    zn.load(_path+config.controllers, function (controllers){

                                        zn.info('Loading Project: '+config.deploy);

                                        if(config.view){
                                            config.view.absolutePath = _path;
                                        }

                                        config.root = _path;

                                        var _app = {
                                            _folder: file,
                                            _deploy: config.deploy || file,
                                            _controllers: _self.__convertController(controllers, config)
                                        };

                                        _self._config.apps[file] = _app;
                                        _apps.push(_app);
                                        _onLoadApp(_app);
                                    });
                                }
                            });
                        }
                    });

                    _defer.resolve(_apps);
                });

                return _defer.promise;
            },
            __convertController: function (controllers, config) {
                var _controllers = {},
                    _config = config || {},
                    _key,
                    _controller,
                    _stores = this.__initDBStore(_config.databases);

                zn.each(controllers, function (controller, name){
                    _key = controller.getMeta('controller') || name;
                    _controller = new controller(_config, _stores);
                    _controllers[_key] = _controller;
                });

                return _controllers;
            },
            __initDBStore: function (databaseSetting){
                var _configs = databaseSetting || [],
                    _stores = {};

                zn.each(_configs, function (config, index){
                    _stores[index] = Store.getStore(config);
                });

                return _stores;
            }
        }
    });

});