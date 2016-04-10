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
            init: function (){
                this._appPaths = {};
            },
            scanProject: function (path, file, onLoadApp){
                var _self = this,
                    _path = path + file,
                    _config = _path + zn.SLASH + 'zn.app.config';

                zn.info('Loading Project: '+ _path);
                zn.load(_config, function (config){
                    var _deploy = config.deploy || file || '__ZNDEFAULT__';
                    var _app = {
                        _config: config,
                        _folder: file,
                        _deploy: _deploy,
                        _controllers: {}
                    };
                    config.root = _path;
                    if(config.view){
                        config.view.absolutePath = _path;
                    }
                    if(config.controllers){
                        zn.load(_path + config.controllers, function (controllers){
                            _app['_controllers'] = _self.__convertController(controllers, config);
                            onLoadApp(_app);
                        });
                    } else {
                        onLoadApp(_app);
                    }
                });
            },
            scanWebRoot: function (path, scanHandler){
                var _defer = Async.defer(),
                    _self = this;

                zn.info('[ Begin ] Scanning WebRoot:' + path);

                fs.readdir(path, function(err, files){
                    if(err){
                        zn.error(err);
                        return;
                    }
                    var _apps = [];
                    files.forEach(function(file){
                        if(file.indexOf('.') === -1){
                            _self.scanProject(path, file, function (app){
                                _apps.push(app);
                                scanHandler(app);
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
