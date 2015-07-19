/**
 * Created by yangyxu on 8/20/14.
 */
zn.define([
    'node:fs'
],function (fs) {
    var Async = zn.async;

    return zn.class('AppScanner', {
        properties: {

        },
        methods: {
            init: function (){

            },
            scan: function (path, catalog, onLoadApp){
                var _defer = Async.defer(),
                    _onLoadApp = onLoadApp||function (){},
                    _self = this;
                zn.info('Scanning catalog:'+path);
                fs.readdir(path, function(err, files){
                    if(err){
                        zn.error(err);
                        return;
                    }
                    var _apps = [], _appPath = {};
                    files.forEach(function(file){
                        if(file.indexOf('.')===-1){
                            var _path = path + file,
                                _web_config = _path + '/web_config';
                            zn.info('Loading Path: '+catalog+file);
                            zn.load(_web_config, function (config){
                                if(!_appPath[file] && config.controllers){
                                    _appPath[file] = _path;
                                    zn.load(_path+config.controllers, function (controllers){
                                        zn.info('Loading Project: '+config.deploy);
                                        config.root = _path;
                                        var _app = {
                                            _deploy: config.deploy || file,
                                            _controllers: _self.__convertController(controllers, config)
                                        };
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
                var __controllers = {},
                    _key, _controller;

                zn.each(controllers, function (controller, name){
                    _key = controller.getMeta('controller')||name;
                    _controller = new controller();
                    _controller.config = config;
                    __controllers[_key] = _controller;
                });

                return __controllers;
            }
        }
    });

});