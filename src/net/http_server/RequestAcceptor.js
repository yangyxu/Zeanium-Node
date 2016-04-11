/**
 * Created by yangyxu on 8/20/14.
 */
zn.define([
    'node:chokidar',
    'node:fs',
    './RequestHandlerManager',
    './Request',
    './Response',
    './AppScanner'
],function (chokidar, fs, RequestHandlerManager, Request, Response, AppScanner) {

    return zn.class('RequestAcceptor', {
        static: true,
        methods: {
            init: function (){
                this._apps = {};
                this._handlerManagers = {};
                this._appScanner = new AppScanner();
            },
            registerHandlerManagers: function (){
                var _config = this._config;
                zn.each(_config.requestHandlers, function (handler, index){
                    var _TClassArgv = {
                        root: _config.webRoot,
                        apps: this._apps,
                        config: _config
                    }

                    handler.TClassArgv = zn.extend(_TClassArgv, handler.TClassArgv);
                    this.registerHandlerManager(handler);
                }.bind(this));
            },
            initHandlerManager: function (config){
                this._config = config;
                if(config.currentPath || fs.existsSync(config.webRoot+'zn.app.config.js')){
                    if(fs.existsSync(config.webRoot+'zn.app.config.js')) {
                        this._appScanner.scanProject(config.webRoot, '', function (app){
                            this._urlPrefix = app._deploy;
                            this.registerApplication(app);
                            this.__initFinished(config.webRoot);
                        }.bind(this));
                    } else {
                        this.registerHandlerManagers();
                        zn.info(this._config.__context__.root);
                    }
                } else {
                    this.__scanWebRoot(config.serverPath + zn.SLASH + 'www' + zn.SLASH);
                    this.__scanWebRoot(config.webRoot);
                }
            },
            registerHandlerManager: function (handler){
                this._handlerManagers[handler.name] = new RequestHandlerManager(handler);
            },
            registerApplication: function (app){
                if(!app){ return }
                var _deploy = app._deploy;
                var _app = this.resolveApplication(_deploy);
                if(_app){
                    zn.extend(app._controllers, _app._controllers);
                } else {
                    this._apps[_deploy] = app;
                }

                zn.info('Register Project(Application): ' + _deploy);
            },
            resolveApplication: function (deploy){
                return this._apps[deploy];
            },
            accept: function (serverRequest, serverResponse){
                if(serverRequest.url === '/favicon.ico'){
                    return serverResponse.end();
                }
                zn.debug('[ ' + serverRequest.method + ' ]: ' + serverRequest.url);
                if(this._urlPrefix){
                    serverRequest.url = zn.SLASH + this._urlPrefix + serverRequest.url;
                }
                var _url = serverRequest.url,
                    _handlerManager = null,
                    _result = null,
                    _match = false,
                    _req = new Request(serverRequest, this._config),
                    _res = new Response(serverResponse, _req);
                for(var key in this._handlerManagers){
                    _handlerManager = this._handlerManagers[key];
                    _match = _handlerManager.match(_url);
                    //zn.info('Do [' + key + '] request handler : ' + _match);
                    if(_match){
                        _result = _handlerManager.accept(_req, _res);
                        if(_result!==false){
                            _result = true;
                        }
                        if(_result === false) {
                            return;
                        }
                    }
                }

                if(!_result){
                    this._handlerManagers['mvc'].__getHandler().forword('_zn', '_error', '__404', _req, _res);
                }
            },
            __watch: function (path){
                chokidar.watch('.', {
                    ignored: /[\/\\]\./
                }).on('raw', function(event, path, details) {
                    this.__doFileChange(path);
                }.bind(this));
            },
            __doFileChange: function (path){
                if(path.substr(-3, 3)=='.js'){
                    zn.info('Redeploy WebRoot:' + this._config.webRoot);
                    this.initHandlerManager(this._config);
                }
            },
            __scanWebRoot: function (path){
                this._appScanner.scanWebRoot(path, function (app){
                    this.registerApplication(app);
                }.bind(this)).then(function (apps){
                    zn.info('[ End ] Scanning WebRoot:' + path);
                }.bind(this)).finally(function (){
                    if(this._config.webRoot === path){
                        this.__initFinished(path);
                    }
                }.bind(this));
            },
            __initFinished: function(path){
                //this.__watch(path);
                this.registerHandlerManagers();
                zn.info(this._config.__context__.root);
            }
        }
    });

});
