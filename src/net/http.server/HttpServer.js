/**
 * Created by yangyxu on 8/20/14.
 */
zn.define([
    './config/zn.server.config.js',
    './HttpServerContext',
    'node:http',
    'node:path'
],function (
    config,
    HttpServerContext,
    node_http,
    node_path
) {

    var _package = require("../../../package.json");

    return zn.Class('HttpServer', {
        statics: {
            createServer: function (inArgs) {
                return new this(inArgs);
            }
        },
        events: ['request','connection','close'],
        properties: {
            context: null
        },
        methods: {
            init: function (args){
                var _config = zn.overwrite(args, config);
                this.__initNodePaths(_config);
                this.__createHttpServer(_config.port, _config.host);
                this.__createHttpServerContext(_config);
            },
            __initNodePaths: function (config){
                var paths = config.node_paths;
                if(!paths || !paths.forEach){
                    return false;
                }
                /*Add current path to NODE_PATH*/
                var _cwd = process.cwd(),
                    _path = null,
                    _parentPaths = [];
                paths.forEach(function (path){
                    _path = node_path.normalize(_cwd + node_path.sep + path);
                    _parentPaths = _parentPaths.concat([_path]);
                    if(config.includeParentPath){
                        _parentPaths = _parentPaths.concat(module.constructor._nodeModulePaths(_path));
                    }
                });

                if(_parentPaths.length){
                    process.env.NODE_PATH = _parentPaths.join(node_path.delimiter) + node_path.delimiter + process.env.NODE_PATH;
                    module.constructor._initPaths();
                    zn.NODE_PATHS = process.env.NODE_PATH.split(node_path.delimiter);
                }
            },
            __createHttpServer: function (port, host){
                var _httpServer = new node_http.Server();
                _httpServer.addListener('request', this.__onRequest.bind(this));
                _httpServer.addListener("connection", this.__onConnection.bind(this));
                _httpServer.addListener("close", this.__onClose.bind(this));
                _httpServer.listen(port, host);
                return _httpServer;
            },
            __createHttpServerContext: function (config){
                this._context = new HttpServerContext({
                    config: config,
                    webPath: process.cwd() + (config.catalog||''),
                    serverPath: __dirname
                });
            },
            __onRequest: function(request, response){
                try{
                    this.fire('request',request, response);
                    if('OPTIONS' == request.method){
                        response.writeHead(200, {
                            'Access-Control-Allow-Origin': (request.headers.origin || request.headers.host || request.headers.Host || ''),
                            'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, DELETE, PUT',
                            'Access-Control-Allow-Headers': 'Accept,Accept-Charset,Accept-Encoding,Accept-Language,Connection,Content-Type,Cookie,DNT,Host,Keep-Alive,Origin,Referer,User-Agent,X-CSRF-Token,X-Requested-With',
                            "Access-Control-Allow-Credentials": true,
                            'Access-Control-Max-Age': '3600',//一个小时时间
                            'X-Powered-By': (_package.name + '@' + _package.version),
                            'Content-Type': 'text/html;charset=utf-8',
                            'Trailer': 'Content-MD5'
                        });
                        response.write('<a href="https://github.com/yangyxu/Zeanium-Node">' + _package.name + '</a>');
                        response.addTrailers({'Content-MD5': zn.uuid()});
                        response.end();
                    }else {
                        this._context.accept(request, response);
                    }
                } catch (e){
                    zn.error('HttpServer.js __onRequest error: ' + e.message);
                    console.log(e.stack);
                }
            },
            __onConnection: function (socket) {
                //zn.debug("NEW HTTP Connection[ idleStart ]: " + socket._idleStart);
            },
            __onClose: function(){
                this.fire('close', this);
                zn.info("zeanium-server has closed.");
            }
        }
    });

});
