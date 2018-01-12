/**
 * Created by yangyxu on 8/20/14.
 */
zn.define([
    'node:chokidar',
    'node:fs',
    'node:os',
    'node:path',
    './Scanner',
    './RequestAcceptor',
    './controller/HttpServerController',
    '../../session/MemorySessionManager'
], function (chokidar, node_fs, node_os, node_path, Scanner, RequestAcceptor, HttpServerController, MemorySessionManager) {

    var CONFIG = {
        PLUGIN: 'zn.plugin.config.js',
        SERVER: 'zn.server.config.js',
        APP: 'zn.app.config.js'
    };

    return zn.Class({
        events: ['init', 'loading', 'loaded'],
        statics: {
            getContext: function (inArgs) {
                return new this(inArgs);
            }
        },
        properties: {
            config: null,
            webPath: null,
            serverPath: null
        },
        methods: {
            init: function (args){
                var _config = args.config;
                this.sets(args);
                this.on('init', _config.onInit || zn.idle);
                this.on('loading', _config.onLoading || zn.idle);
                this.on('loaded', _config.onLoaded || zn.idle);
                this.__resetWatchCwd();
                this.__init();
                this._root = this.__getURL(_config.host, _config.port);
                this._sessionManager = new MemorySessionManager(_config.session);
                this._scanner = new Scanner(this);
                this._requestAcceptor = new RequestAcceptor(this);
                this._baseRouters = this.__registerHttpServerController();
                this.__scanWebPath();
                zn.SERVER_PATH = this._serverPath;
                zn.SERVER_URL = this._root;
                zn.WEB_PATH = this._webPath;
            },
            __init: function (){
                this._apps = {};
                this._routers = {};
                this._collections = {};
                this._changedFiles = [];
                this._deployDelay = 0;
            },
            __resetWatchCwd: function () {
                var _main = '',
                    _config = this._config,
                    _catalog = _config.catalog,
                    _modules = _config.modules;
                if(_modules && _modules[0]){
                    _main = _modules[0];
                }
                this._config.watchCwd = node_path.normalize(_catalog + _main + this._config.watchCwd);
            },
            getRouters: function (){
                return zn.extend(this._baseRouters, this._routers);
            },
            __registerHttpServerController: function (){
                var _key = HttpServerController.getMeta('controller') || '';
                var _controller = new HttpServerController(this);
                var _member,
                    _router,
                    _routers = {},
                    _self = this;
                HttpServerController._methods_.forEach(function (method, index){
                    if(method!=='init'){
                        _member = HttpServerController.member(method);
                        if(_member.meta.router!==null){
                            _router = _member.meta.router || _member.name;
                            _router = node_path.normalize('/' + _key + '/' + _router);
                            _routers[_router] = {
                                controller: _controller,
                                action: method,
                                handler: _member,
                                appContext: _self
                            };
                        }
                    }
                });

                return _routers;
            },
            accept: function (serverRequest, serverResponse){
                serverRequest.url = node_path.normalize(serverRequest.url);
                this._requestAcceptor.accept(serverRequest, serverResponse);
            },
            matchRouter: function (url){

            },
            registerRouters: function (routers){
                return zn.extend(this._routers, routers), this;
            },
            registerApplication: function (app){
                if(!app){ return }
                var _deploy = app._deploy;
                var _app = this._apps[_deploy];
                if(_app){
                    zn.extend(app._routers, _app._routers);
                } else {
                    this._apps[_deploy] = app;
                }

                app.parentContext = this;
                zn.extend(this._routers, app._routers);
                zn.extend(this._collections, app._collections);
                //console.log(Object.keys(this._routers));
                //app.fire('register', this);
                zn.info('Register Project(Application): ' + _deploy);
            },
            __scanWebPath: function (isRedeploy){
                var _config = this._config,
                    _webPath = this._webPath,
                    _self = this;
                if(node_fs.existsSync(_webPath + CONFIG.APP)){
                    var _queue = zn.queue();
                    _queue.push(function (task){
                        this._scanner.scanApplication(_webPath, '', function (app){
                            _self.registerApplication(app);
                        }).then(function (){
                            task.done();
                        });
                    }, _self);

                    _config.node_modules && _config.node_modules.forEach(function (name, index){
                        var _paths = require.resolve(name).split(name);
                        _queue.push(function (task){
                            _self._scanner.scanApplication(_paths[0], name, function (app){
                                _self.registerApplication(app);
                            }).then(function (){
                                task.done();
                            });
                        }, _self);
                    });

                    _queue.finally(function(){
                        _self.__onLoaded(_webPath);
                    }).start();

                } else {
                    //第一次扫描系统的项目
                    this.__scanWebRoot(this._serverPath + zn.SLASH + 'www' + zn.SLASH, function (){
                        //第二次扫描用户的项目
                        this.__scanWebRoot(_webPath, function (){
                            this.__onLoaded(_webPath);
                        }.bind(this));
                    }.bind(this));

                    /*
                    if(isRedeploy){
                        this.__scanWebRoot(_webPath, function (){
                            this.__onLoaded(_webPath);
                        }.bind(this));
                    } else {

                    }*/
                }
            },
            __scanWebRoot: function (path, callback){
                var _defer = zn.async.defer(),
                    _self = this;
                this._scanner.scanWebRoot(path, function (appContext){
                    _self.registerApplication(appContext);
                }).then(function (apps){
                    zn.info('[ End ] Scanning Path(Application:' + apps.length + '):' + path);
                    callback && callback(apps);
                    _defer.resolve(apps);
                }, function (error){
                    _defer.reject(error);
                });

                return _defer.promise;
            },
            __watch: function (path){
                if(this._watching){
                    return false;
                }
                var _path = node_path.join(process.cwd(), (this._config.watchCwd||''));
                this._watching = true;
                chokidar.watch('.', {
                    ignored: /[\/\\]\./,
                    cwd: _path,
                    interval: 100,
                    binaryInterval: 300,
                    depth: 99,
                    persistent: true
                }).on('raw', function(event, path, details) {
                    var _path = path || details.path || details.watchedPath;
                    if(_path.substr(-3, 3)=='.js'){
                        if(this._changedFiles.indexOf(_path)==-1 && event!=='unknown'){
                            this._changedFiles.push(_path);
                            zn.debug(event + ': ' + _path);
                            this._deployDelay = this._config.reDeployDelay || 3000;
                            this.__doFileChange(_path);
                        }
                    }
                }.bind(this));

                zn.info('Watching: ', _path);
            },
            __delayDeploy: function (){
                if(this._interval){
                    clearInterval(this._interval);
                    this._interval = null;
                }
                zn.info('Redeploying......');
                this.__init();
                return this.__scanWebPath(true);
            },
            __doFileChange: function (path){
                var _self = this;
                if(node_fs.existsSync(path)){
                    zn.module.unloadModule(path);
                }
                if(this._deployDelay>0){
                    if(!this._interval){
                        this._interval = setInterval(function (){
                            //zn.debug('Deploy delay ' + _self._deployDelay + 'ms');
                            if(_self._deployDelay>0){
                                _self._deployDelay = _self._deployDelay - 1000;
                            }else {
                                _self.__delayDeploy();
                            }
                        }, 1000);
                    }
                }else {
                    this.__delayDeploy();
                }
            },
            __onLoaded: function(path){
                if(path){
                    this.__watch(path);
                }
                var _interfaces = node_os.networkInterfaces(),
                    _interface = null,
                    _config = this._config;
                for(var key in _interfaces){
                    _interface = _interfaces[key];
                    _interface.forEach(function (value, index){
                        if(value.family == 'IPv4'){
                            zn.info(this.__getURL(value.address, _config.port));
                        }
                    }.bind(this));
                }

                zn.info(this._root);
                this.fire('loaded');
            },
            __getURL: function (host, port){
                return 'http://' + host + ":" + port;
            }
        }
    });

});
