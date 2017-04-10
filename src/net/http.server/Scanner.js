/**
 * Created by yangyxu on 8/20/14.
 */
zn.define([
    'node:fs',
    './ApplicationContext'
],function (fs, ApplicationContext) {

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
                    _self = this,
                    _apps = [];
                zn.info('[ Begin ] Scanning Path:' + path);
                fs.readdir(path, function(err, files){
                    if(err){ zn.error(err); return; }
                    var _queue = zn.queue();
                    files.forEach(function(file){
                        _queue.push(function (task){
                            this.scanApplication.call(this, path, file, function (appContext){
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
                    _self = this,
                    _appPath = path + file,
                    _appContext = null;
                    _serverContext = this._context,
                    _configPath = _appPath + zn.SLASH + CONFIG.APP;

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
                    appConfig.root = appConfig.APP_PATH = _appPath;
                    if(appConfig.view){
                        appConfig.view.absolutePath = _appPath;
                    }
                    if(applicationContext){
                        if(!appConfig.databases){
                            appConfig.databases = applicationContext._appConfig.databases;
                        }
                        _deploy = applicationContext._deploy+ zn.SLASH + 'plugins' + zn.SLASH + _deploy;
                    }

                    _appContext = new ApplicationContext(zn.overwrite(appConfig, { deploy: _deploy }), _serverContext);
                    _self.scanPackage(_appPath, appConfig.models, appConfig.controllers, _appContext, function (applicationContext){
                        if(appConfig.plugin){
                            _self.scanPlugin(appConfig.root + appConfig.plugin, applicationContext, callback);
                        } else {
                            callback && callback(applicationContext);
                        }
                    }).then(function (applicationContext){
                        _defer.resolve(applicationContext);
                    });
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
                    __actions = {},
                    __controllers= {};

                zn.define(_controllers.concat(_models), function (){
                    zn.each(arguments, function (items, index){
                        if(index > (_splitIndex - 1)){
                            var _item = null,
                                _items = {},
                                _action = null,
                                _table = null,
                                _name = null;

                            for(var key in items){
                                _item = items[key];
                                if(!_item){
                                    zn.error('The model ['+key+'] is not exist.');
                                    continue;
                                }
                                _name = _item.$path.split(zn.SLASH).pop().split('.').shift();
                                _action = _self.getAction(_item);
                                _table = _item.getTable();
                                __actions[key] = __actions[_name] = _action;
                                _items[_name] = _item;
                                if(_table){
                                    __actions[_table] = _action;
                                }
                            }

                            zn.extend(__models, _items);
                        } else {
                            zn.extend(__controllers, items);
                        }
                    });
                    applicationContext.registerModels(__models);
                    applicationContext.registerActions(__actions);
                    applicationContext.registerControllers(__controllers);
                    applicationContext.doLoaded();
                    callback && callback(applicationContext);
                    _defer.resolve(applicationContext);
                }).exec();

                return _defer.promise;
            },
            getAction: function (ModelClass) {
                var _actions = [];
                this.__getModelActions(ModelClass, _actions);
                return zn.Action({
                    model: ModelClass,
                    mixins: _actions
                });
            },
            __getModelActions: function (ModelClass, actions){
                var _mixin = null,
                    _action = ModelClass.getMeta('action'),
                    _mixins_ = ModelClass._mixins_;

                if(_action){
                    actions.push(_action);
                }
                for(var _i = 0, _len = _mixins_.length; _i < _len; _i++){
                    this.__getModelActions(_mixins_[_i], actions);
                }
            }
        }
    });

});
