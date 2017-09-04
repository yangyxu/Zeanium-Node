/**
 * Created by yangyxu on 8/20/14.
 */
zn.define([
    'node:fs',
    'node:path',
    './ApplicationContext'
],function (fs, node_path, ApplicationContext) {

    var CONFIG = {
        PLUGIN: 'zn.plugin.config.js',
        SERVER: 'zn.server.config.js',
        APP: 'zn.app.config.js'
    };

    return zn.Class({
        methods: {
            init: function (context){
                this._context = context;
            },
            scanWebRoot: function (path, callback){
                var _defer = zn.async.defer(),
                    _config = this._context._config,
                    _modules = _config.modules,
                    _apps = [],
                    _self = this;
                zn.info('[ Begin ] Scanning Path:' + path);
                fs.readdir(path, function(err, files){
                    if(err){ zn.error(err); return; }
                    var _queue = zn.queue();
                    files.forEach(function(file){
                        if((_modules && _modules.indexOf(file)!=-1) || !_modules){
                            _queue.push(function (task){
                                _self.scanApplication.call(_self, path, file, function (appContext){
                                    task.done(appContext);
                                });
                            }, _self);
                        }
                    });

                    _config.node_modules && _config.node_modules.forEach(function (name, index){
                        var _paths = require.resolve(name).split(name);
                        _queue.push(function (task){
                            _self.scanApplication.call(_self, _paths[0], name, function (appContext){
                                task.done(appContext);
                            });
                        }, _self);
                    });

                    _queue.every(function (appContext){
                        if(appContext){
                            _apps.push(appContext);
                            callback && callback(appContext);
                        }
                    }).finally(function(){
                        _defer.resolve(_apps);
                    }).start();
                });

                return _defer.promise;
            },
            scanApplication: function (path, file, callback, applicationContext){
                var _defer = zn.async.defer(),
                    _queue = zn.queue(),
                    _apps = [],
                    _self = this,
                    _appPath = path + file,
                    _appContext = null,
                    _serverContext = this._context,
                    _configPath = node_path.join(_appPath, CONFIG.APP);

                if(!fs.statSync(_appPath).isDirectory()||!fs.existsSync(_configPath)){
                    _defer.reject('Path: '+_appPath+' is invalid!');
                    callback && callback();
                    return _defer.promise;
                }

                if(applicationContext){
                    zn.info('Loading Plugin: '+ _appPath);
                }else {
                    zn.info('Loading Application: '+ _appPath);
                }
                zn.load(_configPath, function (appConfig){
                    var _deploy = appConfig.deploy || file;
                    if(!_deploy){
                        var _temp = path.split(zn.SLASH),
                            _len = _temp.length;
                        while (!_deploy) {
                            _len = _len -1;
                            _deploy = _temp[_len];
                        }
                    }

                    appConfig.root = appConfig.APP_PATH = _appPath;
                    if(appConfig.view){
                        appConfig.view.absolutePath = _appPath;
                    }
                    if(applicationContext){
                        if(!appConfig.databases){
                            appConfig.databases = applicationContext._appConfig.databases;
                        }
                        _deploy = node_path.join(applicationContext._deploy, 'plugins', _deploy);
                    }

                    _appContext = new ApplicationContext(zn.overwrite(appConfig, {
                        deploy: _deploy
                    }), _serverContext);

                    _queue.push(function (task){
                        _self.scanPackage(_appPath, appConfig.models, appConfig.controllers, _appContext, function (applicationContext){
                            if(appConfig.plugin){
                                _self.scanPlugin(appConfig.root + appConfig.plugin, applicationContext, callback);
                            } else {
                                callback && callback(applicationContext);
                            }
                        }).then(function (applicationContext){
                            task.done(applicationContext);
                        });
                    }, _self);

                    /** ---- load node ---- **/
                    appConfig.node_modules && appConfig.node_modules.forEach(function (name, index){
                        var _paths = require.resolve(name).split(name);
                        _queue.push(function (task){
                            _self.scanApplication.call(_self, _paths[0], name, function (appContext){
                                callback && callback(appContext);
                                task.done(appContext);
                            });
                        }, _self);
                    });

                    _queue.every(function (appContext){
                        if(appContext){
                            _apps.push(appContext);
                        }
                    }).finally(function(){
                        _defer.resolve(_apps);
                    }).start();
                    /****   ----    ----    ***/

                });

                return _defer.promise;
            },
            scanPlugin: function (path, applicationContext, callback){
                var _defer = zn.async.defer(),
                    _self = this;
                fs.readdir(path, function(err, files){
                    if(err){
                        zn.error(err);
                        callback(applicationContext);
                        return;
                    }
                    var _queue = zn.queue();
                    files.forEach(function(file){
                        _queue.push(function (task){
                            this.scanApplication.call(this, path, file, function (appContext){
                                task.done(appContext);
                            }, applicationContext);
                        }, _self);
                    });
                    _queue.every(function (appContext){
                        if(appContext){
                            applicationContext.registerApplicationContext(appContext);
                        }
                    }).finally(function(){
                        _defer.resolve(applicationContext);
                        callback(applicationContext);
                    }).start();
                });

                return _defer.promise;
            },
            scanPackage: function (path, models, controllers, applicationContext, callback){
                var _defer = zn.async.defer(),
                    _self = this;

                var _models = models || [],
                    _controllers = controllers || [];
                if(typeof _models == 'string'){ _models = [_models]; }
                if(typeof _controllers == 'string'){ _controllers = [_controllers]; }
                _models = _models.map(function (value){ return path + value; });
                _controllers = _controllers.map(function (value){ return path + value; });

                var _splitIndex = _controllers.length,
                    __models = {},
                    __collections = {},
                    __controllers= {};
                zn.define(_controllers.concat(_models), function (){
                    zn.each(arguments, function (items, index){
                        if(index > (_splitIndex - 1)){
                            var _item = null,
                                _items = {},
                                _collection = null,
                                _table = null,
                                _name = null;

                            for(var key in items){
                                _item = items[key];
                                if(!_item){
                                    zn.error('The model ['+key+'] is not exist.');
                                    continue;
                                }
                                _name = _item.$path.split(zn.SLASH).pop().split('.').shift();
                                _collection = _self.getCollection(_item);
                                _table = _item.getMeta('table');
                                __collections[key] = __collections[_name] = _collection;
                                _items[_name] = _item;
                                if(_table){
                                    __collections[_table] = _collection;
                                }
                            }

                            zn.extend(__models, _items);
                        } else {
                            zn.extend(__controllers, items);
                        }
                    });
                    applicationContext.registerModels(__models);
                    applicationContext.registerCollections(__collections);
                    applicationContext.registerControllers(__controllers);
                    applicationContext.doLoaded();
                    callback && callback(applicationContext);
                    _defer.resolve(applicationContext);
                }).exec();

                return _defer.promise;
            },
            getCollection: function (ModelClass) {
                var _collections = [];
                var _methods = this.__getModelCollections(ModelClass, _collections);
                return zn.Collection({
                    model: ModelClass,
                    methods: _methods
                });
            },
            __getModelCollections: function (ModelClass, collections){
                var _mixin = null,
                    _methods = {},
                    _collection = ModelClass.getMeta('collection'),
                    _mixins_ = ModelClass._mixins_;
                if(_collection){
                    _methods = _collection.getMeta('methods');
                    collections.push(_collection);
                }
                for(var _i = 0, _len = _mixins_.length; _i < _len; _i++){
                    zn.extend(_methods, this.__getModelCollections(_mixins_[_i], collections));
                }

                return _methods;
            }
        }
    });

});
