/**
 * Created by yangyxu on 8/20/14.
 */
zn.define([
    './index',
    './constants',
    './config',
    './MvcRequestHandler',
    './ResourceRequestHandler',
    './AppScanner',
    'node:http'
],function (
    controllers,
    constants,
    config,
    MvcRequestHandler,
    ResourceRequestHandler,
    AppScanner
    ) {

    var http = require('http'),
        url = require('url');

    return zn.class('HttpServer', {
        statics: {
            createServer: function (inArgs) {
                return new this(inArgs);
            }
        },
        events: ['request','connection','close'],
        properties: {

        },
        methods: {
            init: function (args){
                var _config = args||config;
                var _requestHandler = this._requestHandler = new (args.handler||MvcRequestHandler)(_config);
                this._resourceRequestHandler = new (args.resourceHandler||ResourceRequestHandler)(_config);
                var _httpServer = new http.Server();
                _httpServer.addListener('request', this.__onRequest.bind(this));
                _httpServer.addListener("connection", this.__onConnection.bind(this));
                _httpServer.addListener("close", this.__onClose.bind(this));
                _httpServer.listen(_config.port, _config.host);

                if(_requestHandler instanceof MvcRequestHandler){
                    var _appScanner = new AppScanner(),
                        _catalog = (_config.catalog||config.catalog);
                    /************load system default controllers************/
                    _requestHandler.__registerApp({
                        _controllers: _appScanner.__convertController(controllers)
                    });
                    /************load apps controllers************/
                    _appScanner.scan(_config.__dirname+_catalog, _catalog, function (app){
                        _requestHandler.__registerApp(app);
                    }).then(function (apps){

                    }).finally(function (){
                        zn.info('http://'+_config.host+":"+_config.port+"/[project]/[controller]/[action]");
                    });
                }else {
                    zn.info('http://'+_config.host+":"+_config.port);
                }
            },
            __onRequest: function(request, response){
                this.fire('request',request, response);
                if(this._requestHandler instanceof MvcRequestHandler){
                    var _pathname = url.parse(request.url, true).pathname;
                    var _extAry = /\.[^\.]+/.exec(_pathname);
                    if(_extAry){
                        request['EXT'] = _extAry[0];
                        request['PATH'] = _extAry['input'];
                        this._resourceRequestHandler.doRequest(request, response);
                    }else {
                        this._requestHandler.doRequest(request, response);
                    }
                }else {
                    this._requestHandler.doRequest(request, response);
                }
            },
            __onConnection: function (socket) {
                this.fire('connection', socket);
                zn.info("connection(idleStart):"+socket._idleStart);
            },
            __onClose: function(){
                this.fire('close', this);
                Logger.info("close");
            }
        }
    });

});